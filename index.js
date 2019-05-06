const path = require('path');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function fromDir(startPath, filter){
    if(!fs.existsSync(startPath)){
        console.log('no dir', startPath);
        return;
    }
    var files = fs.readdirSync(startPath);
    for(var i = 0;i < files.length; i++) {
        let filename = path.join(startPath,files[i]);
        let stat = fs.lstatSync(filename);
        if(stat.isDirectory()){
            fromDir(filename, filter);
        }else if (filename.indexOf(filter)>=0){
            console.log('--found:', filename)
        }
    }
}

fs.readFile('./test-page.html', 'utf-8', (err, html) => {
    if(err) {
        throw err;
    }

    const dom = new JSDOM(html).window.document;
    const imgs = dom.getElementsByTagName('img');
    for(let img of imgs) {
        let picture = dom.createElement('picture');
        picture.classList = img.classList;
        picture.innerHTML = `
            <source srcset="${img.src.slice(0,-3)}.webp" type="image/webp">
            <source srcset="${img.src}" type="image/${img.src.substr(img.src.length - 3)}">
            <img src="${img.src}" alt="${img.alt}">
        `;
        img.replaceWith(img, picture);
        console.log(imgs);
    };
    console.log(imgs);
});