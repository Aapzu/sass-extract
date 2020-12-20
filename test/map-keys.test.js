import path from "path"
import { renderFunctions } from "./helpers/testSets"

const mapKeysFile = path.join(__dirname, "scss", "map-keys.scss")

describe("map-keys", () => {
  describe.each(renderFunctions)("%s", (_, renderFunc) => {
    it("should extract all variables", async () => {
      const rendered = await renderFunc({ file: mapKeysFile })
      expect(rendered.vars.global.$map).toMatchSassMap({
        value: {
          string: expect.toMatchSassNumber({ value: 1, unit: "em" }),
          "1px": expect.toMatchSassString({ type: "SassString", value: "number" }),
          white: expect.toMatchSassString({ value: "color-string" }),
          "#123456": expect.toMatchSassString({ value: "color-hex" }),
          "rgba(0,1,2,0.5)": expect.toMatchSassString({ value: "color-rgba" }),
          black: expect.toMatchSassString({ value: "color-black-rgba" }),
          true: expect.toMatchSassString({ value: "boolean" }),
          null: expect.toMatchSassString({ value: "null" }),
          "1,2,3": expect.toMatchSassString({ value: "list" }),
          "1 2 3 4": expect.toMatchSassString({ value: "list-spaces" }),
          "(a: map)": expect.toMatchSassString({ value: "map" }),
          "(b: nested),(c: maps)": expect.toMatchSassString({ value: "list-maps" }),
          "(d: map)": expect.toMatchSassMap({
            value: {
              nested: expect.toMatchSassMap({
                value: {
                  "1,2,3": expect.toMatchSassString({ value: "list" }),
                  "1 2 3 4": expect.toMatchSassString({ value: "list-spaces" }),
                },
              }),
            },
          }),
          "#fcfcfc": expect.toMatchSassString({ value: "darkened-white" }),
          somekey: expect.toMatchSassString({ value: "key-variable" }),
        },
      })
    })
  })
})
