import path from "path"
import { renderFunctions } from "./helpers/testSets"

const basicImplicitFile = path.join(__dirname, "scss", "basic-implicit.scss")
const basicExplicitFile = path.join(__dirname, "scss", "basic-explicit.scss")
const basicMixedFile = path.join(__dirname, "scss", "basic-mixed.scss")
const basicMixedFileWinLe = path.join(__dirname, "scss", "basic-mixed-win-le.scss")

const files = [
  ["implicit", basicImplicitFile],
  [
    "explicit",
    basicExplicitFile,
    {
      explicit: true,
    },
  ],
  [
    "mixed",
    basicMixedFile,
    {
      mixed: true,
    },
  ],
  [
    "mixed-win-le",
    basicMixedFileWinLe,
    {
      mixed: true,
      eol: "\\r\\n",
    },
  ],
]

describe("basic", () => {
  describe.each(implementations)('basic', (implementationName, sassImplementation) => {
    describe.each(renderFunctions)("%s", (renderFuncType, renderFunc) => {
      describe.each(files)("%s", (fileTitle, sourceFile, { explicit, mixed, eol } = {}) => {
        let rendered

        beforeAll(async () => {
          rendered = await renderFunc({
            file: sourceFile
          }, {
            implementation: sassImplementation
          })
        })

        it('has correct shape in general', () => {
          expect(rendered).toEqual({
            css: expect.any(Buffer),
            stats: expect.any(Object),
            vars: {
              global: {
                $number1: expect.any(Object),
                $number2: expect.any(Object),
                $color: expect.any(Object),
                $list: expect.any(Object),
                $listComma: expect.any(Object),
                $string: expect.any(Object),
                $boolean: expect.any(Object),
                $null: expect.any(Object),
                $map: expect.any(Object),
              },
            },
          })
        })

        it("extracts $number1 correctly", () => {
          expect(rendered.vars.global.$number1).toMatchSassNumber(sourceFile, {
            value: 100,
            unit: "px",
            declarations: expect.toMatchDeclarations([
              {
                expression: "100px",
                sourceFile,
                eol,
                isGlobal: explicit || mixed,
              },
            ]),
          })
        })

        it("extracts $number2 correctly", () => {
          expect(rendered.vars.global.$number2).toMatchSassNumber(sourceFile, {
            value: 200,
            unit: "px",
            declarations: expect.toMatchDeclarations([
              {
                expression: "$number1 * 2",
                sourceFile,
                eol,
                isGlobal: explicit || mixed,
              },
            ]),
          })
        })

        it("extracts $color correctly", () => {
          expect(rendered.vars.global.$color).toMatchSassColor(sourceFile, {
            value: {
              r: 255,
              g: 0,
              b: 0,
              a: 1,
              hex: "#ff0000",
            },
            declarations: expect.toMatchDeclarations([
              {
                expression: "get-color()",
                sourceFile,
                eol,
                isGlobal: explicit || mixed,
              },
            ]),
          })
        })

        it("extracts $list correctly", () => {
          expect(rendered.vars.global.$list).toMatchSassList(sourceFile, {
            value: [
              {
                value: 1,
                unit: "px",
                type: "SassNumber",
              },
              {
                value: "solid",
                type: "SassString",
              },
              {
                value: {
                  r: 0,
                  g: 0,
                  b: 0,
                  a: 1,
                  hex: "#000000",
                },
                type: "SassColor",
              },
            ],
            separator: " ",
            declarations: expect.toMatchDeclarations([
              {
                expression: "1px solid black",
                sourceFile,
                eol,
                isGlobal: explicit,
              },
            ]),
          })
        })

        it("extracts $listComma correctly", () => {
          expect(rendered.vars.global.$listComma).toMatchSassList(sourceFile, {
            value: [
              {
                type: "SassString",
                value: "tahoma",
              },
              {
                type: "SassString",
                value: "arial",
              },
            ],
            separator: ",",
            declarations: expect.toMatchDeclarations([
              {
                expression: "tahoma, arial",
                sourceFile,
                eol,
                isGlobal: explicit,
              },
            ]),
          })
        })

        it("extracts $string correctly", () => {
          expect(rendered.vars.global.$string).toMatchSassString(sourceFile, {
            value: "string",
            declarations: expect.toMatchDeclarations([
              {
                expression: "'string'",
                sourceFile,
                eol,
                isGlobal: explicit,
              },
            ]),
          })
        })

        it("extracts $boolean correctly", () => {
          expect(rendered.vars.global.$boolean).toMatchSassBoolean(sourceFile, {
            value: true,
            declarations: expect.toMatchDeclarations([
              {
                expression: "true",
                sourceFile,
                eol,
                isGlobal: explicit,
              },
            ]),
          })
        })

        it("extracts $null correctly", () => {
          expect(rendered.vars.global.$null).toMatchSassNull(sourceFile, {
            value: null,
            declarations: expect.toMatchDeclarations([
              {
                expression: "null",
                sourceFile,
                eol,
                isGlobal: explicit,
              },
            ]),
          })
        })

        it("extracts $map correctly", () => {
          expect(rendered.vars.global.$map).toMatchSassMap(sourceFile, {
            value: {
              number: {
                type: "SassNumber",
                unit: "em",
                value: 2,
              },
              string: {
                type: "SassString",
                value: "mapstring",
              },
            },
            declarations: expect.toMatchDeclarations([
              {
                expression: "(\n  number: 2em,\n  string: 'mapstring'\n)",
                sourceFile,
                eol,
                isGlobal: explicit,
              },
            ]),
          })
        })
      })
    })
  })
})
