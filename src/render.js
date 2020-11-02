import Promise from 'bluebird';
import sass from './sass';
import { extract, extractSync } from './extract';

Promise.promisifyAll(sass);

/**
 * Render with node-sass using provided compile options and augment variable extraction
 */
export function render(compileOptions = {}, extractOptions) {
  return sass(extractOptions).renderAsync(compileOptions)
  .then(rendered => {
    return extract(rendered, { compileOptions, extractOptions })
    .then(vars => {
      rendered.vars = vars;
      return rendered;
    });
  });
}

/**
 * Render synchronously with node-sass using provided compile options and augment variable extraction
 */
export function renderSync(compileOptions = {}, extractOptions) {
  const rendered = sass(extractOptions).renderSync(compileOptions);
  rendered.vars = extractSync(rendered, { compileOptions, extractOptions })
  return rendered;
}
