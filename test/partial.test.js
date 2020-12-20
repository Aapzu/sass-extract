import path from "path"
import { renderFunctions } from "./helpers/testSets"

const partialFile = path.join(__dirname, "scss", "partial.scss")
const somePartialFile = path.join(__dirname, "scss", "_somepartial.scss")

describe("partial", () => {
  describe.each(renderFunctions)("%d", (_, renderFunc) => {
    let rendered

    beforeAll(async () => {
      rendered = await renderFunc({ file: partialFile })
    })

    it("has correct shape in general", () => {
      expect(rendered).toEqual({
        css: expect.any(Buffer),
        stats: expect.any(Object),
        vars: {
          global: {
            $variable: expect.any(Object),
            $color: expect.any(Object),
          },
        },
      })
    })

    it("should extract $variable", () => {
      expect(rendered.vars.global.$variable).toMatchSassColor(partialFile, {
        value: {
          hex: "#00ff00",
        },
      })
    })

    it("should extract $color", () => {
      expect(rendered.vars.global.$color).toMatchSassColor(somePartialFile, {
        value: {
          hex: "#00ff00",
        },
      })
    })
  })
})
