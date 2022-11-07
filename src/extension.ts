import vscode from 'vscode';
import pkg from '../package.json';
import { configure, listen } from './listen';
import { Disposable } from './utils/disposable';

const CONFIG_KEY = 'automaticEditorSorter';
const VERSION_KEY = 'version';

const $disposable: Disposable = new Disposable();
let $context: vscode.ExtensionContext | null = null;

function setup() { // {{{
	$disposable.dispose();

	const config = vscode.workspace.getConfiguration(CONFIG_KEY, null);
	const enabled = config.get<boolean>('enabled') ?? true;

	$context!.subscriptions.push($disposable);

	if(enabled) {
		configure(config)

		vscode.window.tabGroups.onDidChangeTabs(listen);
	}

	$context!.subscriptions.push($disposable);
} // }}}

async function showWhatsNewMessage(version: string) { // {{{
	const actions: vscode.MessageItem[] = [{
		title: 'Homepage',
	}, {
		title: 'Release Notes',
	}];

	const result = await vscode.window.showInformationMessage(
		`Automatic Editor Sorter has been updated to v${version} — check out what's new!`,
		...actions,
	);

	if(result !== null) {
		if(result === actions[0]) {
			await vscode.commands.executeCommand(
				'vscode.open',
				vscode.Uri.parse(`${pkg.homepage}`),
			);
		}
		else if(result === actions[1]) {
			await vscode.commands.executeCommand(
				'vscode.open',
				vscode.Uri.parse(`${pkg.homepage}/blob/master/CHANGELOG.md`),
			);
		}
	}
} // }}}

export async function activate(context: vscode.ExtensionContext): Promise<void> { // {{{
	$context = context;

	const previousVersion = context.globalState.get<string>(VERSION_KEY);
	const currentVersion = pkg.version;

	const config = vscode.workspace.getConfiguration(CONFIG_KEY);

	if(previousVersion === undefined || currentVersion !== previousVersion) {
		void context.globalState.update(VERSION_KEY, currentVersion);

		const notification = config.get<string>('notification');

		if(previousVersion === undefined) {
			// don't show notification on install
		}
		else if(notification === 'major') {
			if(currentVersion.split('.')[0] > previousVersion.split('.')[0]) {
				void showWhatsNewMessage(currentVersion);
			}
		}
		else if(notification === 'minor') {
			if(currentVersion.split('.')[0] > previousVersion.split('.')[0] || (currentVersion.split('.')[0] === previousVersion.split('.')[0] && currentVersion.split('.')[1] > previousVersion.split('.')[1])) {
				void showWhatsNewMessage(currentVersion);
			}
		}
		else if(notification !== 'none') {
			void showWhatsNewMessage(currentVersion);
		}
	}

	setup();

	vscode.workspace.onDidChangeConfiguration((event) => {
		if(event.affectsConfiguration(CONFIG_KEY)) {
			setup();
		}
	});
} // }}}
