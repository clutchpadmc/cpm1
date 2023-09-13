import { LogOutputChannel } from 'vscode';
import * as vscode from 'vscode';

export class Logger {
	private static output: LogOutputChannel;

	public static init(): void {
		Logger.output = vscode.window.createOutputChannel('Indexing & Retrieval', { log: true });
	}

	public static error(msg: string, ...args: any[]): void {
		Logger.output.error(msg, ...args);
	}
	public static warn(msg: string, ...args: any[]): void {
		Logger.output.warn(msg, ...args);
	}
	public static info(msg: string, ...args: any[]): void {
		Logger.output.info(msg, ...args);
	}
	public static debug(msg: string, ...args: any[]): void {
		Logger.output.debug(msg, ...args);
	}
	public static trace(msg: string, ...args: any[]): void {
		Logger.output.trace(msg, ...args);
	}
}
