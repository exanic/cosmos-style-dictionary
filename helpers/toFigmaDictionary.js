/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

/**
 * Outputs an object stripping out everything except values
 * @memberof module:formatHelpers
 * @param {Object} obj - The object to minify. You will most likely pass `dictionary.tokens` to it.
 * @returns {Object}
 * @example
 * ```js
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   formatter: function({ dictionary }) {
 *     return JSON.stringify(minifyDictionary(dictionary.tokens));
 *   }
 * });
 * ```
 */

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function toFigmaDictionary(token, useReference) {
    if (typeof token !== 'object' || Array.isArray(token)) {
        return token;
    }

    var toRet = {};

    if (token.hasOwnProperty('value')) {

        var reference = '';
        if (useReference) {
            reference = token.original.value;
            if (typeof reference === 'string' && reference !== '') {
                reference = reference.replaceAll('\.value', '');
                reference = reference.replaceAll('\.', '-');
                reference = reference.replace('\-', '\.$');
            }
        }

        if (reference !== '')
            return new Object({ value: reference, type: token.type });
        else
            return new Object({ value: token.value, type: token.type });

    } else {

        for (var name in token) {
            if (token.hasOwnProperty(name)) {
                toRet[name] = toFigmaDictionary(token[name], useReference);
            }
        }

    }

    return toRet;
}

module.exports = toFigmaDictionary;