import { ConnectError, Interceptor, PromiseClient, createPromiseClient } from '@bufbuild/connect'
import { createConnectTransport } from '@bufbuild/connect-node'
import { RepositoryService } from './proto/aiserver/v1/repository_connectweb';
import { StartUploadRepoResponse, StartUploadRepoResponse_Status, UpdateFileRequest, UpdateFileResponse_Status, UploadFileResponse_Status, UploadRepositoryResponse, UploadRepositoryResponse_Status } from './proto/aiserver/v1/repository_pb';
import { File } from './proto/aiserver/v1/utils_pb';
import * as path from 'path'
import * as cp from 'child_process'
import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { promisify } from 'util';
import * as types from '@cursor/types';
import { isBinaryFile } from 'isbinaryfile';
import { Semaphore } from './utils';
import { Logger } from './logger';

const epsilon = 0.0001;
const loadFraction = 0.005;


function decodeJwt(accessToken: string) {
	const base64Payload = accessToken.split(".")[1];
	const payloadBuffer = Buffer.from(base64Payload, "base64");
	return JSON.parse(payloadBuffer.toString('utf-8')) as {
		iss: string,
		sub: string,
		aud: string[],
		iat: number,
		exp: number,
		azp: string,
		scope: string,
	};
}

function getHash(str: string) {
	const hash = crypto.createHash('sha256');
	hash.update(str);
	return hash.digest('hex');
}

const PATHS_TO_IGNORE_GLOBS: string[] = [
	'**/python?.?/**',
	'**/dist/**',
	'**/bin/**',
	'**/lib/**',
	'**/build/**',
	'**/.egg-info/**',
	'**/.venv/**',
	'**/node_modules/**',
	'**/__pycache__/**',
	// Generated by gpt3 below
	'**/.vscode/**',
	'**/.idea/**',
	'**/.vs/**',
	'**/.next/**',
	'**/.nuxt/**',
	'**/.cache/**',
	'**/.sass-cache/**',
	'**/.gradle/**',
	'**/.DS_Store/**',
	'**/.ipynb_checkpoints/**',
	'**/.pytest_cache/**',
	'**/.mypy_cache/**',
	'**/.tox/**',
	'**/.git/**',
	'**/.hg/**',
	'**/.svn/**',
	'**/.bzr/**',
	'**/.lock-wscript/**',
	'**/.wafpickle-[0-9]*/**',
	'**/.lock-waf_[0-9]*/**',
	'**/.Python/**',
	'**/.jupyter/**',
	'**/.vscode-test/**',
	'**/.history/**',
	'**/.yarn/**',
	'**/.yarn-cache/**',
	'**/.eslintcache/**',
	'**/.parcel-cache/**',
	'**/.cache-loader/**',
	'**/.nyc_output/**',
	'**/.node_repl_history/**',
	'**/.pnp.js/**',
	'**/.pnp/**',
]

const BAD_EXTENSIONS = new Set([
	'.pyc',
	'.zip',
	'.tar',
	'.gz',
	'.xpm',
	'.png',
	'.jpg',
	'.jpeg',
	'.gif',
	'.bmp',
	'.ico',
	'.tiff',
	'.tif',
])


type RepoClient = PromiseClient<typeof RepositoryService>;

type NeededRepoInfo = {
	repoName: string;
	repoOwner: string;
	relativeWorkspacePath: string;
}

type NewOrOldFile = {
	// Corresponds to a modified file or a moved file
	newFile: vscode.Uri;
	oldFile: vscode.Uri;
} | {
	// Corresponds to a deleted file
	newFile: undefined;
	oldFile: vscode.Uri;
} | {
	// Corresponds to a new file
	newFile: vscode.Uri;
	oldFile: undefined;
}
export class Indexer implements vscode.Disposable {
	private masterKey = 'allRepoInfo';

	private getWorkspaceKey(repoInfo: NeededRepoInfo) {
		const base = `map/${repoInfo.repoName}/${repoInfo.repoOwner}`
		return {
			// repoKey: `${base}/repo`,
			repoInfo: `${base}/repoInfo`,
			oldHashes: `${base}/oldHashes`,
			oldSizes: `${base}/oldSizes`
		};
	}

	private repoClient?: RepoClient;

	// private oldHashes = new Map<string, Map<string, string>>();
	// private oldSizes = new Map<string, number>();

	private storedRepoInfo: NeededRepoInfo[] = [];

