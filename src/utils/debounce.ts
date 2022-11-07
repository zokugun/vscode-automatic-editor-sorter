export function debounce<T extends Function>(fn: T, wait: number): T { // {{{
	let fnTimer;

	let callable = (...args) => {
		clearTimeout(fnTimer);
		fnTimer = setTimeout(() => fn(...args), wait);
	};

	return <T>(<any>callable);
}; // }}}
