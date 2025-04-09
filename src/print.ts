import type { AnyNode, File } from "./types.ts";

export function print(file: File) {
	return file.body.map((node) => printNode(node, 0)).join("\n");
}

function printNode(node: AnyNode, indent: number) {
	switch (node.type) {
		case "EmptyLine":
			return "";
		case "Comment": {
			const indentation = " ".repeat(indent);
			return `${indentation}// ${node.value}`;
		}
		case "ImportNode": {
			const indentation = " ".repeat(indent);
			return `${indentation}import ${node.name} from "${node.source}"`;
		}
		case "ClassNode": {
			const indentation = " ".repeat(indent);
			const lines = [`${indentation}class ${node.name} {`];
			for (const x of node.body) {
				lines.push(printNode(x, indent + 2));
			}
			return lines.join("\n");
		}
		case "FunctionNode": {
			const indentation = " ".repeat(indent);
			const lines = [
				`${indentation}${node.specifiers.join(" ")} ${node.name}(${node.arguments}) {`,
			];
			for (const x of node.body) {
				lines.push(printNode(x, indent + 2));
			}
			return lines.join("\n");
		}
		case "OtherCode": {
			const indentation = " ".repeat(indent);
			return `${indentation}${node.value}`;
		}
		case "CloseNode": {
			const indentation = " ".repeat(indent - 2);
			return `${indentation}}`;
		}
		default:
			throw new Error(`Unknown node: ${node}`);
	}
}