	private accessToken?: string;
	private backendUrl?: string;

	private disposables: vscode.Disposable[] = [];
	private disposableIntervals: NodeJS.Timeout[] = [];

	private readonly _onDidInterruptIndexing = new vscode.EventEmitter<void>();
	readonly onDidInterruptIndexing = this._onDidInterruptIndexing.event;

	constructor(
		private readonly context: vscode.ExtensionContext
	) {

		// When the CursorAuthToken changes, we need to update the accessToken
		this.disposables.push(vscode.cursor.onDidChangeCursorAuthToken((
			(e: vscode.cursor.CursorAuthToken) => {
				this.accessToken = e;
				this.createRepositoryClient().catch(Logger.error);
			}
		)));

		// When cursor creds (our backend url) changes, point repoServer at a diff backend
		this.disposables.push(vscode.cursor.onDidChangeCursorCreds((
			(e: vscode.cursor.CursorCreds) => {
				this.backendUrl = e.repoBackendUrl
				this.createRepositoryClient().catch(Logger.error);
			}
		)));

		this.disposables.push(vscode.cursor.onDidRequestRepoIndex(async () => {
			// We abort any indexing attempts
			this._onDidInterruptIndexing.fire();

			// We create an abort controller for the indexing
			const repoIndexAbortController = new AbortController();

			// The controller is aborted when the user requests an interrupt
			this.onDidInterruptIndexing(() => repoIndexAbortController.abort());

			const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri;
			if (workspaceRoot === undefined) {
				return;
			}

			const owner = this.getAuthId();

			if (owner === undefined) {
				// There is an error as not logged in
				// TODO - we need to alert the main process to send an error
				return;
			}
			// Get the last folder in the workspace root
			const folderName = path.basename(workspaceRoot.fsPath);
			const repo = getHash(workspaceRoot.fsPath) + '-' + folderName;
			// const relativePath = repoInfo.relativeWorkspacePath;

			const repoInfo = {
				repoName: repo,
				repoOwner: owner,
				relativeWorkspacePath: '',
			}

			for (let retryNumber = 0; retryNumber < 3; retryNumber++) {
				try {
					return await this.uploadFiles(repoInfo, workspaceRoot, repoIndexAbortController.signal)
				} catch (e) {
					Logger.info('RETRYING ON', e)
					Logger.error(e)
				}
			}
			// Try one last time
			return await this.uploadFiles(repoInfo, workspaceRoot, repoIndexAbortController.signal)
		}));

		this.disposables.push(vscode.cursor.onDidRequestRepoInterrupt(() => {
			this._onDidInterruptIndexing.fire();
		}));

		this.disposables.push(vscode.cursor.onDidRequestRepoUpdateIndex(async () => {
			this._onDidInterruptIndexing.fire();

			const repoUpdateAbortController = new AbortController();
			this.onDidInterruptIndexing(() => repoUpdateAbortController.abort());

			const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri;
			if (workspaceRoot === undefined) {
				return;
			}

			const owner = this.getAuthId();

			if (owner === undefined) {
				// There is an error as not logged in
				// TODO - we need to alert the main process to send an error
				return;
			}
			const repo = getHash(workspaceRoot.fsPath);
			// const relativePath = repoInfo.relativeWorkspacePath;

			const repoInfo = {
				repoName: repo,
				repoOwner: owner,
				relativeWorkspacePath: '',
			}
			// Then we start uploading the file
			for (let retryNumber = 0; retryNumber < 3; retryNumber++) {
				try {
					// We start the upload
					return await this.updateFiles(repoInfo, workspaceRoot, repoUpdateAbortController.signal)
				} catch (e) {
					Logger.info('RETRYING ON', e)
					Logger.error(e)
				}

				// Try one last time
				return await this.updateFiles(repoInfo, workspaceRoot, repoUpdateAbortController.signal)
			}
		}));

		// hacky but doesnt seem to work otherwise
		const getInitialValues = async () => {
			while (this.backendUrl === undefined) {
				this.accessToken = vscode.cursor.getCursorAuthToken();
				this.backendUrl = vscode.cursor.getCursorCreds()?.repoBackendUrl;
				await this.createRepositoryClient()
				await new Promise(resolve => setTimeout(resolve, 500));
			}
		}

		getInitialValues().then(() => {
			Logger.info('CURSOR LOG: Finished creating repo client!')
		}).catch(Logger.error);

		// const prevUploadData = this.context.workspaceState.get('prevUploadData') as undefined | [string, {
		// 	oldHashes: [string, string][];
		// 	oldSizes: [string, number][];
		// }][];
		// if (prevUploadData !== undefined) {
		// 	for (const [repoPath, { oldHashes, oldSizes }] of prevUploadData) {
		// 		this.prevUploadData.set(repoPath, {
		// 			oldHashes: new Map(oldHashes),
		// 			oldSizes: new Map(oldSizes),
		// 		});
		// 	}
		// }
		this.hydrateRunningRepos();

	}

