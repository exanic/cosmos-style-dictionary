const StyleDictionary = require('style-dictionary').extend({
    source: [
        "01_Global/*.json",
        "02_Theme/*.json"
    ],
    platforms: {
        scss: {
            transformGroup: 'scss',
            buildPath: 'build/scss/material-design/',
            files: [{
                destination: '_variables.scss',
                format: 'scss/variables'
            }]
        }
        // ...
    }
});

StyleDictionary.buildAllPlatforms();