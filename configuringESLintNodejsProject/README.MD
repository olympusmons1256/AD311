# Report

## Overview
- Initialized the project, `npm init` and ran `npm init @eslint/config. This generated the flat config file eslint.config.mjs.
- Added semi and quotes rules in the flat config file (inside the JS config block).
- Created a small JS test file (eslint-javascriptTestFile.js) with intentional double / single quote errors, semicolon errors, and also added an unused variable.
- For extra fun I added a lint script in package.json.
- Ran npm run lint to verify the rule enforcement was working correctly.

## Issues Encountered
- Shareable config (eslint-config-semistandard) conflicted with ESLint v9. I tried first to use semistandard but then reverted to using flat config rules.

## Observations
- ESLint enforces consistent style (i.e. quotes) and flags likely mistakes (i.e. no-unused-variables). In general this is meant to reduce bugs.
- Running lint early catches issues before execution. This is an effective way to check your work before each time you start your dev server, for example.
- Configurable rules help make it adaptable for a team to align their standards across while keeping the overall code uniform.