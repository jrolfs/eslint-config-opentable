module.exports = {
  extends: require.resolve('eslint-config-airbnb'),
  rules: {

    // Disallow comma-dangle
    // http://eslint.org/docs/rules/comma-dangle
    'comma-dangle': [2, 'never'],

    // Adds $.Deferred as an exception to the new-cap
    // rule, since it should not be used with new
    // http://eslint.org/docs/rules/new-cap
    'new-cap': [2, {
      capIsNewExceptions: ['$.Deferred']
    }],

    // A minor difference for assignments in a conditional expression
    // Instead of setting to ''always'', parenthesis make an assignment explicit
    // This is not explained in the AirBnB style guide either
    // http://eslint.org/docs/rules/no-cond-assign
    'no-cond-assign': [2, 'except-parens']
  }
};
