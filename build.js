const StyleDictionaryPackage = require('style-dictionary');
const { fileHeader, toFigmaDictionary } = require('./helpers');

// CONFIG
function getStyleDictionaryConfig(theme, includeFile, outputFileName, outputReferences, category) {
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
                        'mapName': 'mat-color-palette',
                        'options':
                        {
                            'outputReferences': outputReferences
                        }
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
                        'filter': { 'filePath': includeFile },
                        'options':
                        {
                            'outputReferences': outputReferences
                        }
                    }
                ]
            },
            'web/material/tokens': {
                'transformGroup': 'scss-material-tokens',
                'buildPath': `build/scss/material-design/`,
                'files': [
                    {
                        'destination': `${outputFileName}.scss`,
                        'format': 'scss/variables',
                        'options':
                        {
                            'outputReferences': outputReferences
                        }
                    }
                ]
            },
            'web/material/classes': {
                'transformGroup': 'scss-material-tokens',
                'buildPath': `build/scss/material-design/`,
                'files': [
                    {
                        'destination': `${outputFileName}.scss`,
                        'format': 'css/utility-classes',
                        'options':
                        {
                            'outputReferences': outputReferences
                        }
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
                        'filter': { 'filePath': includeFile },
                        'options':
                        {
                            'outputReferences': outputReferences,
                            'category': category
                        }
                    }
                ],

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
        // Create Figma Tokens (only Value and Type)
        var figmaTokens = toFigmaDictionary(dictionary.tokens, options.outputReferences);

        // Remove Root Level, create Figma specific 'json' Format
        var figmaTransformed = '';

        //for (const [parentKey, parentValue] of Object.entries(dictionaryFigma)) {
        for (const [childKey, childValue] of Object.entries(figmaTokens)) {
            if (figmaTransformed !== '')
                figmaTransformed += ',';
            figmaTransformed += '"' + childKey.toString() + '": ';
            figmaTransformed += JSON.stringify(childValue, null, 2);
        }

        // Category
        var category = options.category;

        // Wrap json
        figmaTransformed = '{ "' + category + '": \n{\n' + figmaTransformed + '\n}\n}';

        return figmaTransformed;
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
        if (token.value.length > 0) {
            if (token.value.endsWith('px'))
                return parseFloat(token.value.replace('px', ''));
            else
                return token.value;
        }
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

// Helper Functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// START BUILD
console.log('\n==============================================\n');
console.log('Build started...');

// Angular Material
['light', 'dark'].map(function (theme) {
    ['mat_color-palette'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig('light', `04_Framework/Material-Design/${file}.json`, `${theme}/_${file}`, true));
        StyleDictionary.buildPlatform('web/material/palette');
    });
    ['mat_theme-tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, `04_Framework/Material-Design/${file}.json`, `${theme}/_${file}`, true));
        StyleDictionary.buildPlatform('web/material/theme');
    });
    ['design_tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, `04_Framework/Material-Design/${file}.json`, `${theme}/_${file}`, true));
        StyleDictionary.buildPlatform('web/material/tokens');
    });
    ['design_tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, `04_Framework/Material-Design/${file}.json`, `${theme}/_design_classes`, true));
        StyleDictionary.buildPlatform('web/material/classes');
    });
});

// Figma
['global_tokens'].map(function (file) {
    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig('light', `04_Framework/Figma/${file}.json`, file, false, 'Global'));
    StyleDictionary.buildPlatform('json/figma');
});

['light', 'dark'].map(function (theme) {
    ['theme_tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(theme, `04_Framework/Figma/${file}.json`, `${file}_${theme}`, true, capitalizeFirstLetter(theme)));
        StyleDictionary.buildPlatform('json/figma');
    });
});

['component_tokens'].map(function (file) {
    const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig('light', `04_Framework/Figma/${file}.json`, `${file}`, true, 'Component'));
    StyleDictionary.buildPlatform('json/figma');
});

console.log('\nStyle Dicionary Build completed!');
console.log('\n==============================================\n');

// Merge json Files
console.log('Figma Bundle started...');

const jsonConcat = require('json-concat');

// an array of filenames to concat
const figmaTokensFileName = 'tokens.json';
const figmaBuildDirectory = 'build/json/figma/'; // or whatever directory you want to read
const figmaBuildFiles = [
    figmaBuildDirectory + 'global_tokens.json',
    figmaBuildDirectory + 'theme_tokens_dark.json',
    figmaBuildDirectory + 'theme_tokens_light.json',
    figmaBuildDirectory + 'component_tokens.json',
];

// pass the "files" to json concat
jsonConcat({
    src: figmaBuildFiles,
    dest: figmaBuildDirectory + figmaTokensFileName
}, function () {
    console.log('Figma Bundle completed!');
    console.log('\n==============================================');
});