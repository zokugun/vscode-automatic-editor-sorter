export function debounce<T extends (..._) => unknown>(func: T, wait: number): T { // {{{
	let funcTimer: NodeJS.Timeout | undefined;

	const callable = (...args: unknown[]) => {
		clearTimeout(funcTimer);
		funcTimer = setTimeout(() => func(...args), wait);
	};

	return callable as T;
} // }}}
