export type Order = (value: number) => number;

export function getOrder(type: string): Order {
	if(type === 'desc') {
		return (v) => -v;
	}
	else {
		return (v) => v;
	}
}
