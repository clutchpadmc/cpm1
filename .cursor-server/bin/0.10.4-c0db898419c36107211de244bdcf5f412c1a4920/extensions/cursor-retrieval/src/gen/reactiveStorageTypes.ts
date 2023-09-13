/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Anysphere Inc. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

// THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY.
/*

* Bridge File Created by Aman
* Do not add imports from this file unless you know what you are doing!

* TODO - figure out how to allow imports from vs/base, which can then feed into Cursor Extension Hooks!

*/
import { CodeResult, FileResult, RepositoryInfo, RepositoryStatusResponse } from 'proto/aiserver/v1/repository_pb';

import { PlainMessage } from 'external/bufbuild/protobuf';
import { CodeBlock, File as ProtoFile } from 'proto/aiserver/v1/utils_pb';

export enum UploadType {
	Upload = 'upload',
	Syncing = 'syncing',
}

export type CursorCredentials = {
	websiteUrl: string;
	backendUrl: string;
	auth0ClientId: string;
	auth0Domain: string;
	// No migration needed to add this field I believe
	repoBackendUrl: string;
};

// TODO - figure out how to sync enums
export type RepoInfo = Pick<PlainMessage<RepositoryInfo>, 'repoName' | 'repoOwner' | 'relativeWorkspacePath'>;
export type CursorAuthToken = string | undefined;

// This is another option - TODO - determine what is best


// The rest of these for now are not needed as extensions
export interface Doc {
	name: string;
	identifier: string;
	url?: string;
	isDifferentPrefixOrigin?: boolean;
}
export interface DocsState {
	visibleDocs: Doc[];
	usableDocs: Doc[];
}

export interface MultiEditChunk {
	text: string;
	fsPath: string;
	path: string;
	currentSelection: string;
	precedingCode: string[];
	suffixCode: string[];
	fileContents: string;
	startLineNumber: number;
	endLineNumber: number;
}


export interface RepositoryInformation {
	// Get the sync status directly from the repository service
	id: string;
	content: RepositoryStatusResponse;
}

export type DocSelection = {
	docId: string;
	name: string;
	uuid?: string;
};

export type ErrorSource = "chat" | "cmd-k" | "other";

export type ErrorTypeMetadata =
	((
		{
			case: 'internet';
			generationUUID: string;
			errorCode: number | undefined;
		} | {
			case: 'openai'
		}
		| { case: 'cursor_rate_limit' }
		| { case: 'openai_rate_limit' }
	) & {
		source: ErrorSource;
	})
	| { case: null };

export type ChatAIGenerationMetadata = {
	type: 'chat';
	// the originating tab for the chat request
	tabId: string;
	// the originating bubble ID for the chat request
	bubbleId: string;
	// Whether or not we are using context
	useReranker?: boolean;
	// the type of the request
	chatType: 'chat' | 'context' | 'toolformer' | 'intentChat';
	intentDetermined?: boolean;
	summaryText?: string;
	summaryUpUntilIndex?: number;
	codeBlocks?: PlainMessage<CodeBlock>[];
};

export type CodeInterpreterAIGenerationMetadata = {
	type: 'codeInterpreter';
	tabId: string;
	bubbleId: string;
}


export type CurrentFile = {
	relativeFilePath: string;
	// precedingCode?: CursorRange[];
	// currentCode?: CursorRange[];
	// suffixCode?: CursorRange[];
	// includePrecedingLines?: boolean;
	// includeSelectedLines?: boolean;
	// includeSucceedingLines?: boolean;
};

type FileWithoutContents = Omit<PlainMessage<ProtoFile>, 'contents'> & {
	contents?: never
};
type CodeBlockWithoutContents = Omit<PlainMessage<CodeBlock>, 'fileContents'> & {
	fileContents?: never
};
export type FileResultWithoutContents = Omit<PlainMessage<FileResult>, 'file'> & {
	file?: FileWithoutContents
}
export type CodeResultWithoutContents = Omit<PlainMessage<CodeResult>, 'codeBlock'> & {
	codeBlock?: CodeBlockWithoutContents
}


export type RepoWideContext = {
	fileResults?: FileResultWithoutContents[];
	codeResults?: CodeResultWithoutContents[];
};


// This stores all the metadata for a given chat bubble that the user
// either requests or is predicted by the AI

export type TaskGenerationMetadata = {
	type: 'task';
	// the originating task for the request
	taskId: string;
};


export type LineRange = {
	// 1-indexed
	startLineNumber: number;
	// 1-indexed and exclusive
	endLineNumberExclusive: number;
};

