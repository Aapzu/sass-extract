import path from "path"
import { renderFunctions } from "./helpers/testSets"

const ieHacksFile = path.join(__dirname, "scss", "ie-hacks.scss")

describe("ie-hacks", () => {
  describe.each(renderFunctions)("%s", (_, renderFunc) => {
    it("should extract all variables", async () => {
      const rendered = await renderFunc({ file: ieHacksFile })
      expect(rendered).toMatchObject({
        vars: {
          global: {
            $my: expect.toMatchSassString(ieHacksFile, {
              declarations: expect.toMatchDeclarations([
                {
                  expression: "'variable'",
                  sourceFile: ieHacksFile,
                },
              ]),
              value: "variable",
            }),
          },
        },
      })
    })
  })
})
