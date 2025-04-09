import type { AnyNode } from "../src/types";

export function walkAst(
	node: AnyNode,
	state: { empty: number; comment: number; code: number },
) {
	if (node.type === "EmptyLine") {
		state.empty++;
	} else if (node.type === "Comment") {
		state.comment++;
	} else {
		state.code++;
		if ("body" in node) {
			for (const x of node.body) {
				walkAst(x, state);
			}
		}
	}
}
