import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import mime from "mime-types";

function walk(dir) {
    let files = [];

    for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);

        if (fs.statSync(full).isDirectory()) {
            files.push(...walk(full));
        } else {
            files.push(full);
        }
    }

    return files;
}

export async function deploy({
    directory,
    url,
    token
}) {

    const files = walk(directory);

    console.log(`Uploading ${files.length} files...`);

    for (const file of files) {

        const relative = path.relative(directory, file);

        const form = new FormData();

        form.append(
            "file",
            fs.createReadStream(file),
            {
                filename: relative,
                contentType: mime.lookup(file) || "application/octet-stream"
            }
        );

        await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
                ...(token ? {
                    Authorization: `Bearer ${token}`
                } : {})
            },
            maxBodyLength: Infinity
        });

        console.log("✓", relative);
    }

    console.log("Deploy complete.");
}
