
import { ExtensionContext } from 'vscode';
import { ControlProvider } from './controlProvider';
import { TextDecoder } from 'util';
import { Indexer } from './indexer';
import { Logger } from './logger';

const deactivateTasks: { (): Promise<any> }[] = [];

// this method is called when vs code is activated
export async function activate(context: ExtensionContext) {
	Logger.init();

	const controlProvider = new ControlProvider();
	deactivateTasks.push(async () => controlProvider.dispose())

	// Next, we create an indexer
	const indexer = new Indexer(context);
	deactivateTasks.push(async () => indexer.dispose());
}

export async function deactivate(): Promise<void> {
	for (const task of deactivateTasks) {
		await task();
	}
}
