import path from "path"
import { renderFunctions } from "./helpers/testSets"

const sourceFile = path.join(__dirname, "scss", "defaults.scss")

describe("defaults", () => {
  describe.each(renderFunctions)("%s", (_, renderFunc) => {
    let rendered

    beforeAll(async () => {
      rendered = await renderFunc({
        file: sourceFile,
      })
    })

    it("has correct shape in general", () => {
      expect(rendered).toEqual({
        css: expect.any(Buffer),
        stats: expect.any(Object),
        vars: {
          global: {
            $variable: expect.any(Object),
          },
        },
      })
    })

    it("extracts $variable correctly", () => {
      expect(rendered.vars.global.$variable).toMatchSassNumber(sourceFile, {
        value: 789,
        unit: "px",
        declarations: expect.toMatchDeclarations([
          {
            expression: "123px",
            sourceFile,
          },
          {
            expression: "456px",
            sourceFile,
            isDefault: true,
          },
          {
            expression: "789px",
            sourceFile,
          },
          {
            expression: "100px",
            sourceFile,
            isDefault: true,
          },
        ]),
      })
    })
  })
})
