
import { ExtensionContext } from 'vscode';
import { ControlProvider } from './controlProvider';

const deactivateTasks: { (): Promise<any> }[] = [];

// this method is called when vs code is activated
export async function activate(context: ExtensionContext) {
	const controlProvider = new ControlProvider();
	deactivateTasks.push(async () => controlProvider.dispose())
}

export async function deactivate(): Promise<void> {
	for (const task of deactivateTasks) {
		await task();
	}
}