export type RSRange = {
	/**
	 * Line number on which the range starts (starts at 1).
	 */
	startLineNumber: number;
	/**
	 * Column on which the range starts in line `startLineNumber` (starts at 1).
	 */
	startColumn: number;
	/**
	 * Line number on which the range ends.
	 */
	endLineNumber: number;
	/**
	 * Column on which the range ends in line `endLineNumber`.
	 */
	endColumn: number;
};


export type RSPosition = {
	/**
	 * line number (starts at 1)
	 */
	readonly lineNumber: number;
	/**
	 * column (the first character in a line is between column 1 and column 2)
	 */
	readonly column: number;
}


export type RangeMapping = {
	originalRange: RSRange;
	modifiedRange: RSRange;
};

export type DiffModelChange = {
	removedTextLines: string[]; // can be empty if this is a pure addition. TODO: make this a string that has tokenization information, which we get from the original model
	removedLinesOriginalRange: LineRange; // the range in the original selected text representing the removed text. this is used to identify removed lines
	addedRange: LineRange; // the range relative to the start of the diff (1-indexed)
	relativeInnerChanges: RangeMapping[] | undefined; // the inner changes are relative to the removed text and added range
};



export type InprogressAIGenerationMetadata =
	| ChatAIGenerationMetadata
	| TaskGenerationMetadata
	| CodeInterpreterAIGenerationMetadata
	| undefined;

export type InProgressChatGeneration = {
	generationUUID: string;
	metadata: ChatAIGenerationMetadata;
	queuePosition: number; // slow queue 1-indexed or -1 if not in queue
};

export type InProgressTaskGeneration = {
	generationUUID: string;
	metadata: TaskGenerationMetadata;
	queuePosition: number; // slow queue 1-indexed or -1 if not in queue
};

export type InProgressUnknownGeneration = {
	generationUUID: string;
	metadata: undefined;
	queuePosition: number; // slow queue 1-indexed or -1 if not in queue
};

export type InProgressCodeInterpreterGeneration = {
	generationUUID: string;
	metadata: CodeInterpreterAIGenerationMetadata;
	queuePosition: number; // slow queue 1-indexed or -1 if not in queue
}

export type InprogressAIGeneration =
	| InProgressChatGeneration
	| InProgressTaskGeneration
	| InProgressUnknownGeneration
	| InProgressCodeInterpreterGeneration;

export interface RepositoryMetadata {
	startedPolling: boolean;
}


/**
 * A selection in the editor.
 * The selection is a range that has an orientation.
 * These are 1-indexed.
 */
export interface ISelection {
	/**
	 * The line number on which the selection has started.
	 */
	readonly selectionStartLineNumber: number;
	/**
	 * The column on `selectionStartLineNumber` where the selection has started.
	 */
	readonly selectionStartColumn: number;
	/**
	 * The line number on which the selection has ended.
	 */
	readonly positionLineNumber: number;
	/**
	 * The column on `positionLineNumber` where the selection has ended.
	 */
	readonly positionColumn: number;
}






export enum LintResult {
	OK = 'OK',
	ERROR = 'ERROR',
	NO_CHANGES_FOUND = 'NO_CHANGES_FOUND',
	NONE = 'NONE',
}

export type AISettingsModelOption = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-32k';

export type AISettings = {
	// 'null' means to use the default model
	openAIModel: AISettingsModelOption | null;

	// if membership is enterprise, this will be set to the team IDs
	// unfortunately, this isn't a UUID, even though it probably should be
	// i am deliberately not storing the full team info here, since this is stored in user storage which means it is liable to migration problems
	teamIds?: number[];
};

export type NewUserData = {
	toolUsageCount: {
		plainChat: number | 'legacy';
		contextChat: number | 'legacy';
		intentChat: number | 'legacy';
	};
};

export interface authenticationSettings {
	// logged in to github through cursor for using the repo service?
	githubLoggedIn: boolean;
}


export type UserNudgeState = {
	ignored: boolean;
	timesShown: number;
	// date for reminding later, serialized to unix timestamp string
	remindLaterDate?: string;
};

export type AzureState = {
	useAzure: boolean;
	apiKey?: string;
	baseUrl?: string;
	deployment?: string;
};



export type AgentDebuggerState = {
	priomptLiveMode: boolean;
	engineId?: string;
	isRecordingTasks: boolean;
};

export type LinterDebuggerState = {
	specificRules: boolean;
	compileErrors: boolean;
	changeBehavior: boolean;
	matchCode: boolean;
	relevance: boolean;
	userAwareness: boolean;
};

export enum LocalRepoId {
	id = 'local'
}

export interface FilledRepositoryInfo {
	readonly id: string | LocalRepoId;
	readonly repoName: string;
	readonly repoOwner: string;
	readonly relativeWorkspacePath: string | undefined;
}

export interface OnboardingMetadata {
	shouldAskToIndex: boolean;
	shouldHideWarning: boolean;
}
