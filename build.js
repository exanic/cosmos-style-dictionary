const StyleDictionaryPackage = require('style-dictionary');
const { toFigmaDictionary } = require('./helpers');

// CONFIG
function getStyleDictionaryConfig(theme, includeFiles) {
    return {
        "source": [
            "01_Global/*.json",
            `02_Theme/${theme}/*.json`,
            "03_Component/*.json",
            includeFiles
        ],
        "platforms": {
            "web/material": {
                "transformGroup": "scss-material",
                "buildPath": `build/scss/material-design/${theme}/`,
                "files": [
                    {
                        "destination": "_variables.scss",
                        "format": "scss/variables"
                    }
                ]
            },
            "json/figma": {
                "transformGroup": "json-figma",
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
});


// REGISTER CUSTOM TRANSFORMS GROUPS

// SCSS Material
StyleDictionaryPackage.registerTransformGroup({
    name: 'scss-material',
    transforms: [
        'attribute/cti',
        'name/cti/kebab',
    ]
});

// Json / Figma
StyleDictionaryPackage.registerTransformGroup({
    name: 'json-figma',
    transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "FigmaFontFix"
    ]
});

// START BUILD
console.log('Build started...');
console.log('\n==============================================');

// Material Var Files
['light', 'dark'].map(function (theme) {
    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, '04_Framework/Material-Design/*.json'));
    StyleDictionary.buildPlatform("web/material");
})

// Figma
const StyleDictionaryFigma = StyleDictionaryPackage.extend(getStyleDictionaryConfig('light', '04_Framework/Figma/*.json'));
StyleDictionaryFigma.buildPlatform("json/figma");

console.log('\n==============================================');
console.log('\nBuild completed!');