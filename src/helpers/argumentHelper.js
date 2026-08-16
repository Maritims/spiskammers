/**
 * Checks if the given value is not null or undefined.
 * @param {any} value - The value to check.
 * @param {string} name - The name of the argument.
 * @return {any} The value if it is not null or undefined.
 * @throws {Error} If the value is null or undefined.
 */
export const requirePresent = (value, name) => {
    if (value === null || value === undefined) {
        throw new Error(`${name} cannot be null or undefined`);
    }
    return value;
};

/**
 * Checks if the given value is a positive number.
 * @param {any} value - The value to check.
 * @param {string} name - The name of the argument.
 * @return {number} The value if it is a positive number, otherwise throws an error.
 * @throws {Error} If the value is not a positive number.
 */
export const requirePositiveNumber = (value, name) => {
    if (value === null || value === undefined || typeof value !== 'number' || value <= 0) {
        throw new Error(`${name} must be a positive number`);
    }
    return value;
}

/**
 * Checks if the specified selector matches an element in the shadow DOM.
 * @param {ShadowRoot} shadowRoot
 * @param {string} selector
 * @return {HTMLElement} The matched element if found, otherwise throws an error.
 * @throws {Error} If the selector does not match any element in the shadow DOM.
 */
export const requireElementInShadowRoot = (shadowRoot, selector) => requirePresent(shadowRoot.querySelector(selector), `Element ${selector} not found in shadow DOM`);

/**
 * Checks if the given value is a non-empty string.
 * @param {any} value - The value to check.
 * @param {string} name - The name of the argument.
 * @return {string} The value if it is a non-empty string, otherwise throws an error.
 * @throws {Error} If the value is not a non-empty string.
 */
export const requireNonEmptyString = (value, name) => {
    if (value === null || value === undefined || typeof value !== 'string' || value.trim() === '') {
        throw new Error(`${name} must be a non-empty string`);
    }
    return value;
}

/**
 * Checks if the given value is a non-empty string.
 * @param {any} value - The value to check.
 * @param {string} name - The name of the argument.
 * @return {string|null|undefined} The value if it is a non-empty string, otherwise throws an error.
 */
export const requireNonEmptyOptionalString = (value, name) => {
    if (value !== null && value !== undefined && typeof value !== 'string' && value.trim() === '') {
        throw new Error(`${name} must be a non-empty string`);
    }
    return value;
}