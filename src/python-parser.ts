const CommentNode = {
	type: "Comment",
	parse(line: string) {
		if (line.startsWith("//")) {
			return true
		}
		return false;
	},
};
const EmptyNode = {
	parse(line: string) {
		if (line.trim() == "") return true;
		return false;
	},
};

const CodeNode = {
  parse(line: string) {
		 return true;

	},
};


const JSParser = {
	comment: CommentNode,
	empty: EmptyNode,
	code: CodeNode,
};


const PythonCommentNode = {
	type: "Comment",
	parse(line: string) {
		if (line.startsWith("#")) {
			return true
		}
		return false;
	},
};
const PythonEmptyNode = {
	parse(line: string) {
		if (line.trim() == "") return true;
		return false;
	},
};

const PythonCodeNode = {
  parse(line: string) {
		 return true;

	},
};

const PythonParser = {
	comment: PythonCommentNode,
	empty: PythonEmptyNode,
	code: PythonCodeNode,
};

export function parse(source: string, parser: typeof PythonParser) {
	const lines = source.split("\n");

	let comments = 0;
	let code = 0;
	let empty = 0;
	lines.forEach((line) => {
		if (parser.comment.parse(line)) {
			comments++;
			return;
		}
		if (parser.empty.parse(line)) {
			empty++;
			return;
		}
		if (parser.code.parse(line)) {
			code++;
			return;
		}
		throw new Error("Invalid Line");
	});

  console.log ({
    code,comments,empty
  })
}

const sourceCode=`const a = 5;


const a = 5;
# Comment
const a = 5;

const b = 10;`

parse(sourceCode,PythonParser)
