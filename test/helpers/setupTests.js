const { EOL } = require('os');
import { normalizePath } from "../../src/util"

expect.extend({
  matchDeclaration(received, expression, {
    sourceFile,
    isGlobal = false,
    isDefault = false,
    eol = EOL,
  } = {}) {
    const defaultFlag = isDefault ? "!default" : ""
    const globalFlag = isGlobal ? "!global" : ""
    const escapedExpression = expression
      // Escape characters that need to be escaped
      .replace(/[-[\]{}()*+?.,\\^$|]/g, "\\$&")
      // Replace actual whitespaces with the whitespace pattern
      .replace(/[^\S\r\n]+/g, "\\s+")
      // Replace newlines with newline + whitespace
      .replace(/[\r\n]/g, `${eol}\\s*`)
    const expressionRegex = new RegExp(`^\\s*${escapedExpression}\\s*${defaultFlag}\\s*${globalFlag}\\s*$`, "mg")
    const nullDeclaration = {
      expression: "null",
      flags: {
        default: false,
        global: false,
      },
      in: normalizePath(sourceFile),
      position: {
        line: expect.any(Number),
        column: expect.any(Number),
      }
    }
    const declaration = {
      expression: expect.stringMatching(expressionRegex),
      flags: {
        default: isDefault,
        global: isGlobal,
      },
      in: normalizePath(sourceFile),
      position: {
        line: expect.any(Number),
        column: expect.any(Number),
      }
    }
    if (isGlobal) {
      expect(received).toEqual([nullDeclaration, declaration])
    } else {
      expect(received).toEqual([declaration])
    }
    return {
      pass: true,
      message: () => `expected ${received} to match ${expression}`,
    };
  },
})