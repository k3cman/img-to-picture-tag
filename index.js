const path = require('path');
const fs = require('fs');
const jsdom = require('jsdom');
const glob = require('glob');
const {
    JSDOM
} = jsdom;

// function fromDir(startPath, filter) {
//     if (!fs.existsSync(startPath)) {
//         console.log('no dir', startPath);
//         return;
//     }
//     var files = fs.readdirSync(startPath);
//     for (var i = 0; i < files.length; i++) {
//         let filename = path.join(startPath, files[i]);
//         let stat = fs.lstatSync(filename);
//         if (stat.isDirectory()) {
//             fromDir(filename, filter);
//         } else if (filename.indexOf(filter) >= 0) {
//             console.log('--found:', filename)
//         }
//     }
// }

// glob(__dirname + '/**/*.htm', {
//     ignore: 'node_modules/**/*.htm'
// }, (err, files) => {
//     const excludePackagePaths = files.filter(file => {
//         if (!file.includes('node_modules')) {
//             return file;
//         } else {
//             return;
//         }
//     });
//     for (let path of excludePackagePaths) {
//         replaceTags(path);
//     }
// })





const replaceTags = (path) => {
    fs.readFile(path, 'utf-8', (err, html) => {
        if (err) {
            throw err;
        }
        const jsHTML = new JSDOM(html);
        const dom = jsHTML.window.document;
        const imgs = dom.getElementsByTagName('img');
        const numOfImgs = imgs.length;
        for (let img of imgs) {
            if (img.parentElement.tagName !== 'PICTURE' || img.parentNode.tagName !== 'PICTURE') {
                let picture = dom.createElement('picture');
                if (img.classList.length > 0) {
                    picture.classList = img.classList;
                }
                picture.innerHTML = `
                    <source srcset="${img.src.slice(0,-4)}.webp" type="image/webp">
                    <source srcset="${img.src}" type="image/${img.src.substr(img.src.length - 3)}">
                    <img src="${img.src}" alt="${img.alt}">
                `;
                img.replaceWith(picture);
                // console.log('replaced ', img, 'with', picture);

            }
        };
        const newDocument = jsHTML.document.toString();
        console.log(newDocument);

    });
}

replaceTags('./blumentest/buchungsprozess.htm');