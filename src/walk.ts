import type { AnyNode, File } from "./types";

export function walkAst(ast: File) {
	const state = ast.body.reduce(
		(acc, x) => {
			return walkAstNode(x, acc);
		},
		{
			empty: 0,
			comment: 0,
			code: 0,
		},
	);

	return state;
}

function walkAstNode(
	node: AnyNode,
	state: { empty: number; comment: number; code: number },
) {
	if (node.type === "EmptyLine") {
		return { ...state, empty: state.empty + 1 };
	}
	if (node.type === "Comment") {
		return { ...state, comment: state.comment + 1 };
	}

	if ("body" in node) {
		const fromBody = node.body.reduce((acc, childNode) => {
			return walkAstNode(childNode, acc);
		}, state);
		return { ...fromBody, code: fromBody.code + 1 };
	}
	return { ...state, code: state.code + 1 };
}
