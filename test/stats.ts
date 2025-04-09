import * as fs from "node:fs/promises";
import * as path from "node:path";
import test from "node:test";
import assert from "node:assert";

import { parse } from "../src/parser.ts";
import { walkAst } from "./walk.ts";

// List all directories in the current directory
const tests = await fs.readdir(new URL(".", import.meta.url).pathname);
const maybeDirectories = await Promise.all(
	tests.map(async (file) => {
		const stat = await fs.stat(
			path.join(new URL(".", import.meta.url).pathname, file),
		);
		return stat.isDirectory() ? file : null;
	}),
);

const directories = maybeDirectories.filter((x) => x !== null);

for (const dir of directories) {
	test(dir, async () => {
		const dirPath = new URL(dir, import.meta.url).pathname;
		const inputPath = path.join(dirPath, "input.js");
		const statsPath = path.join(dirPath, "stats.json");
		const inputCode = await fs.readFile(inputPath, "utf-8");
		const stats = JSON.parse(await fs.readFile(statsPath, "utf-8")) as {
			empty: number;
			comment: number;
			code: number;
		};
		const ast = parse(inputCode);
		const state = { empty: 0, comment: 0, code: 0 };
		for (const node of ast.body) {
			walkAst(node, state);
		}
		assert.deepEqual(state, stats);
	});
}
