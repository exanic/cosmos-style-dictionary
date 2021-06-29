const StyleDictionaryPackage = require('style-dictionary');

// CONFIG
function getStyleDictionaryConfig() {
    return {
        "source": [
            "01_Global/*.json",
            "02_Theme/*.json",
            "02_Typography/*.json"
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
// Output Format
StyleDictionaryPackage.registerFormat({
    name: 'json/figma',
    formatter: function ({ dictionary, platform, options, file }) {
        return JSON.stringify(dictionary.tokens, null, 2);
    }
});

// REGISTER CUSTOM TRANSFORMS
// Manipulate Single Values
StyleDictionaryPackage.registerTransform({
    type: 'value',
    transitive: false,
    name: 'FigmaValue',
    matcher: (token) => {
        return token.value != "";
    },
    transformer: (token) => {
        // token.value will be resolved and transformed at this point
        try {
            return "crazy-" + token.value;
        } catch {
            return "";
        }
    }
})

StyleDictionaryPackage.registerTransform({
    type: 'name',
    transitive: false,
    name: 'FigmaName',
    matcher: (token) => {
        return token.value != "";
    },
    transformer: (token) => {
        // token.value will be resolved and transformed at this point
        try {
            return "woho-" + token.name;
        } catch {
            return "";
        }
    }
})

// Grouping of Transforms
StyleDictionaryPackage.registerTransformGroup({
    name: 'tokens-json-figma',
    transforms: ["attribute/cti", "name/cti/kebab", "size/px", "color/css", "FigmaValue", "FigmaName" ]
});


// START BUILD
console.log('Build started...');
console.log('\n==============================================');

const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig());

StyleDictionary.buildPlatform('json');
StyleDictionary.buildPlatform('scss');

console.log('\n==============================================');
console.log('\nBuild completed!');