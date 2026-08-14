/**
 * @typedef {Object} ArgumentMatcher
 * @property {'boolean' | 'number' | 'string'} type - The type of value to match.
 * @property {(val: any) => boolean} match - The function to check if the value matches.
 */

/** @type {ArgumentMatcher[]} */
const argumentMatcherStack = [];

/**
 * Matches any boolean value.
 * @returns {boolean} A placeholder boolean to satisfy JavaScript execution.
 */
export function anyBoolean() {
    argumentMatcherStack.push({
        type: 'boolean',
        match: (val) => typeof val === 'boolean'
    });
    return false;
}

/**
 * Matches any number value.
 * @return {number} A placeholder number to satisfy JavaScript execution.
 */
export function anyNumber() {
    argumentMatcherStack.push({
        type: 'number',
        match: (val) => typeof val === 'number'
    });
    return 0;
}

/**
 * Matches any string value.
 * @returns {string} A placeholder string to satisfy JavaScript execution.
 */
export function anyString() {
    argumentMatcherStack.push({
        type: 'string',
        match: (val) => typeof val === 'string'
    });
    return '';
}