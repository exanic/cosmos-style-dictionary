const StyleDictionaryPackage = require('style-dictionary');
const { fileHeader, toFigmaDictionary } = require('./helpers');

// CONFIG
function getStyleDictionaryConfig(brand, theme, includeFile, outputFileName, outputReferences, category) {
    return {
        'source': [
            '01_Global/*.json',
            `02_Theme/${brand}/${theme}/*.json`,
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
            'web/material/typography': {
                'transformGroup': 'scss-material-tokens',
                'buildPath': `build/scss/material-design/`,
                'files': [
                    {
                        'destination': `${outputFileName}.scss`,
                        'format': 'scss/map-deep-angular-typography',
                        'filter': { 'filePath': includeFile },
                        'mapName': 'typography-palette',
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

StyleDictionaryPackage.registerFormat({
    name: 'scss/map-deep-angular-typography',
    formatter: function ({ dictionary, options, file }) {
        const fs = require('fs');
        const _template = require('lodash/template');
        const template = _template(fs.readFileSync(__dirname + '/templates/map-deep-angular-typography.template'));
        return template({ dictionary, file, options, fileHeader });
    }
});

var utilities = [
    {
        'name': 'static_primary_color',
        'tokenType': 'primary',
        'tokenSubType': 'color',
        'classes': [
            {
                'className': 'primary_color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'static_primary_text-color',
        'tokenType': 'primary',
        'tokenSubType': 'text-color',
        'classes': [
            {
                'className': 'primary_text-color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'static_primary_accent-color',
        'tokenType': 'primary-accent',
        'classes': [
            {
                'className': 'primary-accent',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'static_secondary_color',
        'tokenType': 'secondary',
        'tokenSubType': 'color',
        'classes': [
            {
                'className': 'secondary_color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'static_secondary_text-color',
        'tokenType': 'secondary',
        'tokenSubType': 'text-color',
        'classes': [
            {
                'className': 'secondary_text-color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'static_secondary_accent-color',
        'tokenType': 'secondary-accent',
        'classes': [
            {
                'className': 'secondary-accent',
                'cssProperty': 'color',
            }
        ]
    },


    {
        'name': 'semantic_danger_color',
        'tokenType': 'danger',
        'tokenSubType': 'color',
        'classes': [
            {
                'className': 'danger_color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'semantic_danger_text-color',
        'tokenType': 'danger',
        'tokenSubType': 'text-color',
        'classes': [
            {
                'className': 'danger_text-color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'semantic_info_color',
        'tokenType': 'info',
        'tokenSubType': 'color',
        'classes': [
            {
                'className': 'info_color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'semantic_info_text-color',
        'tokenType': 'info',
        'tokenSubType': 'text-color',
        'classes': [
            {
                'className': 'info_text-color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'semantic_warning_color',
        'tokenType': 'warning',
        'tokenSubType': 'color',
        'classes': [
            {
                'className': 'warning_color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'semantic_warning_text-color',
        'tokenType': 'warning',
        'tokenSubType': 'text-color',
        'classes': [
            {
                'className': 'warning_text-color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'semantic_success_color',
        'tokenType': 'success',
        'tokenSubType': 'color',
        'classes': [
            {
                'className': 'success_color',
                'cssProperty': 'color',
            }
        ]
    },
    {
        'name': 'semantic_success_text-color',
        'tokenType': 'success',
        'tokenSubType': 'text-color',
        'classes': [
            {
                'className': 'success_text-color',
                'cssProperty': 'color',
            }
        ]
    },

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

function toFigmaTransform(prefix, token) {

    var figmaTransformed = '';

    if (token.hasOwnProperty('value')) {

        figmaTransformed += `"${prefix}": ${JSON.stringify(token, null, 2)},`;

    } else {

        for (const [key, value] of Object.entries(token)) {
            var subPrefix = key;

            if (prefix !== '')
                subPrefix = `${prefix}_${subPrefix}`;

            figmaTransformed += toFigmaTransform(subPrefix, value);
        }

    }

    return figmaTransformed;
}

// Figma Output Format
StyleDictionaryPackage.registerFormat({
    name: 'json/figma',
    formatter: function ({ dictionary, platform, options, file }) {
        // Create Figma Tokens (only Value and Type)
        var figmaTokens = toFigmaDictionary(dictionary.tokens, options.outputReferences);

        // create Figma specific 'json' Format
        var figmaTransformed = toFigmaTransform('', figmaTokens);

        // letzten Separator entfernen
        if (figmaTransformed.slice(-1) === ',') {
            figmaTransformed = figmaTransformed.substring(0, figmaTransformed.length - 1);
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
const adminBrand = 'team-admin';
const bidderBrand = 'team-bidder';
const defaultBrand = adminBrand;

console.log('\n==============================================\n');
console.log('Build started...');

// ANGULAR MATERIAL

// Admin Theme
['light', 'dark'].map(function (theme) {
    ['typography-palette'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(adminBrand, theme, `04_Framework/Material-Design/team-admin/${file}.json`, `${adminBrand}/${theme}/_${file}`, false));
        StyleDictionary.buildPlatform('web/material/typography');
    });
    ['mat_color-palette'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(adminBrand, theme, `04_Framework/Material-Design/team-admin/${file}.json`, `${adminBrand}/${theme}/_${file}`, false));
        StyleDictionary.buildPlatform('web/material/palette');
    });
    ['mat_theme-tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(adminBrand, theme, `04_Framework/Material-Design/team-admin/${file}.json`, `${adminBrand}/${theme}/_${file}`, false));
        StyleDictionary.buildPlatform('web/material/theme');
    });
    ['design_tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(adminBrand, theme, `04_Framework/Material-Design/team-admin/${file}.json`, `${adminBrand}/${theme}/_${file}`, true));
        StyleDictionary.buildPlatform('web/material/tokens');
    });
    ['design_tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(adminBrand, theme, `04_Framework/Material-Design/team-admin/${file}.json`, `${adminBrand}/${theme}/_design_classes`, false));
        StyleDictionary.buildPlatform('web/material/classes');
    });
});

// Bidder Theme
['light'].map(function (theme) {
    ['typography-palette'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(adminBrand, theme, `04_Framework/Material-Design/team-admin/${file}.json`, `${adminBrand}/${theme}/_${file}`, false));
        StyleDictionary.buildPlatform('web/material/typography');
    });
    ['mat_color-palette'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(bidderBrand, theme, `04_Framework/Material-Design/team-bidder/${file}.json`, `${bidderBrand}/${theme}/_${file}`, false));
        StyleDictionary.buildPlatform('web/material/palette');
    });
    ['mat_theme-tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(bidderBrand, theme, `04_Framework/Material-Design/team-bidder/${file}.json`, `${bidderBrand}/${theme}/_${file}`, false));
        StyleDictionary.buildPlatform('web/material/theme');
    });
    ['design_tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(bidderBrand, theme, `04_Framework/Material-Design/team-bidder/${file}.json`, `${bidderBrand}/${theme}/_${file}`, true));
        StyleDictionary.buildPlatform('web/material/tokens');
    });
    ['design_tokens'].map(function (file) {
        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(bidderBrand, theme, `04_Framework/Material-Design/team-bidder/${file}.json`, `${bidderBrand}/${theme}/_design_classes`, false));
        StyleDictionary.buildPlatform('web/material/classes');
    });
});

// FIGMA
const fs = require('fs');
const dirPreBuild = 'pre-build';
const dirGlobal = '01_Global';
const dirTheme = '02_Theme';
const dirComponent = '03_Component';
const figmaTokensFileName = 'tokens.json';
const figmaBuildDirectory = 'build/json/figma';
const figmaPreBuildDirecotry = `${figmaBuildDirectory}/${dirPreBuild}`;

// Delete old Build Files
if (fs.existsSync(figmaPreBuildDirecotry)) {
    fs.readdirSync(figmaPreBuildDirecotry).forEach(file => {
        fs.unlink(`${figmaPreBuildDirecotry}/${file}`, err => {
            if (err) throw err;
        });
    });
}

// Global Tokens
fs.readdirSync(dirGlobal).forEach(file => {
    if (file.endsWith('.json')) {
        var fileName = file.replace('.json', '');

        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(defaultBrand, 'light', `${dirGlobal}/${file}`, `${dirPreBuild}/01_global_${fileName}`, false, 'Global'));
        StyleDictionary.buildPlatform('json/figma');
    }
});

// Admin Theme Tokens
['light', 'dark'].map(function (theme) {
    var dirThemeSub = `${dirTheme}/${adminBrand}/${theme}`;

    fs.readdirSync(dirThemeSub).forEach(file => {
        if (file.endsWith('.json')) {
            var fileName = file.replace('.json', '');

            const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(adminBrand, theme, `${dirThemeSub}/${file}`, `${dirPreBuild}/02_theme_${fileName}_${adminBrand}_${theme}`, true, `${adminBrand} ${capitalizeFirstLetter(theme)}`));
            StyleDictionary.buildPlatform('json/figma');
        }
    });
});

// Bidder Theme Tokens
['light'].map(function (theme) {
    var dirThemeSub = `${dirTheme}/${bidderBrand}/${theme}`;

    fs.readdirSync(dirThemeSub).forEach(file => {
        if (file.endsWith('.json')) {
            var fileName = file.replace('.json', '');

            const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(bidderBrand, theme, `${dirThemeSub}/${file}`, `${dirPreBuild}/02_theme_${fileName}_${bidderBrand}_${theme}`, true, `${bidderBrand} ${capitalizeFirstLetter(theme)}`));
            StyleDictionary.buildPlatform('json/figma');
        }
    });
});

// Component Tokens
fs.readdirSync(dirComponent).forEach(file => {
    if (file.endsWith('.json')) {
        var fileName = file.replace('.json', '');

        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(defaultBrand, 'light', `${dirComponent}/${file}`, `${dirPreBuild}/03_component_${fileName}`, true, 'Component'));
        StyleDictionary.buildPlatform('json/figma');
    }
});


console.log('\nStyle Dicionary Build completed!');
console.log('\n==============================================\n');

// Merge json Files
console.log('Figma Bundle started...');

var figmaBuildFiles = [];
fs.readdirSync(figmaPreBuildDirecotry).forEach(file => {
    figmaBuildFiles.push(`${figmaPreBuildDirecotry}/${file}`);
});

const jsonMerger = require("json-merger");
var result = jsonMerger.mergeFiles(figmaBuildFiles);

fs.writeFile(`${figmaBuildDirectory}/${figmaTokensFileName}`, JSON.stringify(result, null, ' '), (err) => {
    if (err) {
        throw err;
    }
    console.log('Figma Bundle completed!');
    console.log('\n==============================================');
});