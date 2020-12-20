import path from "path"
import { renderFunctions } from "./helpers/testSets"

const inlineData = `
  $number1: 123px;
  $number2: 2 * $number1;
  $color: red;
`

const inlineNestedData = `
  @import './nested/inline.scss';

  $number2: 2 * $number1;
`

const inlineNestedPath = path.join(__dirname, "scss")
const inlineNested1File = path.join(__dirname, "scss", "nested", "inline.scss")
const inlineNested2File = path.join(__dirname, "scss", "nested", "inline2.scss")

const testSets = [
  ["inline", inlineData, undefined, "data", "data", "data"],
  [
    "inline-nested",
    inlineNestedData,
    [inlineNestedPath],
    inlineNested1File,
    "data",
    inlineNested2File,
  ],
]

describe("inline", () => {
  describe.each(testSets)(
    "%s",
    (_, data, includePaths, number1Source, number2Source, colorSource) => {
      describe.each(renderFunctions)("%s", (r, renderFunc) => {
        let rendered

        beforeAll(async () => {
          rendered = await renderFunc({ data, includePaths })
        })

        it("should extract $number1", async () => {
          expect(rendered.vars.global.$number1).toMatchSassNumber(number1Source, {
            value: 123,
            unit: "px",
            declarations: expect.toMatchDeclarations([
              {
                expression: "123px",
                sourceFile: number1Source,
              },
            ]),
          })
        })

        it("should extract $number2", async () => {
          expect(rendered.vars.global.$number2).toMatchSassNumber(number2Source, {
            value: 246,
            unit: "px",
            declarations: expect.toMatchDeclarations([
              {
                expression: "2 * $number1",
                sourceFile: number2Source,
              },
            ]),
          })
        })

        it("should extract $color", async () => {
          expect(rendered.vars.global.$color).toMatchSassColor(colorSource, {
            value: {
              r: 255,
              g: 0,
              b: 0,
              a: 1,
              hex: "#ff0000",
            },
            declarations: expect.toMatchDeclarations([
              {
                expression: "red",
                sourceFile: colorSource,
              },
            ]),
          })
        })
      })
    }
  )
})