	getAuthId(): string | undefined {
		const token = this.accessToken
		if (token === undefined) {
			return undefined;
		}

		const decoded = decodeJwt(token);
		return decoded.sub;
	}

	dispose() {
		for (const disposable of this.disposables) {
			disposable.dispose();
		}
	}

	private hydrateRunningRepos() {
		// We get all the repos that are stored
		this.storedRepoInfo = this.context.workspaceState.get(this.masterKey) as NeededRepoInfo[] ?? [];
		// Then for each repo, we start the watch/updating process
		this.storedRepoInfo.forEach((repoInfo) => {
			const key = this.getWorkspaceKey(repoInfo);
			const fullRepoInfo = this.context.workspaceState.get(key.repoInfo) as undefined | vscode.cursor.RepoInfo;
			if (fullRepoInfo === undefined) {
				Logger.error(`Could not find repo info for ${repoInfo.repoName} ${repoInfo.repoOwner}`);
				return;
			}

			this.scheduleRepoUpdate(fullRepoInfo);
		})
	}

	private scheduleRepoUpdate(repoInfo: vscode.cursor.RepoInfo) {
		this.disposableIntervals.push(
			setInterval(async () => {
				const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
				if (workspaceRoot === undefined) {
					Logger.error('Workspace root was undefined!');
					return;
				}
				const relativePath = repoInfo.relativeWorkspacePath;

				const repoPath = path.join(workspaceRoot, relativePath);
				const repoUri = vscode.Uri.file(repoPath);
				const abortController = new AbortController();
				this.onDidInterruptIndexing(() => abortController.abort());
				await this.updateFiles(repoInfo, repoUri, abortController.signal);
				// Every 120 mins
			}, 120 * 60 * 1000)
		);
	}



	private getStoredRepoData(
		repoInfo: vscode.cursor.RepoInfo,
	) {
		const workspaceKey = this.getWorkspaceKey(repoInfo);

		// Otherwise, we get the stored value
		const oldHashes = this.context.workspaceState.get(workspaceKey.oldHashes) as undefined | [string, string][];
		const oldSizes = this.context.workspaceState.get(workspaceKey.oldSizes) as undefined | [string, number][];
		if (oldHashes === undefined || oldSizes === undefined) {
			return undefined;
		}
		return {
			oldHashes: new Map(oldHashes),
			oldSizes: new Map(oldSizes),
		};

	}

	private async setStoredRepoData(
		repoInfo: vscode.cursor.RepoInfo,
		newHashes: Map<string, string>,
		newSizes: Map<string, number>,
	) {

		this.storedRepoInfo = this.storedRepoInfo.filter((storedRepoInfo: NeededRepoInfo) => {
			return (
				storedRepoInfo.repoName !== repoInfo.repoName ||
				storedRepoInfo.repoOwner !== repoInfo.repoOwner ||
				storedRepoInfo.relativeWorkspacePath !== repoInfo.relativeWorkspacePath
			)
		});
		this.storedRepoInfo.push(repoInfo);
		await this.context.workspaceState.update(this.masterKey, this.storedRepoInfo);

		const workspaceKey = this.getWorkspaceKey(repoInfo);

		Logger.trace('setting Raw old sizes', [...newSizes.entries()]);

		await this.context.workspaceState.update(workspaceKey.oldHashes, [...newHashes.entries()]);
		await this.context.workspaceState.update(workspaceKey.oldSizes, [...newSizes.entries()]);
		await this.context.workspaceState.update(workspaceKey.repoInfo, repoInfo);

		// this.oldHashes = newHashes;
		// this.oldSizes = newSizes;
	}

	private isInBadDir(file: vscode.Uri) {
		const itemPath = vscode.workspace.asRelativePath(file.fsPath);
		const isBadDir = (
			(
				itemPath.includes('node_modules') ||
				itemPath.includes('.git')
			) &&
			!(
				itemPath.endsWith('.git') ||
				itemPath.endsWith('node_modules')
			)
		)
		return isBadDir;
	}

