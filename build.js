const StyleDictionaryPackage = require('style-dictionary');
const { fileHeader, toFigmaDictionary } = require('./helpers');

// CONFIG
function getStyleDictionaryConfig(theme, includeFile, outputFileName) {
    return {
        'source': [
            '01_Global/*.json',
            `02_Theme/${theme}/*.json`,
            '03_Component/*.json',
        ],
        'include': [
            includeFile
        ],
        'platforms': {
            'web/material/palette': {
                'transformGroup': 'scss-material-base',
                'buildPath': `build/scss/material-design/`,
                'files': [
                    {
                        'destination': `${outputFileName}.scss`,
                        'format': 'scss/map-deep-angular-color',
                        'filter': { 'filePath': includeFile },
                        'mapName': 'mat-color-palette'
                    }
                ]
            },
            'web/material/theme': {
                'transformGroup': 'scss-material-base',
                'buildPath': `build/scss/material-design/`,
                'files': [
                    {
                        'destination': `${outputFileName}.scss`,
                        'format': 'scss/variables',
                        'filter': { 'filePath': includeFile }
                    }
                ]
            },
            'web/material/tokens': {
                'transformGroup': 'scss-material-tokens',
                'buildPath': `build/scss/material-design/`,
                'files': [
                    {
                        'destination': `${outputFileName}.scss`,
                        'format': 'scss/variables'
                    }
                ]
            },
            'web/material/classes': {
                'transformGroup': 'scss-material-tokens',
                'buildPath': `build/scss/material-design/`,
                'files': [
                    {
                        'destination': `${outputFileName}.scss`,
                        'format': 'css/utility-classes'
                    }
                ]
            },
            'json/figma': {
                'transformGroup': 'json-figma',
                'buildPath': 'build/json/figma/',
                'files': [
                    {
                        'destination': `${outputFileName}.json`,
                        'format': 'json/figma',
                        'filter': { 'filePath': includeFile }
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

var utilities = [
    {
        'name': 'content_color',
        'tokenType': 'content',
        'classes': [
            {
                'className': 'content_color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'margin',
        'tokenType': 'size',
        'tokenSubType': 'spacing',
        'classes': [
            {
                'className': 'margin_top',
                'cssProperty': 'margin-top',
            },
            {
                'className': 'margin_right',
                'cssProperty': 'margin-right',
            },
            {
                'className': 'margin_bottom',
                'cssProperty': 'margin-bottom',
            },
            {
                'className': 'margin_left',
                'cssProperty': 'margin-left',
            }
        ]
    },
    {
        'name': 'padding',
        'tokenType': 'size',
        'tokenSubType': 'spacing',
        'classes': [
            {
                'className': 'padding_top',
                'cssProperty': 'padding-top',
            },
            {
                'className': 'padding_right',
                'cssProperty': 'padding-right',
            },
            {
                'className': 'padding_bottom',
                'cssProperty': 'padding-bottom',
            },
            {
                'className': 'padding_left',
                'cssProperty': 'padding-left',
            }
        ]
    },
];

StyleDictionaryPackage.registerFormat({
    name: 'css/utility-classes',
    formatter: function (dictionary, platform) {
        let output = '';
        dictionary.allProperties.forEach(function (prop) {
            var tokenType = prop.path.slice(0, 1)[0];
            var tokenSubType = prop.path.slice(1, 2)[0];

            utilities.forEach(function (utility) {
                if (tokenType === utility.tokenType) {

                    var tokenPropertyName = '';

                    if (utility.tokenSubType !== undefined) {
                        if (tokenSubType === utility.tokenSubType) {
                            tokenPropertyName = prop.path[2];
                        }
                    } else {
                        tokenPropertyName = prop.path[1];
                    }

                    if (tokenPropertyName !== '') {
                        utility.classes.forEach(function (outputClass) {
                            output += `.${outputClass.className}_${tokenPropertyName} { ${outputClass.cssProperty}: ${prop.value}; }\n`;
                        });
                    }
                }
            });
        });
        return output;
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

// Snake / Kebab Case for Tokens
StyleDictionaryPackage.registerTransform({
    type: 'name',
    transitive: true,
    name: 'name/cti/snake-kebab',
    matcher: (token) => {
        return true;
    },
    transformer: (token) => {
        return token.path.join('_');
    }
});

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
    name: 'scss-material-base',
    transforms: [
        'attribute/cti',
        'name/cti/kebab',
    ]
});

StyleDictionaryPackage.registerTransformGroup({
    name: 'scss-material-tokens',
    transforms: [
        'attribute/cti',
        'name/cti/snake-kebab',
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
['light', 'dark'].map(function (theme) {
    ['mat_color-palette'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig('light', `04_Framework/Material-Design/${file}.json`, `${theme}/_${file}`));
        StyleDictionary.buildPlatform('web/material/palette');
    });
    ['mat_theme-tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, `04_Framework/Material-Design/${file}.json`, `${theme}/_${file}`));
        StyleDictionary.buildPlatform('web/material/theme');
    });
    ['design_tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, `04_Framework/Material-Design/${file}.json`, `${theme}/_${file}`));
        StyleDictionary.buildPlatform('web/material/tokens');
    });
    ['design_tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, `04_Framework/Material-Design/${file}.json`, `${theme}/_design_classes`));
        StyleDictionary.buildPlatform('web/material/classes');
    });
});

// Figma
['global_tokens'].map(function (file) {
    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig('light', `04_Framework/Figma/${file}.json`, file));
    StyleDictionary.buildPlatform('json/figma');
});

['light', 'dark'].map(function (theme) {
    ['theme_tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, `04_Framework/Figma/${file}.json`, `${file}_${theme}`));
        StyleDictionary.buildPlatform('json/figma');
    });
});

console.log('\n==============================================');
console.log('\nBuild completed!');