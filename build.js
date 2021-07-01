const StyleDictionaryPackage = require('style-dictionary');
const { toFigmaDictionary } = require('./helpers');

// CONFIG
function getStyleDictionaryConfig() {
    return {
        "source": [
            "01_Global/*.json",
            "02_Theme/light/*.json",
            "03_Component/*.json"
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
                "transformGroup": "tokens-json-figma",
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

// Figma Output Format
StyleDictionaryPackage.registerFormat({
    name: 'json/figma',
    formatter: function ({ dictionary, platform, options, file }) {
        return JSON.stringify(toFigmaDictionary(dictionary.tokens), null, 2);
    }
});

// REGISTER CUSTOM TRANSFORMS

// Replace Font to Roboto for Figma
StyleDictionaryPackage.registerTransform({
    type: 'value',
    transitive: false,
    name: 'FigmaFontFix',
    matcher: (token) => {
        return token.name == "font-families-font-roboto";
    },
    transformer: (token) => {
        return "Roboto";
    }
})

// REGISTER CUSTOM TRANSFORMS GROUPS

// Grouping of Transforms
StyleDictionaryPackage.registerTransformGroup({
    name: 'tokens-json-figma',
    transforms: ["attribute/cti", "color/rgb", "name/cti/kebab", "FigmaFontFix"]
});


// START BUILD
console.log('Build started...');
console.log('\n==============================================');

const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig());

StyleDictionary.buildPlatform('scss');
StyleDictionary.buildPlatform('json');

console.log('\n==============================================');
console.log('\nBuild completed!');