	private async isBadFile(file: vscode.Uri) {
		const itemPath = vscode.workspace.asRelativePath(file.fsPath);
		if (
			path.basename(itemPath) === 'package-lock.json' ||
			path.basename(itemPath) === 'yarn.lock' ||
			itemPath.includes('.git')
		) {
			return true
		}

		if (BAD_EXTENSIONS.has(path.extname(itemPath))) {
			return true
		}


		// if any parent folders have dot in front of them, then ignore
		const parts = itemPath.split(path.sep)
		for (let i = 0; i < parts.length; i++) {
			if (parts[i].startsWith('.')) {
				return true
			}
		}

		// Check the size of the file with fs
		let size;
		try {
			size = (await vscode.workspace.fs.stat(file)).size;
		} catch (e) {
			// Otherwise, the file does not exist
			Logger.error(e)
			return false;
		}
		//
		// If the size is greater than 2MB, don't index it
		if (size > 2 * 1024 * 1024) {
			return true;
		}

		const readFile = await vscode.workspace.fs.readFile(file);
		const bufferFile = Buffer.from(readFile);
		const isBinary = await isBinaryFile(bufferFile);
		if (isBinary) {
			return true;
		}

		return false;
	}

	async createRepositoryClient() {
		// We can only create a repo client if we have a valid backendUrl
		// and a valid accessToken
		if (this.accessToken === undefined) {
			this.repoClient = undefined;
			return
		} else if (this.backendUrl === undefined) {
			this.repoClient = undefined;
			return
		}

		const bearerTokenInterceptor: Interceptor = (next) => async (req) => {
			req.header.set("Authorization", `Bearer ${this.accessToken}`);
			return await next(req);
		};

		const transport = createConnectTransport({
			// TODO: make this into an ENV variable
			httpVersion: "1.1",
			baseUrl: this.backendUrl,
			interceptors: [bearerTokenInterceptor],
			jsonOptions: {
				ignoreUnknownFields: true,
			}
		});

		this.repoClient = createPromiseClient(RepositoryService, transport);
	}


	// Uses gitignore to get the list of files to ignore in the current
	// workspace root
	async listIgnoredFiles(workspaceRootPath: string): Promise<Set<string>> {
		const gitignoredFiles = new Set<string>()

		try {
			for (const [gitCmd, ...gitArgs] of [
				['git', 'ls-files', '--others', '--ignored', '--exclude-standard'],
				['git', 'submodule', 'foreach', '--quiet', `'git ls-files --others --ignored --exclude-standard | sed "s|^|$path/|"'`]

			]) {
				// const gitListCommand = cp.spawn(gitCmd, { cwd: workspaceRootPath })
				const gitListCommand = cp.spawn(gitCmd, gitArgs, { cwd: workspaceRootPath })
				gitListCommand.stdout.on('data', (data: string) => {
					const files = data.toString()
						.split('\n')
						.filter((filename: string) => filename.length > 0);

					files.forEach((file: string) => {
						gitignoredFiles.add(path.join(workspaceRootPath, file))
					})
				});

				await new Promise((resolve, reject) => {
					gitListCommand.on('close', resolve);
					gitListCommand.on('error', reject);
					gitListCommand.on('exit', resolve);
				});
			}
		} catch (e) { }
		return gitignoredFiles;
	}
	async getHash(file: vscode.Uri): Promise<string> {
		// Read the file contents as a buffer
		const buffer = await vscode.workspace.fs.readFile(file);

		// Get the sha256 hash of the file
		const hash = crypto.createHash('sha256');
		hash.update(buffer);

		return hash.digest('hex');
	}

