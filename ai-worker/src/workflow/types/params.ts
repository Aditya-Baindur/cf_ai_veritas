// We guarentee the type of the workflow at runtime

export type SearchParams = {
	message: string;
	clerkId: string;
};

export function assertSearchParams(data: unknown): asserts data is SearchParams {
	if (
		typeof data !== 'object' ||
		data === null ||
		typeof (data as any).message !== 'string' ||
		(data as any).message.length === 0 ||
		typeof (data as any).clerkId !== 'string'
	) {
		throw new Error('Invalid SearchParams');
	}
}

// We guarentee the type of the workflow at runtime

export type ReasoningParams = {
	message: string;
	clerkId: string;
};

export function assertsReasoningParams(data: unknown): asserts data is ReasoningParams {
	if (
		typeof data !== 'object' ||
		data === null ||
		typeof (data as any).message !== 'string' ||
		(data as any).message.length === 0 ||
		typeof (data as any).clerkId !== 'string'
	) {
		throw new Error('Invalid SearchParams');
	}
}

export type NormalParams = {
	message: string;
	clerkId: string;
};

// assertNormalParams

export function assertNormalParams(data: unknown): asserts data is ReasoningParams {
	if (
		typeof data !== 'object' ||
		data === null ||
		typeof (data as any).message !== 'string' ||
		(data as any).message.length === 0 ||
		typeof (data as any).clerkId !== 'string'
	) {
		throw new Error('Invalid SearchParams');
	}
}

export type DevParams = {
	message: string;
	clerkId: string;
};

// assertNormalParams

export function assertDevParams(data: unknown): asserts data is ReasoningParams {
	if (
		typeof data !== 'object' ||
		data === null ||
		typeof (data as any).message !== 'string' ||
		(data as any).message.length === 0 ||
		typeof (data as any).clerkId !== 'string'
	) {
		throw new Error('Invalid SearchParams');
	}
}
