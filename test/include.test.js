import path from "path"
import { renderFunctions } from "./helpers/testSets"

const includeRootFile = path.join(__dirname, "scss", "include", "root.scss")
const includeRoot2File = path.join(__dirname, "scss", "include", "root2.scss")
const includeRoot3File = path.join(__dirname, "scss", "include", "root3.scss")
const includeRoot4File = path.join(__dirname, "scss", "include", "root4.scss")
const includeSubFile = path.join(__dirname, "scss", "include", "sub", "included.scss")
const includeSubFile2 = path.join(__dirname, "scss", "include", "sub", "included2.scss")
const includeSubDir = path.join(__dirname, "scss", "include", "sub")
const includeSubConflictDir = path.join(__dirname, "scss", "include", "sub-conflict")
const includeSubConflictFile = path.join(
  __dirname,
  "scss",
  "include",
  "sub-conflict",
  "included.scss"
)
const includeSubConflictFile2 = path.join(
  __dirname,
  "scss",
  "include",
  "sub-conflict",
  "included2.scss"
)
const relativeIncludeSubDir = path.join("./test/scss/include/sub")

const SUB_INCLUDED_COLOR = "#0000ff"
const SUB_INCLUDED2_COLOR = "#000000"
const SUB_CONFLICT_INCLUDED_COLOR = "#008000"
const SUB_CONFLICT_INCLUDED2_COLOR = "#ffffff"

const getNewUrl = (url) => (url === "foo" ? "./included.scss" : url)
const getNewAbsoluteUrl = (url) =>
  url === "foo" ? path.join(__dirname, "scss", "include", "sub", "included.scss") : url

const testSets = {
  "sub only": [
    [
      "root1",
      [includeSubDir],
      includeRootFile,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
    ],
    [
      "root2",
      [includeSubDir],
      includeRoot2File,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
    ],
    [
      "root3",
      [includeSubDir],
      includeRoot3File,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
    ],
  ],
  "sub, conflict": [
    [
      "root1",
      [includeSubDir, includeSubConflictDir],
      includeRootFile,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
    ],
    [
      "root2",
      [includeSubDir, includeSubConflictDir],
      includeRoot2File,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
    ],
    [
      "root3",
      [includeSubDir, includeSubConflictDir],
      includeRoot3File,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
    ],
  ],
  "conflict, sub": [
    [
      "root1",
      [includeSubConflictDir, includeSubDir],
      includeRootFile,
      SUB_CONFLICT_INCLUDED_COLOR,
      SUB_CONFLICT_INCLUDED2_COLOR,
      includeSubConflictFile,
      includeSubConflictFile2,
    ],
    [
      "root2",
      [includeSubConflictDir, includeSubDir],
      includeRoot2File,
      SUB_CONFLICT_INCLUDED_COLOR,
      SUB_CONFLICT_INCLUDED2_COLOR,
      includeSubConflictFile,
      includeSubConflictFile2,
    ],
    [
      "root3",
      [includeSubConflictDir, includeSubDir],
      includeRoot3File,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
    ],
  ],
  "relative include path": [
    [
      "root1",
      [relativeIncludeSubDir],
      includeRootFile,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
    ],
    [
      "root2",
      [relativeIncludeSubDir],
      includeRoot2File,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
    ],
    [
      "root3",
      [relativeIncludeSubDir],
      includeRoot3File,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
    ],
  ],
  "custom importer": [
    [
      "root4",
      [includeSubDir],
      includeRoot4File,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
      [(url) => ({ file: getNewUrl(url) })],
    ],
  ],
  "array of custom importers": [
    [
      "root4",
      [includeSubDir],
      includeRoot4File,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
      [() => null, (url) => ({ file: getNewUrl(url) })],
    ],
  ],
  "absolute include path": [
    [
      "root4",
      undefined,
      includeRoot4File,
      SUB_INCLUDED_COLOR,
      SUB_INCLUDED2_COLOR,
      includeSubFile,
      includeSubFile2,
      [() => null, (url) => ({ file: getNewAbsoluteUrl(url) })],
    ],
  ],
}

describe("include", () => {
  describe.each(renderFunctions)("%s", (renderFuncType, renderFunc) => {
    describe.each(Object.keys(testSets))("%s", (testSetName) => {
      describe.each(testSets[testSetName])(
        "%s",
        (
          _,
          includePaths,
          sourceFile,
          includedColor,
          separateColor,
          includedFile,
          included2File,
          importer
        ) => {
          let rendered

          beforeAll(async () => {
            // Map sync importer to async if needed
            const mappedImporter =
              importer &&
              importer.map((importerFunc) => (url, prev, done) => {
                const res = importerFunc(url, prev)
                if (renderFuncType === "async") {
                  done(res)
                } else {
                  return res
                }
              })
            rendered = await renderFunc({
              file: sourceFile,
              includePaths,
              importer: mappedImporter,
            })
          })

          it("should extract $color", async () => {
            expect(rendered.vars.global.$color).toMatchSassColor(sourceFile, {
              value: {
                hex: includedColor,
              },
            })
          })

          it("should extract $includedColor", async () => {
            expect(rendered.vars.global.$includedColor).toMatchSassColor(includedFile, {
              value: {
                hex: includedColor,
              },
            })
          })

          it("should extract $separateColor", async () => {
            expect(rendered.vars.global.$separateColor).toMatchSassColor(included2File, {
              value: {
                hex: separateColor,
              },
            })
          })
        }
      )
    })
  })
})
