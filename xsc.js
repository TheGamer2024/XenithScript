#!/usr/bin/env node

// Require any modules you need
const { compiler } = require('./compiler.js');

if (require.main === module) {
    (() => {
        const args = process.argv.slice(2);

        compiler(args[0]);
    })();
}