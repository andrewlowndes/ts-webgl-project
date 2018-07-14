System.config({
  paths: {
    'npm:': 'node_modules/'
  },
  packages: {
    '.': {
      defaultExtension: 'js'
    }
  },
  map: {
    'gl-matrix': 'npm:gl-matrix/dist/gl-matrix.js',
    'apl-easy-gl': 'npm:apl-easy-gl/lib/index.js'
  }
});
