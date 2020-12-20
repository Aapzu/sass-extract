import path from "path"
import { renderFunctions } from "./helpers/testSets"

const multilineCommentFile = path.join(__dirname, "scss", "multiline-comments.scss")

describe("comments", () => {
  describe.each(renderFunctions)("%s", (_, renderFunc) => {
    let rendered

    beforeAll(async () => {
      rendered = await renderFunc({ file: multilineCommentFile })
    })

    it("should extract $_colorGray", () => {
      expect(rendered.vars.global.$_colorGray).toMatchSassColor(multilineCommentFile, {
        value: {
          r: 102,
          g: 102,
          b: 102,
          a: 1,
          hex: "#666666",
        },
        declarations: expect.toMatchDeclarations([
          {
            expression: "#666",
            sourceFile: multilineCommentFile,
          },
        ]),
      })
    })

    it("should extract $_colorLightGray", () => {
      expect(rendered.vars.global.$_colorLightGray).toMatchSassColor(multilineCommentFile, {
        value: {
          r: 238,
          g: 238,
          b: 238,
          a: 1,
          hex: "#eeeeee",
        },
        declarations: expect.toMatchDeclarations([
          {
            expression: "#eee",
            sourceFile: multilineCommentFile,
          },
        ]),
      })
    })

    it("should extract $_colorButtonGray", () => {
      expect(rendered.vars.global.$_colorButtonGray).toMatchSassColor(multilineCommentFile, {
        value: {
          r: 101,
          g: 102,
          b: 102,
          a: 1,
          hex: "#656666",
        },
        declarations: expect.toMatchDeclarations([
          {
            expression: "#656666",
            sourceFile: multilineCommentFile,
          },
        ]),
      })
    })

    it("should extract $_colorRed", () => {
      expect(rendered.vars.global.$_colorRed).toMatchSassColor(multilineCommentFile, {
        value: {
          r: 231,
          g: 67,
          b: 39,
          a: 1,
          hex: "#e74327",
        },
        declarations: expect.toMatchDeclarations([
          {
            expression: "#E74327",
            sourceFile: multilineCommentFile,
          },
        ]),
      })
    })

    it("should extract $colorStroke", () => {
      expect(rendered.vars.global.$colorStroke).toMatchSassColor(multilineCommentFile, {
        value: {
          r: 222,
          g: 218,
          b: 218,
          a: 1,
          hex: "#dedada",
        },
        declarations: expect.toMatchDeclarations([
          {
            expression: "#DEDADA",
            sourceFile: multilineCommentFile,
          },
        ]),
      })
    })
  })
})
