import path from "path"
import { renderFunctions } from "./helpers/testSets"

const inFnBlocksFile = path.join(__dirname, "scss", "in-fn-blocks.scss")

describe("in-fn-blocks", () => {
  describe.each(renderFunctions)("%s", (_, renderFunc) => {
    let rendered

    beforeAll(async () => {
      rendered = await renderFunc({ file: inFnBlocksFile })
    })

    it("should extract $mixin1", () => {
      expect(rendered.vars.global.$mixin1).toMatchSassString(inFnBlocksFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "'m-variable-1'",
            sourceFile: inFnBlocksFile,
            isGlobal: true,
          },
        ]),
        value: "m-variable-1",
      })
    })

    it("should extract $mixin2", () => {
      expect(rendered.vars.global.$mixin2).toMatchSassString(inFnBlocksFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "'m-variable-2'",
            sourceFile: inFnBlocksFile,
            isGlobal: true,
          },
        ]),
        value: "m-variable-2",
      })
    })

    it("should extract $mixin3", () => {
      expect(rendered.vars.global.$mixin3).toMatchSassString(inFnBlocksFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "$someDefault",
            sourceFile: inFnBlocksFile,
            isGlobal: true,
          },
        ]),
        value: "default-val",
      })
    })

    it("should extract $function1", () => {
      expect(rendered.vars.global.$function1).toMatchSassString(inFnBlocksFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "'fn-variable-1'",
            sourceFile: inFnBlocksFile,
            isGlobal: true,
          },
        ]),
        value: "fn-variable-1",
      })
    })

    it("should extract $function2", () => {
      expect(rendered.vars.global.$function2).toMatchSassString(inFnBlocksFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "'fn-variable-2'",
            sourceFile: inFnBlocksFile,
            isGlobal: true,
          },
        ]),
        value: "fn-variable-2",
      })
    })

    it("should extract $function3", () => {
      expect(rendered.vars.global.$function3).toMatchSassString(inFnBlocksFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "$param7",
            sourceFile: inFnBlocksFile,
            isGlobal: true,
          },
        ]),
        value: "provided-val",
      })
    })

    it("should extract $someGlobalSetOnInvoke1", () => {
      expect(rendered.vars.global.$someGlobalSetOnInvoke1).toMatchSassString(inFnBlocksFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "$param",
            sourceFile: inFnBlocksFile,
            isGlobal: true,
          },
        ]),
        value: "default",
      })
    })

    it("should extract $someGlobalSetOnInvoke2", () => {
      expect(rendered.vars.global.$someGlobalSetOnInvoke2).toMatchSassString(inFnBlocksFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "$param",
            sourceFile: inFnBlocksFile,
            isGlobal: true,
          },
        ]),
        value: "provided",
      })
    })
  })
})
