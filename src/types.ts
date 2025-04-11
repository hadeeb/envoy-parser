export interface File {
	type: "File";
	body: FileNode[];
}

export type AnyNode =
	| ImportNode
	| ClassNode
	| FunctionNode
	| Comment
	| OtherCode
	| EmptyLine
	| CloseNode
	| MultiLineComment;

export type FileNode =
	| ImportNode
	| ClassNode
	| FunctionNode
	| Comment
	| OtherCode
	| EmptyLine;

export type ClassBodyElement = FunctionNode | Comment | EmptyLine | CloseNode;
export type FunctionBodyElement =
	| Comment
	| EmptyLine
	| OtherCode
	| FunctionNode
	| ClassNode
	| CloseNode;

export type NodeWithBody = File | ClassNode | FunctionNode;

export interface ImportNode {
	type: "ImportNode";
	source: string;
	// Only default imports are supported
	name: string;
	line: number;
}

export interface ClassNode {
	type: "ClassNode";
	name: string;
	body: ClassBodyElement[];
	specifiers: string[];
	line: number;
}

export interface FunctionNode {
	type: "FunctionNode";
	name: string;
	specifiers: string[];
	arguments: string;
	body: FunctionBodyElement[];
	line: number;
}

export interface Comment {
	type: "Comment";
	value: string;
	line: number;
}

export interface MultiLineComment {
	type: "MultiLineComment";
	body: any[];
}

export interface EmptyLine {
	type: "EmptyLine";
	line: number;
}

export interface CloseNode {
	type: "CloseNode";
	line: number;
}

export interface OtherCode {
	type: "OtherCode";
	value: string;
	line: number;
}
