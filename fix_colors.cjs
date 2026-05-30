const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  ['-150', '-200'],
  ['-250', '-300'],
  ['-350', '-400'],
  ['-450', '-400'],
  ['-550', '-500'],
  ['-650', '-600'],
  ['-750', '-700'],
  ['-850', '-800']
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.replace(new RegExp(from, 'g'), to);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Fixed Tailwind colors in all TSX pages!');
