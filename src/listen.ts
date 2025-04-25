import vscode from 'vscode';
import { getOrder, type Order } from './order.js';
import { getRule, type Rule } from './rule.js';
import { debounce } from './utils/debounce.js';

type Tab = {
	id: string;
	path: vscode.Uri | undefined;
	sticky: boolean;
};

let $group: vscode.TabGroup | undefined;
let $modified: boolean = false;
let $opened: string | undefined;
let $order: Order | undefined;
const $pinneds: string[] = [];
let $rule: Rule | undefined;
let $tabs: Tab[] | undefined;

function getId(tab: vscode.Tab): string { // {{{
	if(tab.input instanceof vscode.TabInputText) {
		return `text:${tab.input.uri.toString()}`;
	}
	if(tab.input instanceof vscode.TabInputTextDiff) {
		return `text-diff:${tab.input.original.toString()}/${tab.input.modified.toString()}`;
	}
	if(tab.input instanceof vscode.TabInputCustom) {
		return `custom:${tab.input.viewType}/${tab.input.uri.toString()}`;
	}
	if(tab.input instanceof vscode.TabInputWebview) {
		return `webview:${tab.input.viewType}`;
	}
	if(tab.input instanceof vscode.TabInputNotebook) {
		return `notebook:${tab.input.notebookType}/${tab.input.uri.toString()}`;
	}
	if(tab.input instanceof vscode.TabInputNotebookDiff) {
		return `notebook-diff:${tab.input.notebookType}/${tab.input.original.toString()}/${tab.input.modified.toString()}`;
	}
	if(tab.input instanceof vscode.TabInputTerminal) {
		return `terminal:${tab as any as string}`;
	}
	return `unknwon:${tab as any as string}`;
} // }}}

function getPath(tab: vscode.Tab): vscode.Uri | undefined { // {{{
	if(tab.input instanceof vscode.TabInputText) {
		return tab.input.uri;
	}
	if(tab.input instanceof vscode.TabInputTextDiff) {
		return tab.input.original;
	}
	if(tab.input instanceof vscode.TabInputCustom) {
		return tab.input.uri;
	}
	if(tab.input instanceof vscode.TabInputNotebook) {
		return tab.input.uri;
	}
	if(tab.input instanceof vscode.TabInputNotebookDiff) {
		return tab.input.original;
	}
} // }}}

function move(id: string): void { // {{{
	for(const [index, tab] of $tabs!.entries()) {
		if(id === tab.id) {
			void vscode.commands.executeCommand('moveActiveEditor', {
				to: 'position',
				value: index + 1,
			});
		}
	}
} // }}}

const sortChanged = debounce((tab: vscode.Tab): void => { // {{{
	// console.log(tab.label, tab.isActive, tab.isPreview, tab.isPinned);

	if(tab.isActive && !tab.isPreview) {
		const id = getId(tab);

		if(tab.isPinned) {
			if(!$pinneds.includes(id)) {
				$pinneds.push(id);
			}
		}
		else {
			if($modified || $group !== tab.group) {
				sortGroup(tab.group);
			}

			if(id === $opened) {
				move(id);

				$opened = undefined;
			}
			else {
				const index = $pinneds.indexOf(id);

				if(index !== -1) {
					move(id);

					$pinneds.splice(index, 1);
				}
			}
		}
	}
}, 10); // }}}

function sortClosed(_: vscode.Tab): void { // {{{
	$modified = true;
} // }}}

function sortGroup(group: vscode.TabGroup): void { // {{{
	const tabs: Tab[] = [];

	for(const tab of group.tabs) {
		tabs.push({
			id: getId(tab),
			path: getPath(tab),
			sticky: tab.isPinned,
		});
	}

	tabs.sort((a, b): number => {
		if(a.sticky || !a.path) {
			return -1;
		}
		if(b.sticky || !b.path) {
			return 1;
		}

		return $order!($rule!(a.path, b.path));
	});

	$tabs = tabs;
	$group = group;
	$modified = false;
} // }}}

function sortOpened(tab: vscode.Tab): void { // {{{
	$modified = true;

	$opened = getId(tab);
} // }}}

export function configure(config: vscode.WorkspaceConfiguration) { // {{{
	$order = getOrder(config.get<string>('order') ?? 'asc');
	$rule = getRule(config.get<string>('rule') ?? 'name,local');
} // }}}

export function listen(event: vscode.TabChangeEvent): void { // {{{
	// console.log(event)

	for(const tab of event.opened) {
		sortOpened(tab);
	}

	for(const tab of event.closed) {
		sortClosed(tab);
	}

	for(const tab of event.changed) {
		sortChanged(tab);
	}
} // }}}
