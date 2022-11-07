import path from 'path';
import vscode from 'vscode';

export type Rule = (a: vscode.Uri, b: vscode.Uri) => number;

function sortWithAbsolute(a: vscode.Uri, b: vscode.Uri): number { // {{{
	return a.fsPath.localeCompare(b.fsPath);
} // }}}

function sortWithBasename(a: string, b: string): number { // {{{
	const aName = path.basename(a);
	const bName = path.basename(b);

	if(aName === bName) {
		return sortWithBasename(path.resolve(a, '..'), path.resolve(b, '..'))
	}
	else {
		return aName.localeCompare(bName);
	}
} // }}}

function sortWithName(a: vscode.Uri, b: vscode.Uri): number { // {{{
	return sortWithBasename(a.fsPath, b.fsPath);
} // }}}

function sortWithNameAndAbsolute(a: vscode.Uri, b: vscode.Uri): number { // {{{
	const aName = path.basename(a.fsPath);
	const bName = path.basename(b.fsPath);

	if(aName === bName) {
		return a.fsPath.localeCompare(b.fsPath);
	}
	else {
		return aName.localeCompare(bName);
	}
} // }}}

export function getRule(type: string): Rule { // {{{
	if(type === 'absolute') {
		return sortWithAbsolute;
	}
	else if(type === 'name') {
		return sortWithName;
	}
	else {
		return sortWithNameAndAbsolute;
	}
} // }}}
