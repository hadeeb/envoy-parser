import type { File, AnyNode, NodeWithBody } from "./types.ts";

const ValidChildren = {
	File: [
		"ImportNode",
		"ClassNode",
		"FunctionNode",
		"Comment",
		"EmptyLine",
		"OtherCode",
		"MultiLineComment",
	],
	ClassNode: ["FunctionNode", "Comment", "EmptyLine", "CloseNode"],
	FunctionNode: [
		"FunctionNode",
		"ClassNode",
		"Comment",
		"EmptyLine",
		"OtherCode",
		"CloseNode",
	],
	MultiLineComment: ["Comment"],
} as const;

export function parse(source: string): File {
	const lines = source.split("\n");
	const ast: File = { type: "File", body: [] };

	// Stack to keep track of the current context
	const contexts: Array<NodeWithBody> = [ast];

	function getContext() {
		const currentContext = contexts.at(-1);
		// This should not happen for valid code
		if (!currentContext) throw new Error("No current context found");
		return currentContext;
	}
	function popStack() {
		contexts.pop();
	}
	function pushToStack(node: AnyNode) {
		const currentContext = getContext();
		const validChildren = ValidChildren[currentContext.type];
		// @ts-expect-error: This is the type validation
		if (!validChildren.includes(node.type)) {
			throw new Error(
				`Invalid node type ${node.type} in ${currentContext.type} at line ${node.line}.`,
			);
		}

		// @ts-expect-error: Validation is done above
		currentContext.body.push(node);

		if ("body" in node) {
			// If the node is a ClassNode or FunctionNode, we need to create a new context
			contexts.push(node);
		} else if (node.type === "CloseNode") {
			// If the node is a CloseNode, we need to pop the context
			if (currentContext.type === "File") {
				throw new Error(`Found an extra closing brace at line ${node.line}`);
			}
			contexts.pop();
		}
	}

	lines.forEach((line, index) => {
		const trimmed = line.trim();

		const currentContext = getContext();

		if (currentContext.type === "MultiLineComment") {
			pushToStack({
				type: "Comment",
				value: trimmed,
				line: index + 1,
			});
			if (trimmed.endsWith("*/")) {
				popStack();
			}
			return;
		}

		if (trimmed.startsWith("/*")) {
			pushToStack({
				type: "MultiLineComment",
				body: [],
			});
			return;
		}

		// Handle empty line
		if (trimmed === "") {
			pushToStack({
				type: "EmptyLine",
				line: index + 1,
			});
			return;
		}

		if (trimmed === "}") {
			pushToStack({
				type: "CloseNode",
				line: index + 1,
			});
			return;
		}

		// Handle comment
		if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
			pushToStack({
				type: "Comment",
				value: trimmed.slice(2).trim(),
				line: index + 1,
			});
			return;
		}

		// Handle import
		if (trimmed.startsWith("import")) {
			const match = trimmed.match(/import\s+(\w+)\s+from\s+"([^"]+)";?/);
			if (match) {
				const [, name, source] = match;

				pushToStack({
					type: "ImportNode",
					line: index + 1,
					source,
					name,
				});
				return;
			}
			throw new Error(
				`Invalid import statement at line ${index + 1}: ${trimmed}.\nOnly default imports are supported.`,
			);
		}

		// Handle class declaration
		if (trimmed.startsWith("class")) {
			const match = trimmed.match(/class\s+(\w+)\s*{\s*$/);
			if (match) {
				const [, name] = match;
				pushToStack({
					type: "ClassNode",
					name,
					body: [],
					specifiers: [],
					line: index + 1,
				});
				return;
			}
			throw new Error(
				`Invalid class declaration at line ${index + 1}: ${trimmed}.`,
			);
		}

		// Only functions and class lines end with {
		// class in already handled
		// This doesn't differentiate between
		// function declarations and class methods
		if (trimmed.endsWith("{")) {
			// Split at parenthesis
			const match = trimmed.match(/([^\(]+)\(([^\)]*)\)?\s*{/);
			if (match) {
				const [, nameAndSpecifiers, args] = match;
				const specifiers = nameAndSpecifiers
					.split(" ")
					.map((s) => s.trim())
					.filter((s) => s !== "");
				const name = specifiers.pop();
				if (name == null)
					throw new Error(
						`Invalid function declaration at line ${index + 1}: ${trimmed}.`,
					);
				pushToStack({
					type: "FunctionNode",
					body: [],
					name,
					specifiers,
					arguments: args.trim(),
					line: index + 1,
				});
				return;
			}
			throw new Error(
				`Invalid function declaration at line ${index + 1}: ${trimmed}.`,
			);
		}
		pushToStack({
			type: "OtherCode",
			line: index + 1,
			value: trimmed,
		});
	});

	if (contexts.length > 1) {
		throw new Error(`Missing closing brace for ${contexts.length - 1} nodes.`);
	}

	return ast;
}
