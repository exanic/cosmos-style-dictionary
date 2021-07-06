const StyleDictionaryPackage = require('style-dictionary');
const { fileHeader, toFigmaDictionary } = require('./helpers');

// CONFIG
function getStyleDictionaryConfig(theme, includeFile, outputFileName) {
    return {
        "source": [
            "01_Global/*.json",
            `02_Theme/${theme}/*.json`,
            "03_Component/*.json",
        ],
        "include": [
            includeFile
        ],
        "platforms": {
            "web/material/palette": {
                "transformGroup": "scss-material",
                "buildPath": `build/scss/material-design/`,
                "files": [
                    {
                        "destination": `${outputFileName}.scss`,
                        "format": "scss/map-deep-angular-color",
                        "filter": { "filePath": includeFile },
                        "mapName": "app-color-palette"
                    }
                ]
            },
            "web/material/theme": {
                "transformGroup": "scss-material",
                "buildPath": `build/scss/material-design/`,
                "files": [
                    {
                        "destination": `${outputFileName}.scss`,
                        "format": "scss/variables",
                        "filter": { "filePath": includeFile }
                    }
                ]
            },
            "json/figma": {
                "transformGroup": "json-figma",
                "buildPath": "build/json/figma/",
                "files": [
                    {
                        "destination": `${outputFileName}.json`,
                        "format": "json/figma",
                        "filter": { "filePath": includeFile }
                    }
                ]
            }
        }
    };
}

// REGISTER CUSTOM FORMATS

// Angular Material Color Palette Format
StyleDictionaryPackage.registerFormat({
    name: 'scss/map-deep-angular-color',
    formatter: function ({ dictionary, options, file }) {
        const fs = require('fs');
        const _template = require('lodash/template');
        const template = _template(fs.readFileSync(__dirname + '/templates/map-deep-angular-color.template'));
        return template({ dictionary, file, options, fileHeader });
    }
});


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

// Angular Material
['color-palette'].map(function (file) {
    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig('light', `04_Framework/Material-Design/${file}.json`, `_${file}`));
    StyleDictionary.buildPlatform("web/material/palette");
});

['light', 'dark'].map(function (theme) {
    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, '04_Framework/Material-Design/tokens.json', `${theme}/_tokens`));
    StyleDictionary.buildPlatform("web/material/theme");
});

// Figma
['global_tokens'].map(function (file) {
    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig('light', `04_Framework/Figma/${file}.json`, file));
    StyleDictionary.buildPlatform("json/figma");
});

['theme_tokens'].map(function (file) {
    ['light', 'dark'].map(function (theme) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, `04_Framework/Figma/${file}.json`, `${file}_${theme}`));
        StyleDictionary.buildPlatform("json/figma");
    });
});

console.log('\n==============================================');
console.log('\nBuild completed!');