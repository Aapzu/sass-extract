import path from "path"
import serializePlugin from "../src/plugins/serialize"
import compactPlugin from "../src/plugins/compact"
import minimalPlugin from "../src/plugins/minimal"
import { renderFunctions } from "./helpers/testSets"

function verifySerializedResult(rendered) {
  expect(rendered).toMatchObject({
    vars: {
      global: {
        $number: {
          value: "123px",
        },
        $string: {
          value: "string",
        },
        $border: {
          value: "1px solid black",
        },
        $map: {
          value: "(a (b c d) c: 1 (2 3 4) 5)",
        },
      },
    },
  })
}

function verifyCompactResult(rendered) {
  expect(rendered).toMatchObject({
    vars: {
      global: {
        $number: 123,
        $string: "string",
        $border: [1, "solid", { r: 0, g: 0, b: 0, a: 1, hex: "#000000" }],
        $map: { "a (b c d) c": [1, [2, 3, 4], 5] },
      },
    },
  })
}

function verifyMinimalResult(rendered) {
  expect(rendered).toMatchObject({
    vars: {
      global: {
        $number: "123px",
        $string: "string",
        $border: "1px solid black",
        $map: "(a (b c d) c: 1 (2 3 4) 5)",
      },
    },
  })
}

const pluginsFile = path.join(__dirname, "scss", "plugins.scss")

describe("plugins", () => {
  describe.each(renderFunctions)("%s", (_, renderFunc) => {
    describe("serialize", () => {
      it("should serialize extracted results", async () => {
        const rendered = await renderFunc({ file: pluginsFile }, { plugins: [serializePlugin] })
        verifySerializedResult(rendered)
      })
    })

    describe("compact", () => {
      it("should compact extracted results", async () => {
        const rendered = await renderFunc({ file: pluginsFile }, { plugins: [compactPlugin] })
        verifyCompactResult(rendered)
      })
    })

    describe("compact+serialize", () => {
      it("should run both compact and serialize plugins on extracted results", async () => {
        const rendered = await renderFunc(
          { file: pluginsFile },
          { plugins: [serializePlugin, compactPlugin] }
        )
        verifyMinimalResult(rendered)
      })
    })

    describe("minimal", () => {
      it("should combine serialize and compact to get minimal extracted results", async () => {
        const rendered = await renderFunc({ file: pluginsFile }, { plugins: [minimalPlugin] })
        verifyMinimalResult(rendered)
      })
    })
  })
})
