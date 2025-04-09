import { argv } from "node:process";
import * as fs from "node:fs/promises";

import { parse } from "./parser.ts";
import { walkAst } from "./walk.ts";

const inputFile = argv[2];
if (!inputFile) {
	console.error("Please provide an input file.");
	process.exit(1);
}

const fileContent = await fs.readFile(inputFile, "utf-8");

const ast = parse(fileContent);

const state = walkAst(ast);

console.log(`
Blank: ${state.empty}
Comments: ${state.comment}
Code: ${state.code}
Total: ${state.empty + state.comment + state.code}`);

// For multiple files
// const fileContents: string[] = [];
// fileContents.reduce(
// 	(allState, fileContent) => {
// 		const ast = parse(fileContent);
// 		const state = walkAst(ast);
// 		return {
// 			empty: allState.empty + state.empty,
// 			comment: allState.comment + state.comment,
// 			code: allState.code + state.code,
// 		};
// 	},
// 	{ empty: 0, comment: 0, code: 0 },
// );
