import test from 'tape';
import outdent from 'outdent';
import { CLIEngine } from 'eslint';

import eslintrc from '../';

const cli = new CLIEngine({
  useEslintrc: false,
  baseConfig: eslintrc,

  rules: {
    // It is okay to import devDependencies in tests.
    'import/no-extraneous-dependencies': [2, { devDependencies: true }]
  }
});

function lint(text) {
  // @see http://eslint.org/docs/developer-guide/nodejs-api.html#executeonfiles
  // @see http://eslint.org/docs/developer-guide/nodejs-api.html#executeontext
  const linter = cli.executeOnText(text);
  return linter.results[0];
}

test('disallow "comma-dangle"', (tap) => {
  tap.test('for dangle-less code', (t) => {
    t.plan(3);

    const result = lint(outdent`
      const noDangle = {
        foo: 'foo',
        bar: {
          bar: 'bar',
          baz: 'baz'
        }
      };

      export default noDangle;

    `);

    t.notOk(result.warningCount, 'no warnings');
    t.notOk(result.errorCount, 'no errors');
    t.deepEquals(result.messages, [], 'no messages in results');
  });

  tap.test('for dangle-y code', (t) => {
    t.plan(2);

    const result = lint(outdent`
      const noDangle = {
        foo: 'foo',
        bar: {
          bar: 'bar',
          baz: 'baz',
        },
      };

      export default noDangle;

    `);

    t.ok(result.errorCount, 'fails');
    t.equal(result.messages[0].ruleId, 'comma-dangle', 'fails due to dangle');
  });
});

test('allow "$.Deferred"', (tap) => {
  tap.test('for "$.Deferred" used as factory', (t) => {
    t.plan(3);

    const result = lint(outdent`
      const deferred = $.Deferred(); // eslint-disable-line no-undef

      export default deferred;

    `);

    t.notOk(result.warningCount, 'no warnings');
    t.notOk(result.errorCount, 'no errors');
    t.deepEquals(result.messages, [], 'no messages in results');
  });
});

test('allow "cond-assign" in parenthesis', (tap) => {
  tap.test('for conditional assignment wrapped in parenthesis', (t) => {
    t.plan(3);

    const result = lint(outdent`
      let someNode = document.getElementById('#some-node'); // eslint-disable-line no-undef

      do {
        someNode.height = '100px';
      } while ((someNode = someNode.parentNode) !== null);

    `);

    t.notOk(result.warningCount, 'no warnings');
    t.notOk(result.errorCount, 'no errors');
    t.deepEquals(result.messages, [], 'no messages in results');
  });

  tap.test('for conditional assignment not wrapped in parenthesis', (t) => {
    t.plan(2);

    const result = lint(outdent`
      let someNode = document.getElementById('#some-node'); // eslint-disable-line no-undef

      do {
        someNode.height = '100px';
      } while (someNode = someNode.parentNode !== null);

    `);

    t.ok(result.errorCount, 'fails');
    t.equal(result.messages[0].ruleId, 'no-cond-assign', 'fails due to assignment in condition');
  });
});
