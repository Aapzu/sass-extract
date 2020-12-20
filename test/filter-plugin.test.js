import path from "path"
import { pick } from "../src/util"
import { renderFunctions } from "./helpers/testSets"

const PROPS_ALL = {
  $number1: 123,
  $number2: 456,
  $string: "string",
  $list: [{ value: 1 }, { value: 2 }, { value: 3 }],
}
const PROPS_NONE = {}

const filterPluginFile = path.join(__dirname, "scss", "filter-plugin.scss")

// [ filterType, shouldInclude, filterOptions, expectedProps ]
const testSets = {
  all: [
    [
      "all props",
      {
        expectedProps: PROPS_ALL,
      },
    ],
  ],
  prop: [
    [
      "all props",
      {
        filterOptions: {
          only: { props: ["$number1", "$number2", "$string", "$list"] },
        },
        expectedProps: PROPS_ALL,
      },
    ],
    [
      "all props",
      {
        filterOptions: {
          only: { props: [] },
        },
        expectedProps: PROPS_ALL,
      },
    ],
    [
      "all props",
      {
        filterOptions: {
          except: { props: ["$blahblah"] },
        },
        expectedProps: PROPS_ALL,
      },
    ],
    [
      "$number1",
      {
        filterOptions: {
          only: { props: ["$number1"] },
        },
        expectedProps: pick(PROPS_ALL, ["$number1"]),
      },
    ],
    [
      "$number2 and $list",
      {
        filterOptions: {
          only: { props: ["$number2", "$list"] },
        },
        expectedProps: pick(PROPS_ALL, ["$number2", "$list"]),
      },
    ],
  ],
  type: [
    [
      "numbers",
      {
        filterOptions: {
          only: { types: ["SassNumber", "SassString", "SassList"] },
        },
        expectedProps: PROPS_ALL,
      },
    ],
    [
      "list",
      {
        filterOptions: {
          only: { types: [] },
        },
        expectedProps: PROPS_ALL,
      },
    ],
    [
      "numbers and string",
      {
        filterOptions: {
          except: { types: ["SassNotThere"] },
        },
        expectedProps: PROPS_ALL,
      },
    ],
    [
      "numbers and string",
      {
        filterOptions: {
          only: { types: ["SassNumber"] },
        },
        expectedProps: pick(PROPS_ALL, ["$number1", "$number2"]),
      },
    ],
    [
      "numbers and string",
      {
        filterOptions: {
          only: { types: ["SassList"] },
        },
        expectedProps: pick(PROPS_ALL, ["$list"]),
      },
    ],
    [
      "numbers and string",
      {
        filterOptions: {
          only: { types: ["SassNumber", "SassString"] },
        },
        expectedProps: pick(PROPS_ALL, ["$number2", "$number2", "$string"]),
      },
    ],
  ],
  mix: [
    [
      "numbers and string",
      {
        filterOptions: {
          only: { props: ["$number1"], types: ["SassNumber"] },
        },
        expectedProps: pick(PROPS_ALL, ["$number1"]),
      },
    ],
    [
      "numbers and string",
      {
        filterOptions: {
          only: { types: ["SassNumber"] },
          except: { props: ["$number1"] },
        },
        expectedProps: pick(PROPS_ALL, ["$number2"]),
      },
    ],
    [
      "numbers and string",
      {
        filterOptions: {
          only: { types: ["SassNumber"] },
          except: { types: ["SassNumber"] },
        },
        expectedProps: PROPS_NONE,
      },
    ],
    [
      "numbers and string",
      {
        filterOptions: {
          only: { props: ["$number1"] },
          except: { props: ["$number1"] },
        },
        expectedProps: PROPS_NONE,
      },
    ],
  ],
}

describe("filter-plugin", () => {
  describe.each(renderFunctions)("%s", (renderFuncType, renderFunc) => {
    describe.each(Object.keys(testSets))("%s", (filterType) => {
      it.each(testSets[filterType])(
        "should include %s",
        async (shouldInclude, { filterOptions, expectedProps }) => {
          const rendered = await renderFunc(
            { file: filterPluginFile },
            {
              plugins: [
                {
                  plugin: "filter",
                  options: filterOptions,
                },
              ],
            }
          )

          const global = {}

          Object.entries(expectedProps).forEach(([key, val]) => {
            global[key] = { value: val }
          })

          expect(rendered).toMatchObject({
            vars: { global },
          })
        }
      )
    })
  })
})
