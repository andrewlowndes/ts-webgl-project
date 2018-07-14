const path = require('path'),
  fs = require('fs');

const root = path.resolve(__dirname, '../'),
  build = root + '/build/',
  dist = root + '/dist/';

function createDirLink(linkLocation, relativeTarget) {
  try {
    fs.symlinkSync(relativeTarget, linkLocation, 'dir');
  } catch (e) {}
}

createDirLink(build + 'node_modules', '../node_modules');
createDirLink(build + 'src', '../src');
createDirLink(build + 'config', '../config');
createDirLink(build + 'assets', '../assets');
createDirLink(dist + 'assets', '../assets');
