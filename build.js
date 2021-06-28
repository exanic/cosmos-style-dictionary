const StyleDictionaryPackage = require('style-dictionary');

// CONFIG
function getStyleDictionaryConfig() {
    return {
        "source": [
            "01_Global/*.json",
            "02_Theme/*.json"
        ],
        "platforms": {
            "scss": {
                "transformGroup": "scss",
                "buildPath": "build/scss/material-design/",
                "files": [
                    {
                        "destination": "_variables.scss",
                        "format": "scss/variables"
                    }
                ]
            },
            "json": {
                "transformGroup": "tokens-json",
                "buildPath": "build/json/figma/",
                "files": [
                    {
                        "destination": "tokens.json",
                        "format": "json/figma"
                    }
                ]
            }
        }
    };
}

// REGISTER CUSTOM FORMATS
StyleDictionaryPackage.registerFormat({
    name: 'json/figma',
    formatter: function ({ dictionary, platform, options, file }) {
        return JSON.stringify(dictionary.tokens, null, 2);
    }
});

// REGISTER CUSTOM TRANSFORMS
StyleDictionaryPackage.registerTransformGroup({
    name: 'tokens-json',
    transforms: ["attribute/cti", "name/cti/kebab", "size/px", "color/css"]
});


// START BUILD
console.log('Build started...');
console.log('\n==============================================');

const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig());

StyleDictionary.buildPlatform('json');
StyleDictionary.buildPlatform('scss');

console.log('\n==============================================');
console.log('\nBuild completed!');