
// https://www.npmjs.com/package/fs-extra

module.exports = {

    copyAssets :{
        src: ['{{SRC}}/assets/**/*'],
        dest: '../DisplayObjects/mobile/assets'
    },
    copyIndexContent: {
        src: ['{{SRC}}/index.html'],
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
        src: ['{{ROOT}}/node_modules/ionicons/dist/fonts/*', '{{ROOT}}/node_modules/ionic-angular/fonts/*'],
        dest: '../DisplayObjects/mobile/assets/fonts'
    },
    copyFlashUpdate: {
        src: '../Flashupdate/index-fu.html',
        dest: '../DisplayObjects/mobile/'
    },
    copyManifest: {
        src: ['{{SRC}}/manifest.json'],
        dest: '../DisplayObjects/mobile/'
    },
    copySwToolbox:
        {
            src: '{{ROOT}}/node_modules/sw-toolbox/sw-toolbox.js',
            dest: '../DisplayObjects/mobile/build/'
        }

};
