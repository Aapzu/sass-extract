import path from "path"
import { renderFunctions } from "./helpers/testSets"
import { types } from "node-sass"

const functionsFile = path.join(__dirname, "scss", "functions.scss")

const functionsTest = {
  "fn-color()": () => new types.Color(0, 255, 0),
  "fn-size($multiplier)": (multiplier) => new types.Number(10 * multiplier.getValue(), "px"),
}

describe("functions", () => {
  describe.each(renderFunctions)("%s", (_, renderFunc) => {
    it("should extract all variables", async () => {
      const rendered = await renderFunc({ file: functionsFile, functions: functionsTest })
      expect(rendered).toMatchObject({
        vars: {
          global: {
            $fColor: expect.toMatchSassColor(functionsFile, {
              value: {
                r: 0,
                g: 255,
                b: 0,
                a: 1,
                hex: "#00ff00",
              },
              declarations: expect.toMatchDeclarations([
                {
                  expression: "fn-color()",
                  sourceFile: functionsFile,
                },
              ]),
            }),
            $fSize: expect.toMatchSassNumber(functionsFile, {
              value: 20,
              unit: "px",
              declarations: expect.toMatchDeclarations([
                {
                  expression: "fn-size(2)",
                  sourceFile: functionsFile,
                },
              ]),
            }),
          },
        },
      })
    })
  })
})
