#!/usr/bin/env node

// Require any modules you need
const { interpreter } = require('./interpreter.js');

if (require.main === module) {
    (() => {
        const args = process.argv.slice(2);

        interpreter(args[0]);
    })();
}