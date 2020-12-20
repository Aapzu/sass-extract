import { EOL } from "os"
import { normalizePath } from "../../src/util"

function toMatchSassVariable(
  variableType,
  received,
  sourceFileOrVariableDefinition,
  backupVariableDefinition
) {
  let sourceFile, variableDefinition
  if (
    typeof sourceFileOrVariableDefinition === "object" &&
    !Array.isArray(sourceFileOrVariableDefinition)
  ) {
    variableDefinition = sourceFileOrVariableDefinition
  } else {
    sourceFile = sourceFileOrVariableDefinition
    variableDefinition = backupVariableDefinition
  }
  const sourceFiles = sourceFile
    ? Array.isArray(sourceFile)
      ? sourceFile
      : [sourceFile]
    : undefined
  const objectToMatch = {
    type: variableType,
    ...variableDefinition,
  }
  if (sourceFiles && !objectToMatch.sources) {
    objectToMatch.sources = sourceFiles.map((file) => normalizePath(file))
  }
  expect(received).toMatchObject(objectToMatch)
  return {
    pass: true,
  }
}

function toMatchSassString(received, sourceFileOrVariableDefinition, backupVariableDefinition) {
  return toMatchSassVariable(
    "SassString",
    received,
    sourceFileOrVariableDefinition,
    backupVariableDefinition
  )
}

function toMatchSassNumber(received, sourceFileOrVariableDefinition, backupVariableDefinition) {
  return toMatchSassVariable(
    "SassNumber",
    received,
    sourceFileOrVariableDefinition,
    backupVariableDefinition
  )
}

function toMatchSassBoolean(received, sourceFileOrVariableDefinition, backupVariableDefinition) {
  return toMatchSassVariable(
    "SassBoolean",
    received,
    sourceFileOrVariableDefinition,
    backupVariableDefinition
  )
}

function toMatchSassList(received, sourceFileOrVariableDefinition, backupVariableDefinition) {
  return toMatchSassVariable(
    "SassList",
    received,
    sourceFileOrVariableDefinition,
    backupVariableDefinition
  )
}

function toMatchSassColor(received, sourceFileOrVariableDefinition, backupVariableDefinition) {
  return toMatchSassVariable(
    "SassColor",
    received,
    sourceFileOrVariableDefinition,
    backupVariableDefinition
  )
}

function toMatchSassMap(received, sourceFileOrVariableDefinition, backupVariableDefinition) {
  return toMatchSassVariable(
    "SassMap",
    received,
    sourceFileOrVariableDefinition,
    backupVariableDefinition
  )
}

function toMatchSassNull(received, sourceFileOrVariableDefinition, backupVariableDefinition) {
  return toMatchSassVariable(
    "SassNull",
    received,
    sourceFileOrVariableDefinition,
    backupVariableDefinition
  )
}

function toMatchDeclarations(received, declarations) {
  const mappedDeclarations = declarations.map(
    ({ expression, sourceFile, isGlobal = false, isDefault = false, eol = EOL } = {}) => {
      const defaultFlag = isDefault ? "!default" : ""
      const globalFlag = isGlobal ? "!global" : ""
      const escapedExpression = expression
        // Escape characters that need to be escaped
        .replace(/[-[\]{}()*+?.,\\^$|]/g, "\\$&")
        // Replace actual whitespaces with the whitespace pattern
        .replace(/[^\S\r\n]+/g, "\\s+")
        // Replace newlines with newline + whitespace
        .replace(/[\r\n]/g, `${eol}\\s*`)
      const expressionRegex = new RegExp(
        `^\\s*${escapedExpression}\\s*${defaultFlag}\\s*${globalFlag}\\s*$`,
        "mg"
      )

      if (!sourceFile) {
        throw new Error("sourceFile missing")
      }

      return {
        expression: expect.stringMatching(expressionRegex),
        flags: {
          default: isDefault,
          global: isGlobal,
        },
        in: normalizePath(sourceFile),
        position: {
          line: expect.any(Number),
          column: expect.any(Number),
        },
      }
    }
  )
  expect(received).toEqual(mappedDeclarations)
  return {
    pass: true,
  }
}

expect.extend({
  toMatchDeclarations,
  toMatchSassBoolean,
  toMatchSassColor,
  toMatchSassList,
  toMatchSassMap,
  toMatchSassNumber,
  toMatchSassString,
  toMatchSassNull,
})
