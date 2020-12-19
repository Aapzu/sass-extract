const path = require('path');
const implementations = require("./helpers/implementations")
const { render, renderSync } = require('../src');
const { normalizePath } = require('../src/util');

const basicImplicitFile = path.join(__dirname, 'sass', 'basic-implicit.scss');
const basicExplicitFile = path.join(__dirname, 'sass', 'basic-explicit.scss');
const basicMixedFile = path.join(__dirname, 'sass', 'basic-mixed.scss');
const basicMixedFileWinLe = path.join(__dirname, 'sass', 'basic-mixed-win-le.scss');

const files = [
  ['implicit', basicImplicitFile],
  ['explicit', basicExplicitFile, {
    explicit: true
  }],
  ['mixed', basicMixedFile, {
    mixed: true
  }],
  ['mixed-win-le', basicMixedFileWinLe, {
    mixed: true,
    eol: "\\r\\n",
  }],
]

const renderFunctions = [
  ['sync', renderSync],
  ['async', render],
]

describe.each(implementations)('basic - %s', (implementationName, sassImplementation) => {
  describe.each(files)('%s', (fileTitle, sourceFile, { explicit, mixed, eol } = {}) => {
    describe.each(renderFunctions)('%s', (renderFuncType, renderFunc) => {
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
            }
          },
        })
      })

      it('extracts $number1 correctly', () => {
        expect(rendered.vars.global).toMatchObject({
          $number1: {
            type: 'SassNumber',
            value: 100,
            unit: 'px',
            sources: [normalizePath(sourceFile)],
            declarations: expect.matchDeclaration("100px", {
              sourceFile,
              eol,
              isGlobal: explicit || mixed,
            }),
          },
        })
      })

      it('extracts $number2 correctly', () => {
        expect(rendered.vars.global).toMatchObject({
          $number2: {
            type: 'SassNumber',
            value: 200,
            unit: 'px',
            sources: [normalizePath(sourceFile)],
            declarations: expect.matchDeclaration("$number1 * 2", {
              sourceFile,
              eol,
              isGlobal: explicit || mixed,
            }),
          },
        })
      })

      it('extracts $color correctly', () => {
        expect(rendered.vars.global).toMatchObject({
          $color: {
            type: 'SassColor',
            value: {
              r: 255,
              g: 0,
              b: 0,
              a: 1,
              hex: '#ff0000',
            },
            sources: [normalizePath(sourceFile)],
            declarations: expect.matchDeclaration("get-color()", {
              sourceFile,
              eol,
              isGlobal: explicit || mixed,
            }),
          },
        })
      })

      it('extracts $list correctly', () => {
        expect(rendered.vars.global).toMatchObject({
          $list: {
            type: 'SassList',
            value: [{
              value: 1,
              unit: 'px',
              type: 'SassNumber',
            }, {
              value: 'solid',
              type: 'SassString',
            }, {
              value: {
                r: 0,
                g: 0,
                b: 0,
                a: 1,
                hex: '#000000',
              },
              type: 'SassColor',
            }],
            separator: " ",
            sources: [normalizePath(sourceFile)],
            declarations: expect.matchDeclaration("1px solid black", {
              sourceFile,
              eol,
              isGlobal: explicit,
            }),
          },
        })
      })

      it('extracts $listComma correctly', () => {
        expect(rendered.vars.global).toMatchObject({
          $listComma: {
            type: 'SassList',
            value: [{
              type: 'SassString',
              value: 'tahoma',
            }, {
              type: 'SassString',
              value: 'arial',
            }],
            separator: ',',
            sources: [normalizePath(sourceFile)],
            declarations: expect.matchDeclaration("tahoma, arial", {
              sourceFile,
              eol,
              isGlobal: explicit,
            }),
          },
        })
      })

      it('extracts $string correctly', () => {
        expect(rendered.vars.global).toMatchObject({
          $string: {
            type: 'SassString',
            value: 'string',
            sources: [normalizePath(sourceFile)],
            declarations: expect.matchDeclaration("\'string\'", {
              sourceFile,
              eol,
              isGlobal: explicit,
            }),
          },
        })
      })

      it('extracts $boolean correctly', () => {
        expect(rendered.vars.global).toMatchObject({
          $boolean: {
            type: 'SassBoolean',
            value: true,
            sources: [normalizePath(sourceFile)],
            declarations: expect.matchDeclaration("true", {
              sourceFile,
              eol,
              isGlobal: explicit,
            }),
          },
        })
      })

      it('extracts $null correctly', () => {
        expect(rendered.vars.global).toMatchObject({
          $null: {
            type: 'SassNull',
            value: null,
            sources: [normalizePath(sourceFile)],
            declarations: expect.matchDeclaration("null", {
              sourceFile,
              eol,
              isGlobal: explicit,
            }),
          },
        })
      })

      it('extracts $map correctly', () => {
        expect(rendered.vars.global).toMatchObject({
          $map: {
            type: 'SassMap',
            value: {
              number: {
                type: "SassNumber",
                unit: "em",
                value: 2,
              },
              string: {
                type: 'SassString',
                value: 'mapstring',
              },
            },
            sources: [normalizePath(sourceFile)],
            declarations: expect.matchDeclaration("(\n  number: 2em,\n  string: 'mapstring'\n)", {
              sourceFile,
              eol,
              isGlobal: explicit,
            }),
          },
        })
      })
    })
  })
})