	async getIterableWorkspaceFiles(workspaceRoot: vscode.Uri) {
		const candidateFiles = (await vscode.cursor.getAllFiles()).map((f: string) => vscode.Uri.file(f));

		const badFileNames = await this.listIgnoredFiles(workspaceRoot.fsPath);

		// Filter out the bad filenames
		let filteredFiles = candidateFiles.filter((file: vscode.Uri) => !badFileNames.has(file.fsPath));

		// 500 open files at a time
		const readSemaphore = new Semaphore(800);

		const numFiles = filteredFiles.length;
		Logger.info('NUM FILES', numFiles)
		let numFilesRead = 0;

		filteredFiles = (await Promise.all(
			filteredFiles.map(async (file: vscode.Uri) => readSemaphore.withSemaphore(
				async () => {
					if (numFilesRead % 50 === 0) {
						vscode.cursor.updateUploadProgress(
							(numFilesRead / numFiles) * loadFraction,
							vscode.UploadType.Upload
						);
					}
					if (!this.isInBadDir(file) && !await this.isBadFile(file)) {
						numFilesRead++;
						return file;
					} else {
						numFilesRead++;
						return null
					}
				})
			))).filter((file: vscode.Uri | null): file is vscode.Uri => file !== null);

		// Randomly shuffle
		filteredFiles.sort(() => Math.random() - 0.5);

		Logger.trace('Sample of chosen files', filteredFiles.slice(0, 100));

		// Then we mark the progress by looking at the total size of all files
		const fileSizes = await Promise.all(filteredFiles.map((file: vscode.Uri) => vscode.workspace.fs.stat(file).then(stat => stat.size)))

		return {
			files: filteredFiles,
			fileSizes: fileSizes,
		}

	}

	/// Uploads all files in the workspace to the backend
	async uploadFiles(repoInfo: vscode.cursor.RepoInfo, workspaceRoot: vscode.Uri, abortSignal: AbortSignal) {

		const repoClient = this.repoClient;
		if (repoClient === undefined) {
			throw new Error('Repo client is undefined');
		}

		const result = await this.getIterableWorkspaceFiles(workspaceRoot);
		const { files, fileSizes } = result;

		const totalFileSize = fileSizes.reduce((a: number, b: number) => a + b, 0);
		Logger.info('Total Files', files.length, 'Total File Size', totalFileSize / 1e6, 'MB')

		let runningFileSize = 0;

		// Not too large otherwise, we hit the openai rate limit
		const MAX_CONCURRENT_UPLOADS = 10;

		// We start the upload
		// TODO - verify that the repo is not already uploading and/or is in a valid
		// state
		const response = await repoClient.startUploadRepo({
			repository: {
				...repoInfo,
				isLocal: true,
			},
		}, {
			// We allow for a 3 minute timeout in the case of a new index creation
			timeoutMs: 3 * 60 * 1000,
		});

		let numConsecutiveErrors = 0;

		let seenFiles = new Set<string>();
		if (response.status === StartUploadRepoResponse_Status.ALREADY_EXISTS) {
			seenFiles = new Set(response.seenFiles);
		}

		const newSizes = new Map<string, number>();
		const newHashes = new Map<string, string>();


		// For now we just do the hacky thing of a random uuid
		const fakeCommitShaForUniqueness = crypto.randomUUID();

		// Iterate through the seen files and update progress
		for (const seenFile of response.seenFiles) {
			// Get the full uri given workspace uri
			const fullUri = vscode.Uri.joinPath(workspaceRoot, seenFile);
			// Check if the file exists
			let size;
			try {
				size = await vscode.workspace.fs.stat(fullUri).then(stat => stat.size);
			} catch (e) {
				// If it doesn't exist, we can skip it
				continue;
			}

			const hash = await this.getHash(fullUri);
			newSizes.set(fullUri.fsPath, size);
			newHashes.set(fullUri.fsPath, hash);
			runningFileSize += size;
		}

		vscode.cursor.updateUploadProgress((runningFileSize / totalFileSize) * (1 - loadFraction) + loadFraction, vscode.UploadType.Upload);


		let runningJobs: {
			id: string,
			future: Promise<string>
		}[] = [];

		for (const [index, file] of files.entries()) {
			if (abortSignal.aborted) {
				return;
			}
			const relativePath = vscode.workspace.asRelativePath(file.fsPath);
			// If we've already seen it, we can skip it
			if (seenFiles.has(relativePath)) {
				continue
			}

			if (numConsecutiveErrors >= 5) {
				Logger.error('Abandoned upload due to too many errors')
				return;
			}

			const currentFileSize = fileSizes[index];

			while (runningJobs.length > MAX_CONCURRENT_UPLOADS) {
				// We wait until a promise has resolved
				const evictedFutureId = await Promise.race(runningJobs.map(job => job.future));
				runningJobs = runningJobs.filter(job => job.id !== evictedFutureId);
			}

			// We upload the file asynchronously...
			const jobUuid = crypto.randomUUID();
			const jobFuture = (async () => {
				const successfullyUploadedFile = await this.uploadFileWithRetries({
					repoClient,
					repoInfo,
					file,
					workspaceRoot,
					commitSha: fakeCommitShaForUniqueness,
				});
				if (successfullyUploadedFile) {
					numConsecutiveErrors = 0;
					newSizes.set(file.fsPath, currentFileSize);
					newHashes.set(file.fsPath, await this.getHash(file));
				} else {
					numConsecutiveErrors++;
				}

				runningFileSize += currentFileSize;
				return jobUuid;
			})

			runningJobs.push({
				id: jobUuid,
				future: jobFuture(),
			})

			if (index % 5 === 0) {
				// We update the upload progress
				if (!abortSignal.aborted)
					vscode.cursor.updateUploadProgress(
						(runningFileSize / totalFileSize) * (1 - loadFraction) + loadFraction,
						vscode.UploadType.Upload
					);
			}
		}

		// Then we wait for the remaining jobs to finish
		await Promise.all(runningJobs.map(job => job.future));

		// We update the file sizes and hashes
		await this.setStoredRepoData(repoInfo, newHashes, newSizes);

		// Then we mark as done
		vscode.cursor.updateUploadProgress(1, vscode.UploadType.Upload);

		const uploadResponse = await repoClient.finishUploadRepo({
			repository: repoInfo,
		});

		// Finally, we schedule updates
		this.scheduleRepoUpdate(repoInfo);

		// Then we tell the progress bar to remove itself
		vscode.cursor.updateUploadProgress(1, vscode.UploadType.Upload, true);
	}

