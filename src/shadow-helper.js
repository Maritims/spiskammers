/**
 * Throws an error if the specified selector does not match any element in the shadow DOM.
 * @param {ShadowRoot} shadowRoot - The shadow root to check.
 * @param {string} selector - The CSS selector to check.
 * @return {HTMLElement}
 */
export const throwIfMissing = (shadowRoot, selector) => {
    return shadowRoot.querySelector(selector) || (() => {
        throw new Error(`Element ${selector} not found in shadow DOM`);
    })();
}