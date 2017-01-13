
// https://www.npmjs.com/package/fs-extra

module.exports = {

    copyAssets :{
      src: ['{{SRC}}/assets/**/*'],
      dest: '../DisplayObjects/mobile/assets'
    },
    copyIndexContent: {
      src: ['{{SRC}}/app.html'],
      dest: '../DisplayObjects/mobile/'
    },
    copyServiceWorker:{
      src: ['{{SRC}}/service-worker.js'],
      dest: '../DisplayObjects/mobile/'
    },
    copyPolyfills: {
      src: ['{{ROOT}}/node_modules/ionic-angular/polyfills/polyfills.js'],
      dest: '../DisplayObjects/mobile/build/'
    },
     copyFonts :{
      src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/**/*', '{{ROOT}}/node_modules/ionic-angular/fonts/**/*'],
      dest: '../DisplayObjects/mobile/assets/fonts'
    },
    copyFalshUpdate: {
      src: '../Flashupdate/index.html',
      dest: '../DisplayObjects/mobile/'
    }

};