	private async uploadFileWithRetries(
		{
			repoClient,
			repoInfo,
			file,
			workspaceRoot,
			commitSha,
		}: {
			repoClient: RepoClient;
			repoInfo: vscode.cursor.RepoInfo;
			file: vscode.Uri;
			workspaceRoot: vscode.Uri;
			commitSha: string;
		}) {


		const queueId = crypto.randomUUID();
		const allottedFailures = 5;
		const allotedQueueTries = 10;
		const runHelper: (numFailures?: number, numQueueRetries?: number) => Promise<boolean> =
			async (numFailures = 0, numQueueRetries = 0) => {
				if (numFailures >= allottedFailures) {
					throw new Error(`Failed to upload file after ${allottedFailures} tries`);
				} else if (numQueueRetries >= allotedQueueTries) {
					throw new Error(`Failed to upload file after ${allotedQueueTries} tries`);
				}

				const response = await this.uploadFile(repoClient, repoInfo, file, workspaceRoot, commitSha, queueId);

				try {
					if (response.status === UploadFileResponse_Status.FAILURE) {
						// Sleep based on num failures
						numFailures++;
						await new Promise(resolve => setTimeout(resolve, 500 * (2 ** numFailures)));
						return runHelper(numFailures, numQueueRetries);
					} else if (response.status === UploadFileResponse_Status.SUCCESS ||
						response.status === UploadFileResponse_Status.EXPECTED_FAILURE) {
						return true;
					} else if (response.status === UploadFileResponse_Status.QUEUE_BACKED_UP) {
						numQueueRetries++;
						await new Promise(resolve => setTimeout(resolve, 500 * (2 ** numQueueRetries)));
						return runHelper(numFailures, numQueueRetries);
					} else {
						throw new Error(`Unknown status ${response.status}`);
					}
				} catch (e) {
					Logger.error(e);
					numFailures++;
					return runHelper(numFailures, numQueueRetries);
				}
			}

		return await runHelper();
	}

