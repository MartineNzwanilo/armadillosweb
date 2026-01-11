
import path from 'path';
import fs from 'fs';

const mediaUrl = '/uploads/file-1768122318004.png'; // One of the files confirmed to exist
const relativePath = mediaUrl.startsWith('/') ? mediaUrl.slice(1) : mediaUrl;
const cwd = process.cwd();
const publicDir = 'public';
const safePath = path.join(cwd, publicDir, relativePath);

console.log('--- DEBUG INFO ---');
console.log('CWD:', cwd);
console.log('MediaURL:', mediaUrl);
console.log('RelativePath:', relativePath);
console.log('SafePath:', safePath);
console.log('Exists:', fs.existsSync(safePath));

// Check directory listing
const dir = path.dirname(safePath);
console.log('Dir:', dir);
if (fs.existsSync(dir)) {
    console.log('Dir Contents:', fs.readdirSync(dir));
} else {
    console.log('Dir does not exist');
}
