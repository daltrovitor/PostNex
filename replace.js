const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // String replacements
    content = content.replace(/PostFusion/g, 'PostNex');
    content = content.replace(/postfusion/g, 'postnex');

    // Logo replacements
    // Pattern 1: w-8 h-8
    content = content.replace(
        /<div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">\s*<Zap className="w-5 h-5 text-white" \/>\s*<\/div>/g,
        '<img src="/logo3.png" alt="PostNex Logo" className="w-8 h-8 rounded-lg" />'
    );
    // Pattern 2: w-10 h-10
    content = content.replace(
        /<div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">\s*<Zap className="w-6 h-6 text-white" \/>\s*<\/div>/g,
        '<img src="/logo3.png" alt="PostNex Logo" className="w-10 h-10 rounded-xl" />'
    );
    // Pattern 3: w-4 h-4 (footer)
    content = content.replace(
        /<div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center mb-4">\s*<Zap className="w-4 h-4 text-white" \/>\s*<\/div>/g,
        '<img src="/logo3.png" alt="PostNex Logo" className="w-8 h-8 rounded-lg mb-4" />'
    );
    // Generic Zap imports cleanup? We can just leave them or let eslint fix.

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated ' + file);
    }
});
