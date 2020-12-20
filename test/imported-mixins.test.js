import path from "path"
import { renderFunctions } from "./helpers/testSets"

const importedMixinsFile = path.join(__dirname, "scss", "imported-mixins.scss")

describe("imported-mixins", () => {
  describe.each(renderFunctions)("%s", (_, renderFunc) => {
    let rendered

    beforeAll(async () => {
      rendered = await renderFunc({ file: importedMixinsFile })
    })

    it("should extract $mixinVariable", () => {
      expect(rendered.vars.global.$mixinVariable).toMatchSassString(importedMixinsFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "'mixin-variable'",
            sourceFile: importedMixinsFile,
            isGlobal: true,
          },
        ]),
        value: "mixin-variable",
      })
    })

    it("should extract $defaultedAtFirst", () => {
      expect(rendered.vars.global.$defaultedAtFirst).toMatchSassString(importedMixinsFile, {
        value: "actual",
        declarations: expect.toMatchDeclarations([
          {
            expression: "'defaulted'",
            sourceFile: importedMixinsFile,
            isGlobal: true,
            isDefault: true,
          },
          {
            expression: "'actual'",
            sourceFile: importedMixinsFile,
            isGlobal: true,
          },
        ]),
      })
    })

    it("should extract $someDefault", () => {
      expect(rendered.vars.global.$someDefault).toMatchSassString(importedMixinsFile, {
        declarations: expect.toMatchDeclarations([
          {
            expression: "'b'",
            sourceFile: importedMixinsFile,
            isDefault: true,
          },
          {
            expression: "'a'",
            sourceFile: importedMixinsFile,
            isGlobal: true,
            isDefault: true,
          },
          {
            expression: "'c'",
            sourceFile: importedMixinsFile,
            isGlobal: true,
          },
        ]),
        value: "c",
      })
    })

    it("should extract $someOtherDefault", () => {
      expect(rendered.vars.global.$someOtherDefault).toMatchSassNumber(importedMixinsFile, {
        value: 3,
        declarations: expect.toMatchDeclarations([
          {
            expression: "3",
            sourceFile: importedMixinsFile,
          },
          {
            expression: "1",
            sourceFile: importedMixinsFile,
            isGlobal: true,
            isDefault: true,
          },
          {
            expression: "2",
            sourceFile: importedMixinsFile,
            isGlobal: true,
            isDefault: true,
          },
        ]),
      })
    })

    it("should extract $multipleDefault", () => {
      expect(rendered.vars.global.$multipleDefault).toMatchSassString(importedMixinsFile, {
        value: "x",
        declarations: expect.toMatchDeclarations([
          {
            expression: "'x'",
            sourceFile: importedMixinsFile,
            isGlobal: true,
            isDefault: true,
          },
          {
            expression: "'y'",
            sourceFile: importedMixinsFile,
            isGlobal: true,
            isDefault: true,
          },
        ]),
      })
    })
  })
})
