# Simple Deployer

A lightweight npm package for deploying small web applications by uploading files to an HTTP endpoint using `POST` requests.

The goal of this package is to provide a minimal deployment solution without requiring FTP, SFTP, SSH, or any other deployment protocol. A web server only needs to expose an endpoint capable of receiving uploaded files.

## Features

* Simple HTTP-based deployment
* Recursive directory upload
* Preserves directory structure
* Optional Bearer token authentication
* No external deployment services required
* Suitable for small web applications

---

## Installation

### Global installation

```bash
npm install -g simple-deployer
```

### Local installation

```bash
npm install simple-deployer
```

---

## Usage

```bash
simple-deploy <directory> <upload-url>
```

Example:

```bash
simple-deploy ./dist http://localhost:3000/upload
```

With Bearer authentication:

```bash
simple-deploy ./dist https://example.com/upload YOUR_TOKEN
```

---

## Command Syntax

```text
simple-deploy <directory> <url> [token]
```

| Argument  | Description                                |
| --------- | ------------------------------------------ |
| directory | Directory containing the application files |
| url       | HTTP endpoint that receives uploaded files |
| token     | Optional Bearer token                      |

---

## How It Works

1. Recursively scans the specified directory.
2. Uploads every file individually using an HTTP `POST` request.
3. Sends each file as `multipart/form-data`.
4. Includes the relative file path as the uploaded filename.
5. The server recreates the directory structure.

For example, given the following directory:

```text
dist/
│
├── index.html
├── app.js
├── css/
│   └── style.css
└── images/
    └── logo.png
```

The package uploads:

```
index.html
app.js
css/style.css
images/logo.png
```

The server can store each file using its relative path, automatically rebuilding the original directory tree.

---

## Server Requirements

The server must expose an endpoint that:

* Accepts HTTP POST requests.
* Accepts `multipart/form-data`.
* Reads the uploaded file.
* Uses the original filename (including its relative path) to recreate the directory structure.
* Stores the file in the desired deployment directory.

No additional protocol is required.

---

## Example Express Server

```javascript
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();

const upload = multer({
    storage: multer.memoryStorage()
});

app.post("/upload", upload.single("file"), (req, res) => {

    const destination = path.join("public", req.file.originalname);

    fs.mkdirSync(path.dirname(destination), {
        recursive: true
    });

    fs.writeFileSync(destination, req.file.buffer);

    res.json({
        success: true
    });

});

app.listen(3000);
```

---

## Authentication

Authentication is optional.

If a third argument is supplied, the package sends:

```
Authorization: Bearer YOUR_TOKEN
```

The server is responsible for validating the token.

---

## Example

```bash
simple-deploy ./build https://example.com/upload
```

Output:

```text
Uploading 12 files...

✓ index.html
✓ favicon.ico
✓ css/main.css
✓ js/app.js
✓ images/logo.png

Deploy complete.
```

---

## Limitations

This package is intentionally minimal.

Current limitations include:

* Files are uploaded sequentially.
* No retry mechanism.
* No checksum verification.
* No compression.
* No synchronization or deletion of removed files.
* No rollback support.

These design decisions keep the package simple and easy to integrate into lightweight deployment workflows.

---

## License

MIT
