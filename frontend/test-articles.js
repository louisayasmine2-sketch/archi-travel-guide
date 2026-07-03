const fs = require('fs');
const code = fs.readFileSync('src/data/articles.js', 'utf8')
  .replace('sections.reduce((n, s) => n + (s.body?.length || 0), 0)', '(Array.isArray(sections) ? sections.reduce((n, s) => n + (s.body?.length || 0), 0) : (console.log("BAD ARTICLE:", slug, sections), 0))');
const babel = require('@babel/core');
const transpiled = babel.transformSync(code, { presets: ['@babel/preset-env'] }).code;
eval(transpiled);
