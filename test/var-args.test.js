import path from "path"
import { renderFunctions } from "./helpers/testSets"

const varArgsFile = path.join(__dirname, "scss", "var-args.scss")

describe("var-args", () => {
  describe.each(renderFunctions)("%s", (_, renderFunc) => {
    let rendered

    beforeAll(async () => {
      rendered = await renderFunc({ file: varArgsFile })
    })

    it("should have correct overall structure", () => {
      expect(rendered).toEqual({
        css: expect.any(Buffer),
        stats: expect.any(Object),
        vars: {
          global: {
            $echoedArgs: expect.any(Object),
            $echoedArg: expect.any(Object),
            $optionallySingle: expect.any(Object),
            $optionallyMultiple: expect.any(Object),
            $oneString: expect.any(Object),
            $oneNumber: expect.any(Object),
            $oneList: expect.any(Object),
            $echoedMixin: expect.any(Object),
          },
        },
      })
    })

    it("should extract $echoedArgs", () => {
      expect(rendered.vars.global.$echoedArgs).toMatchSassList(varArgsFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "echo(1, 2, 3)",
            sourceFile: varArgsFile,
          },
        ]),
        value: [
          expect.toMatchSassNumber({ value: 1, unit: "" }),
          expect.toMatchSassNumber({ value: 2, unit: "" }),
          expect.toMatchSassNumber({ value: 3, unit: "" }),
        ],
      })
    })

    it("should extract $optionallySingle", () => {
      expect(rendered.vars.global.$optionallySingle).toMatchSassList(varArgsFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "optionally('last')",
            sourceFile: varArgsFile,
          },
        ]),
        value: [expect.toMatchSassString({ value: "last" })],
      })
    })

    it("should extract $optionallyMultiple", () => {
      expect(rendered.vars.global.$optionallyMultiple).toMatchSassList(varArgsFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "optionally('last', 1, 2, 3)",
            sourceFile: varArgsFile,
          },
        ]),
        value: [
          expect.toMatchSassNumber({ value: 1, unit: "" }),
          expect.toMatchSassNumber({ value: 2, unit: "" }),
          expect.toMatchSassNumber({ value: 3, unit: "" }),
          expect.toMatchSassString({ value: "last" }),
        ],
      })
    })

    it("should extract $oneString", () => {
      expect(rendered.vars.global.$oneString).toMatchSassString(varArgsFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "oneOf(2, 'a', 'b', 'c')",
            sourceFile: varArgsFile,
          },
        ]),
        value: "b",
      })
    })

    it("should extract $oneNumber", () => {
      expect(rendered.vars.global.$oneNumber).toMatchSassNumber(varArgsFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "oneOf(3, 'a', 'b', 5, ('d', 'e'))",
            sourceFile: varArgsFile,
          },
        ]),
        value: 5,
      })
    })

    it("should extract $oneList", () => {
      expect(rendered.vars.global.$oneList).toMatchSassList(varArgsFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "oneOf(4, 'a', 'b', 5, ('d', 'e'), 1, 2)",
            sourceFile: varArgsFile,
          },
        ]),
        value: [expect.toMatchSassString({ value: "d" }), expect.toMatchSassString({ value: "e" })],
      })
    })

    it("should extract $echoedMixin", () => {
      expect(rendered.vars.global.$echoedMixin).toMatchSassList(varArgsFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "$vars",
            sourceFile: varArgsFile,
            isGlobal: true,
          },
        ]),
        value: [
          expect.toMatchSassNumber({ value: 5, unit: "" }),
          expect.toMatchSassNumber({ value: 6, unit: "" }),
          expect.toMatchSassNumber({ value: 7, unit: "" }),
        ],
      })
    })
  })
})
