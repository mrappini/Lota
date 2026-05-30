const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'public', 'icon.svg');
const out192 = path.join(__dirname, 'public', 'icon-192.png');
const out512 = path.join(__dirname, 'public', 'icon-512.png');

async function convert() {
  try {
    console.log('Generating 192x192...');
    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(out192);
      
    console.log('Generating 512x512...');
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(out512);
      
    console.log('Done!');
  } catch(e) {
    console.error(e);
  }
}

convert();
