'use strict';

module.exports = {
  extends: 'google',
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'max-len': ['error', 120],
    'comma-dangle': ['error', 'never'],
    'require-jsdoc': ['error', {
      'require': {
        'FunctionDeclaration': true,
        'MethodDefinition': true,
        'ClassDeclaration': false,
        'ArrowFunctionExpression': false,
        'FunctionExpression': true
      }
    }]
  }
};

