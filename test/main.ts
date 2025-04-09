import { describe, test } from "node:test";
import assert from "node:assert";

import { parse } from "../src/parser.ts";

describe("Parser", () => {
	describe("Empty Lines", () => {
		test("Empty Line", () => {
			const code = "";
			const ast = parse(code);
			assert.deepEqual(ast, {
				type: "File",
				body: [
					{
						type: "EmptyLine",
						line: 1,
					},
				],
			});
		});

		test("Multiple Empty Lines", () => {
			const code = "\n\n";
			const ast = parse(code);
			assert.deepEqual(ast, {
				type: "File",
				body: [
					{ type: "EmptyLine", line: 1 },
					{ type: "EmptyLine", line: 2 },
					{ type: "EmptyLine", line: 3 },
				],
			});
		});
	});

	describe("Comments", () => {
		test("Single Line Comment", () => {
			const code = "// This is a comment";
			const ast = parse(code);
			assert.deepEqual(ast, {
				type: "File",
				body: [
					{
						type: "Comment",
						value: "This is a comment",
						line: 1,
					},
				],
			});
		});

		test("Multiple Line Comments", () => {
			const code = "// Comment 1\n// Comment 2";
			const ast = parse(code);
			assert.deepEqual(ast, {
				type: "File",
				body: [
					{
						type: "Comment",
						value: "Comment 1",
						line: 1,
					},
					{
						type: "Comment",
						value: "Comment 2",
						line: 2,
					},
				],
			});
		});
	});

	describe("Imports", () => {
		test("Default Import Node", () => {
			const code = 'import x from "y"';
			const ast = parse(code);
			assert.deepEqual(ast, {
				type: "File",
				body: [
					{
						type: "ImportNode",
						source: "y",
						name: "x",
						line: 1,
					},
				],
			});
		});

		test("Named Import Nodes are not supported", () => {
			const code = 'import { x } from "y"';
			assert.throws(() => {
				parse(code);
			});
		});
	});

	describe("Class Node", () => {
		test("Closing Bracket of class has to be on a new line", () => {
			const code = "class A { }";
			assert.throws(() => {
				parse(code);
			});
		});

		test("Empty Class Node", () => {
			const code = "class A {\n}";
			const ast = parse(code);
			assert.deepEqual(ast, {
				type: "File",
				body: [
					{
						type: "ClassNode",
						name: "A",
						specifiers: [],
						line: 1,
						body: [
							{
								type: "CloseNode",
								line: 2,
							},
						],
					},
				],
			});
		});

		test("Empty Class Method", () => {
			const code = "class A {\n  method() {\n}\n}";
			const ast = parse(code);
			assert.deepEqual(ast, {
				type: "File",
				body: [
					{
						type: "ClassNode",
						name: "A",
						specifiers: [],
						line: 1,
						body: [
							{
								type: "FunctionNode",
								name: "method",
								specifiers: [],
								arguments: "",
								line: 2,
								body: [
									{
										type: "CloseNode",
										line: 3,
									},
								],
							},
							{
								type: "CloseNode",
								line: 4,
							},
						],
					},
				],
			});
		});
	});

	describe("Other Code", () => {
		test("Lines with only } are reserved for closing classes & methods", () => {
			assert.throws(() => {
				parse(`{
					}`);
			});
		});

		test("Single line code block", () => {
			const code = "{ x = 1; }";
			const ast = parse(code);
			assert.deepEqual(ast, {
				type: "File",
				body: [
					{
						type: "OtherCode",
						value: "{ x = 1; }",
						line: 1,
					},
				],
			});
		});

		test.skip("If checks are falsely parsed as functions", () => {
			assert.throws(() => {
				parse(`if (x>y){
					console.log(x);
					}`);
			});
		});
	});
});