	// We handle file updates here!!
	async updateFiles(repoInfo: vscode.cursor.RepoInfo, workspaceRoot: vscode.Uri, abortSignal: AbortSignal) {
		const repoClient = this.repoClient;
		if (repoClient === undefined) {
			throw new Error('Repo client is undefined');
		}

		const { files, fileSizes } = await this.getIterableWorkspaceFiles(workspaceRoot);

		const totalFileSize = fileSizes.reduce((a: number, b: number) => a + b, 0);

		let runningFileSize = 0;
		const MAX_CONCURRENT_UPLOADS = 10;

		// TODO - verify that the repo is not already uploading and/or is in a valid state
		await repoClient.startUpdateRepo({
			repository: repoInfo,
		});


		const newSizes = new Map<string, number>();
		const newHashes = new Map<string, string>();

		const oldHashesSizes = this.getStoredRepoData(repoInfo);
		if (oldHashesSizes === undefined) {
			throw new Error('Old hashes and sizes are undefined');
		}
		const { oldSizes, oldHashes } = oldHashesSizes;
		Logger.info('GOT OLD SIZES', oldSizes)

		// For now we just do the hacky thing of a random uuid
		const fakeCommitShaForUniqueness = crypto.randomUUID();

		let numConsecutiveErrors = 0;

		let runningJobs: {
			id: string;
			future: Promise<string>;
		}[] = [];

		for (const [index, file] of files.entries()) {
			if (abortSignal.aborted) {
				return;
			}
			const currentFileSize = fileSizes[index];
			const currentHash = await this.getHash(file);
			runningFileSize += currentFileSize;


			if (oldHashes.get(file.fsPath) === currentHash) {
				// Skip
				newSizes.set(file.fsPath, currentFileSize);
				newHashes.set(file.fsPath, currentHash);
				continue
			}

			if (numConsecutiveErrors >= 5) {
				throw new Error('Too many concurrent errors');
			}


			while (runningJobs.length >= MAX_CONCURRENT_UPLOADS) {
				const finishedJobId = await Promise.race(runningJobs.map(job => job.future));
				runningJobs = runningJobs.filter(job => job.id !== finishedJobId);
			}

			if (abortSignal.aborted) {
				return;
			}

			const jobId = crypto.randomUUID();
			const job = (async () => {
				let success;
				if (oldHashes.has(file.fsPath)) {
					// In the case that the file exists in the last index, we know that this
					// represents a modification, meaning we need to remove the old file from
					// the db and add a new copy
					success = await this.updateFileWithRetries({
						repoClient,
						repoInfo,
						modifiedFileInfo: {
							newFile: file,
							oldFile: file,
						},
						workspaceRoot,
						commitSha: fakeCommitShaForUniqueness
					});
				} else {
					// In the case that the file does not exist in the last index, we know that
					// this represents a new file, meaning we need to add this new file to the db
					// and remove nothing
					success = await this.updateFileWithRetries({
						repoClient,
						repoInfo,
						modifiedFileInfo: {
							newFile: file,
							oldFile: undefined,
						},
						workspaceRoot,
						commitSha: fakeCommitShaForUniqueness
					});
				}

				if (success) {
					// We need to set the new size
					newSizes.set(file.fsPath, currentFileSize);
					newHashes.set(file.fsPath, currentHash);
					numConsecutiveErrors = 0;
				} else {
					numConsecutiveErrors++;
				}
				return jobId;

			})

			runningJobs.push({
				id: jobId,
				future: job(),
			});

			if (index % 5 === 0) {
				// We update the upload progress
				if (!abortSignal.aborted)
					vscode.cursor.updateUploadProgress(
						((runningFileSize / totalFileSize) * 0.8) * (1 - loadFraction) + loadFraction,
						vscode.UploadType.Syncing
					);
			}
		}

		await Promise.all(runningJobs.map(job => job.future));
		// Finally, we delete all files that are no longer in the workspace
		const oldFiles = new Set(oldHashes.keys());
		[...newHashes.keys()].forEach((key) => oldFiles.delete(key));

		runningJobs = [];

		let numDeletedFiles = 0;
		numConsecutiveErrors = 0;
		for (const [index, deletedFile] of [...oldFiles].entries()) {
			while (runningJobs.length >= MAX_CONCURRENT_UPLOADS) {
				const finishedId = await Promise.race(runningJobs.map(job => job.future));
				runningJobs = runningJobs.filter(job => job.id !== finishedId);
			}
			if (abortSignal.aborted) {
				return;
			}

			if (numConsecutiveErrors >= 5) {
				throw new Error('Too many concurrent errors');
			}

			const jobId = crypto.randomUUID();
			const job = (async () => {
				// We upload the file
				numDeletedFiles++;
				const successfulUpload = await this.updateFileWithRetries({
					repoClient,
					repoInfo,
					modifiedFileInfo: {
						newFile: undefined,
						oldFile: vscode.Uri.file(deletedFile),
					},
					workspaceRoot,
					commitSha: fakeCommitShaForUniqueness
				});

				if (successfulUpload) {
					numConsecutiveErrors = 0;
				} else {
					numConsecutiveErrors++;
				}
				return jobId;
			});

			runningJobs.push({
				id: jobId,
				future: job(),
			});

			if (index % 5 === 0) {
				// We update the upload progress
				if (!abortSignal.aborted)
					vscode.cursor.updateUploadProgress(
						(0.8 + (numDeletedFiles / oldFiles.size) * 0.2) * (1 - loadFraction) + loadFraction,
						vscode.UploadType.Syncing
					);
			}
		}
		// Wait for the remaining jobs to finish
		await Promise.all(runningJobs.map(job => job.future));

		// Then we mark as done
		if (!abortSignal.aborted)
			vscode.cursor.updateUploadProgress(1, vscode.UploadType.Syncing);

		await this.setStoredRepoData(repoInfo, newHashes, newSizes);

		await repoClient.finishUpdateRepo({
			repository: repoInfo,
		});

		if (!abortSignal.aborted)
			vscode.cursor.updateUploadProgress(1, vscode.UploadType.Syncing, true);
	}

