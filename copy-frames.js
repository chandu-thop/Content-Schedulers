const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frames_1');
const destDir = path.join(__dirname, 'client', 'public', 'frames_1');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
console.log(`Copying ${files.length} files from ${srcDir} to ${destDir}...`);

files.forEach((file, index) => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    fs.copyFileSync(srcPath, destPath);
    if ((index + 1) % 50 === 0 || index === files.length - 1) {
        console.log(`Copied ${index + 1}/${files.length} files...`);
    }
});

console.log('Copy complete!');
