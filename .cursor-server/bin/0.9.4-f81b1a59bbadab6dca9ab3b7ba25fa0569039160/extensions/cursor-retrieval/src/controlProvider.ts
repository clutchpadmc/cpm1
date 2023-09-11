import * as vscode from 'vscode';
import { Tokenizer } from './tokenizer'

export class ControlProvider implements vscode.ControlProvider, vscode.Disposable {
	private providerRegistration: vscode.Disposable;
	static readonly id = 'cursor-retrieval';
	private tokenizer: Tokenizer;


	constructor() {
		this.tokenizer = new Tokenizer()
		this.providerRegistration = vscode.workspace.registerControlProvider(ControlProvider.id, this);
	}
	getRegistrationSource() {
		return ControlProvider.id;
	}

	dispose() {
		this.providerRegistration.dispose();
	}

	async getFullDiff(repoId: string, ref?: string): Promise<vscode.FullDiff | undefined> {
		return undefined
	}

	async getDataframeSummary(notebookUri: vscode.Uri): Promise<vscode.ControlDataframeInfo[] | undefined> {
		return undefined
	}

	async getTokenizedQuery(query: string): Promise<vscode.TokenizedQuery | undefined> {
		return {
			tokens: this.tokenizer.tokenize(query)
		}
	}

	async tokenizeBPE(text: string, model: vscode.UsableTokenizer): Promise<vscode.BPETokenInfo[] | undefined> {
		return undefined
	}
}