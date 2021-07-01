const StyleDictionaryPackage = require('style-dictionary');
const { toFigmaDictionary } = require('./helpers');

// CONFIG
function getStyleDictionaryConfig(theme, includeFile, outputFile) {
    return {
        "source": [
            "01_Global/*.json",
            `02_Theme/${theme}/*.json`,
            "03_Component/*.json",
            includeFile
        ],
        "platforms": {
            "web/material": {
                "transformGroup": "scss-material",
                "buildPath": `build/scss/material-design/${theme}/`,
                "files": [
                    {
                        "destination": outputFile,
                        "format": "scss/variables"
                    }
                ]
            },
            "json/figma": {
                "transformGroup": "json-figma",
                "buildPath": "build/json/figma/",
                "files": [
                    {
                        "destination": outputFile,
                        "format": "json/figma",
                        "filter": { "filePath": includeFile }
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
    transitive: true,
    name: 'FigmaFontFix',
    matcher: (token) => {
        return token.name == 'font-families-font-roboto';
    },
    transformer: (token) => {
        return 'Roboto';
    }
});

StyleDictionaryPackage.registerTransform({
    type: 'value',
    transitive: true,
    name: 'FigmaPxToNone',
    matcher: (token) => {
        return token.attributes.category === 'size';
    },
    transformer: (token) => {
        if (token.value.endsWith('px'))
            return parseFloat(token.value.replace('px', ''));
        else
            return token.value;
    }
});

StyleDictionaryPackage.registerTransform({
    type: 'value',
    transitive: true,
    name: 'FigmaFontWeightToName',
    matcher: (token) => {
        return token.attributes.category === 'font';
    },
    transformer: (token) => {
        if (token.value == '300')
            return 'Light';
        else if (token.value == '400')
            return 'Regular';
        else if (token.value == '600')
            return 'Medium';
        else if (token.value == '700')
            return 'Bold';
        else
            return token.value;
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
        'attribute/cti',
        'name/cti/kebab',
        'FigmaFontFix',
        'FigmaPxToNone',
        'FigmaFontWeightToName'
    ]
});

// START BUILD
console.log('Build started...');
console.log('\n==============================================');

// Material Var Files
['light', 'dark'].map(function (theme) {
    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, '04_Framework/Material-Design/*.json', '_variables.scss'));
    StyleDictionary.buildPlatform("web/material");
});

// Figma
['global_tokens.json', 'theme_tokens.json'].map(function (file) {
    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig('light', `04_Framework/Figma/${file}`, file));
    StyleDictionary.buildPlatform("json/figma");
});

console.log('\n==============================================');
console.log('\nBuild completed!');