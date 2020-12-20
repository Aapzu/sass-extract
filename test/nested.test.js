import path from "path"
import { renderFunctions } from "./helpers/testSets"

const nestedBasicFile = path.join(__dirname, "scss", "nested", "nested-basic.scss")
const nestedSubFile = path.join(__dirname, "scss", "nested", "sub", "sub.scss")
const nestedSub2File = path.join(__dirname, "scss", "nested", "sub", "sub2.scss")
const nestedOverridesFile = path.join(__dirname, "scss", "nested", "nested-overrides.scss")
const nestedOverridesSubFile = path.join(__dirname, "scss", "nested", "sub", "overrides.scss")

describe("nested", () => {
  describe.each(renderFunctions)("%s", (_, renderFunc) => {
    describe("nested-basic", () => {
      let rendered

      beforeAll(async () => {
        rendered = await renderFunc({ file: nestedBasicFile })
      })

      it("should extract $a", () => {
        expect(rendered.vars.global.$a).toMatchSassNumber(nestedBasicFile, {
          value: 100,
          unit: "px",
          declarations: expect.toMatchDeclarations([
            {
              expression: "100px",
              sourceFile: nestedBasicFile,
            },
          ]),
        })
      })

      it("should extract $b", () => {
        expect(rendered.vars.global.$b).toMatchSassNumber(nestedSubFile, {
          value: 200,
          unit: "px",
          declarations: expect.toMatchDeclarations([
            {
              expression: "200px",
              sourceFile: nestedSubFile,
            },
          ]),
        })
      })

      it("should extract $c", () => {
        expect(rendered.vars.global.$c).toMatchSassNumber(nestedSub2File, {
          value: 300,
          unit: "px",
          declarations: expect.toMatchDeclarations([
            {
              expression: "300px",
              sourceFile: nestedSub2File,
            },
          ]),
        })
      })
    })

    describe("nested-overrides", () => {
      let rendered

      beforeAll(async () => {
        rendered = await renderFunc({ file: nestedOverridesFile })
      })

      it("should extract $a", () => {
        expect(rendered.vars.global.$a).toMatchSassNumber(
          [nestedOverridesSubFile, nestedOverridesFile],
          {
            value: 200,
            unit: "px",
            declarations: expect.toMatchDeclarations([
              {
                expression: "200px",
                sourceFile: nestedOverridesSubFile,
              },
              {
                expression: "100px",
                sourceFile: nestedOverridesFile,
              },
            ]),
          }
        )
      })

      it("should extract $b", () => {
        expect(rendered.vars.global.$b).toMatchSassNumber(nestedOverridesSubFile, {
          value: 100,
          unit: "px",
          declarations: expect.toMatchDeclarations([
            {
              expression: "$a",
              sourceFile: nestedOverridesSubFile,
            },
          ]),
        })
      })
    })
  })
})
