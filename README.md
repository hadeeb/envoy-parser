# Simple JS Parser

### Run Tests
```bash
# Unit tests
npm run test
# Line count checks
npm run test:stats
```

### Run the Parser
To get the stats against any file
```bash
npm run cli <filepath>
```
```
npm run cli ./test/sample/input.js
```


### Design Decisions
- `}` are reserved for closing classes & class methods
- `}` has to be in a new line, and the only thing on that line.
- No multi-line arbitrary code blocks.
  - Only functions, classes, & single-line statements are allowed
  - This is due to special handling of `}` in the parser
  - Can be changed by creating a Node for code-blocks & if statements
- If expressions are falsely evaluated as functions, due to similarity in syntax 
  - Doesn't affect the line counting checks
- Comments and empty lines can be anywhere
- Information about leading/trailing spaces are not preserved
