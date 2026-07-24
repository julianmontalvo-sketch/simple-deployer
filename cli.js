#!/usr/bin/env node

import { deploy } from "./index.js";

const [, , directory, url, token] = process.argv;

if (!directory || !url) {
    console.log(`
Usage:

simple-deploy <directory> <url> [token]

Example:

simple-deploy ./dist http://localhost:3000/upload
`);
    process.exit(1);
}

deploy({
    directory,
    url,
    token
}).catch(err => {
    console.error(err.message);
    process.exit(1);
});
