module.exports = {
  extends: "airbnb-base",
  env: {
    node: true,
  },
  rules: {
    "no-console": 0,
    "no-param-reassign": 0,
    "max-len": 0,
    "no-case-declarations": 0,
    "arrow-body-style": 0,
    "no-underscore-dangle": 0,
    "no-unused-expressions": [ "error", { "allowTernary": true } ],
  },
  overrides: [
    {
      files: [ "src/**/*.test.js" ],
      env: {
        mocha: true
      },
      rules: {
        'no-unused-expressions': [ "off" ]
      }
    }
  ]
};
