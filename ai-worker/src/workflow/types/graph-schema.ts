export type MermaidNode = {
	id: string;
	label: string;
	product: 'Workers' | 'Workflows' | 'D1' | 'KV' | 'R2' | 'Queues' | 'DurableObjects' | 'WorkersAI' | 'Pages' | 'CDN';
};

export type MermaidEdge = {
	from: string;
	to: string;
	label?: string;
};

export interface MermaidGraph {
	direction: 'LR' | 'TB' | 'RL' | 'BT';
	nodes: {
		id: string;
		label: string;
		product: string;
	}[];
	edges: {
		from: string;
		to: string;
		label?: string;
	}[];
}
