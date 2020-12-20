import path from "path"
import { normalizePath } from "../src/util"
import { renderSync } from "../src"

const orderFile = path.join(__dirname, "scss", "order.scss")
const order1File = path.join(__dirname, "scss", "order", "1.scss")
const order2File = path.join(__dirname, "scss", "order", "2.scss")

describe("partial", () => {
  describe("sync", () => {
    it("should extract in the right order", () => {
      for (let i = 0; i < 20; i++) {
        const rendered = renderSync({ file: orderFile })
        expect(rendered).toMatchObject({
          vars: {
            global: {
              $var: {
                value: 2,
                sources: [normalizePath(order1File), normalizePath(order2File)],
                declarations: expect.toMatchDeclarations([
                  {
                    expression: "1",
                    sourceFile: order1File,
                  },
                  {
                    expression: "2",
                    sourceFile: order2File,
                  },
                ]),
              },
              $var2: {
                value: 3,
                sources: [
                  normalizePath(order1File),
                  normalizePath(order2File),
                  normalizePath(orderFile),
                ],
                declarations: expect.toMatchDeclarations([
                  {
                    expression: "1",
                    sourceFile: order1File,
                  },
                  {
                    expression: "2",
                    sourceFile: order2File,
                  },
                  {
                    expression: "3",
                    sourceFile: orderFile,
                  },
                ]),
              },
            },
          },
        })
      }
    })
  })
})
