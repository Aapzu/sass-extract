import path from "path"
import { renderFunctions } from "./helpers/testSets"

const importedFunctionsFile = path.join(__dirname, "scss", "imported-functions.scss")

describe("imported-functions", () => {
  describe.each(renderFunctions)("%d", (_, renderFunc) => {
    let rendered

    beforeAll(async () => {
      rendered = await renderFunc({ file: importedFunctionsFile })
    })

    it("should extract $functionVariable", () => {
      expect(rendered.vars.global.$functionVariable).toMatchSassString(importedFunctionsFile, {
        value: "function-variable",
        declarations: expect.toMatchDeclarations([
          {
            expression: "'function-variable'",
            sourceFile: importedFunctionsFile,
            isGlobal: true,
          },
          {
            expression: "'should-not-happen'",
            sourceFile: importedFunctionsFile,
            isGlobal: true,
          },
        ]),
      })
    })

    it("should extract $defaultedAtFirst", () => {
      expect(rendered.vars.global.$defaultedAtFirst).toMatchSassString(importedFunctionsFile, {
        value: "actual",
        declarations: expect.toMatchDeclarations([
          {
            expression: "'defaulted'",
            sourceFile: importedFunctionsFile,
            isGlobal: true,
            isDefault: true,
          },
          {
            expression: "'actual'",
            sourceFile: importedFunctionsFile,
            isGlobal: true,
          },
        ]),
      })
    })

    it("should extract $someDefault", () => {
      expect(rendered.vars.global.$someDefault).toMatchSassString(importedFunctionsFile, {
        value: "c",
        declarations: expect.toMatchDeclarations([
          {
            expression: "'b'",
            sourceFile: importedFunctionsFile,
            isDefault: true,
          },
          {
            expression: "'a'",
            sourceFile: importedFunctionsFile,
            isGlobal: true,
            isDefault: true,
          },
          {
            expression: "'c'",
            sourceFile: importedFunctionsFile,
            isGlobal: true,
          },
        ]),
      })
    })

    it("should extract $someOtherDefault", () => {
      expect(rendered.vars.global.$someOtherDefault).toMatchSassNumber(importedFunctionsFile, {
        value: 3,
        declarations: expect.toMatchDeclarations([
          {
            expression: "3",
            sourceFile: importedFunctionsFile,
          },
          {
            expression: "1",
            sourceFile: importedFunctionsFile,
            isGlobal: true,
            isDefault: true,
          },
          {
            expression: "2",
            sourceFile: importedFunctionsFile,
            isGlobal: true,
            isDefault: true,
          },
        ]),
      })
    })

    it("should extract $multipleDefault", () => {
      expect(rendered.vars.global.$multipleDefault).toMatchSassString(importedFunctionsFile, {
        value: "x",
        declarations: expect.toMatchDeclarations([
          {
            expression: "'x'",
            sourceFile: importedFunctionsFile,
            isGlobal: true,
            isDefault: true,
          },
          {
            expression: "'y'",
            sourceFile: importedFunctionsFile,
            isGlobal: true,
            isDefault: true,
          },
        ]),
      })
    })
  })
})