	private async updateFileWithRetries(
		{
			repoClient,
			repoInfo,
			modifiedFileInfo,
			workspaceRoot,
			commitSha,
		}: {
			repoClient: RepoClient;
			repoInfo: vscode.cursor.RepoInfo;
			modifiedFileInfo: NewOrOldFile;
			workspaceRoot: vscode.Uri;
			commitSha: string;
		}) {


		const queueId = crypto.randomUUID();
		const allottedFailures = 5;
		const allotedQueueTries = 10;
		const runHelper: (numFailures?: number, numQueueRetries?: number) => Promise<boolean> =
			async (numFailures = 0, numQueueRetries = 0) => {
				if (numFailures >= allottedFailures) {
					throw new Error(`Failed to upload file after ${allottedFailures} tries`);
				} else if (numQueueRetries >= allotedQueueTries) {
					throw new Error(`Failed to upload file after ${allotedQueueTries} tries`);
				}

				const response = await this.updateFile(repoClient, repoInfo, modifiedFileInfo, workspaceRoot, commitSha, queueId);

				try {
					if (response.status === UpdateFileResponse_Status.FAILURE) {
						// Sleep based on num failures
						numFailures++;
						await new Promise(resolve => setTimeout(resolve, 500 * (2 ** numFailures)));
						return runHelper(numFailures, numQueueRetries);
					} else if (
						response.status === UpdateFileResponse_Status.SUCCESS ||
						response.status === UpdateFileResponse_Status.EXPECTED_FAILURE) {
						return true;
					} else if (response.status === UpdateFileResponse_Status.QUEUE_BACKED_UP) {
						numQueueRetries++;
						await new Promise(resolve => setTimeout(resolve, 500 * (2 ** numQueueRetries)));
						return runHelper(numFailures, numQueueRetries);
					} else {
						throw new Error(`Unknown status ${response.status}`);
					}
				} catch (e) {
					Logger.error(e);
					numFailures++;
					return runHelper(numFailures, numQueueRetries);
				}
			}

		return await runHelper();
	}

	private async uploadFile(repoClient: RepoClient, repoInfo: vscode.cursor.RepoInfo, file: vscode.Uri, workspaceRoot: vscode.Uri, commitSha: string, queueId: string) {
		// Get the file contents and upload
		const fileContent = await vscode.workspace.fs.readFile(file);
		const fileContentAsString = new TextDecoder("utf-8").decode(fileContent);

		return await repoClient.uploadFile({
			repository: repoInfo,
			file: {
				relativeWorkspacePath: path.relative(workspaceRoot.fsPath, file.fsPath),
				contents: fileContentAsString,
			},
			commitSha: commitSha,
			queueId
		});
	}
	private async updateFile(repoClient: RepoClient, repoInfo: vscode.cursor.RepoInfo, modifiedFileInfo: NewOrOldFile, workspaceRoot: vscode.Uri, commitSha: string, queueId: string) {
		const updateRequest = new UpdateFileRequest({
			repository: repoInfo,
			commitSha: commitSha,
			queueId
		})

		if (modifiedFileInfo.newFile !== undefined) {
			const newFileContent = await vscode.workspace.fs.readFile(modifiedFileInfo.newFile);
			const newFileContentAsString = new TextDecoder("utf-8").decode(newFileContent);

			updateRequest.addedFile = new File({
				relativeWorkspacePath: path.relative(workspaceRoot.fsPath, modifiedFileInfo.newFile.fsPath),
				contents: newFileContentAsString,
			})
		}
		if (modifiedFileInfo.oldFile !== undefined) {
			updateRequest.deletedFilePath = path.relative(workspaceRoot.fsPath, modifiedFileInfo.oldFile.fsPath);
		}
		return await repoClient.updateFile(updateRequest);
	}
}
