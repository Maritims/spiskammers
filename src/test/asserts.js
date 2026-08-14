/**
 * Represents an assertion failure.
 * @extends Error
 */
export class AssertionError extends Error {
    /**
     * Creates an AssertionError.
     * @param {any} expected - The expected value.
     * @param {any} actual - The actual value.
     * @param {() => string} messageSupplier - A function that returns a message describing the assertion failure.
     */
    constructor(expected, actual, messageSupplier) {
        super(`Expected ${expected} (${typeof expected}), but got ${actual} (${typeof actual}): ${messageSupplier()}`);
        this.expected = expected;
        this.actual = actual;
        this.messageSupplier = messageSupplier;
    }
}

/**
 * Asserts that the given value is false.
 * @param {boolean} actual - The expected value.
 * @param {() => string} messageSupplier - A function that returns a message describing the assertion failure.
 */
export function assertTrue(actual, messageSupplier) {
    if (typeof actual !== 'boolean') {
        throw new AssertionError(true, actual, () => `Expected boolean, but got ${typeof actual}`);
    }
    if (actual !== true) {
        throw new AssertionError(true, actual, messageSupplier);
    }
}

/**
 * Asserts that the given value is true.
 * @param {boolean} actual - The expected value.
 * @param {() => string} messageSupplier - A function that returns a message describing the assertion failure.
 * @throws {AssertionError} If the assertion fails.
 */
export function assertFalse(actual, messageSupplier) {
    if (actual !== false) {
        throw new AssertionError(false, actual, messageSupplier);
    }
}

/**
 * Asserts that two values are equal.
 * @param {any} expected - The expected value.
 * @param {any} actual - The actual value.
 * @param {() => string} messageSupplier - A function that returns a message describing the assertion failure.
 * @throws {AssertionError} If the assertion fails.
 */
export function assertEquals(expected, actual, messageSupplier) {
    if (messageSupplier == null) {
        throw new Error("messageSupplier cannot be null");
    }
    if (expected !== actual) {
        throw new AssertionError(expected, actual, messageSupplier);
    }
}

/**
 * Asserts that the given value is null.
 * @param {any} expected - The expected value.
 * @param {() => string} messageSupplier - A function that returns a message describing the assertion failure.
 * @throws {AssertionError} If the assertion fails.
 */
export function assertNull(expected, messageSupplier) {
    if (expected !== null) {
        throw new AssertionError(null, expected, messageSupplier);
    }
}

/**
 * Asserts that the given value is not null or undefined.
 * @param {any} actual - The value to check.
 * @param {() => string} messageSupplier - A function that returns a message describing the assertion failure.
 * @throws {AssertionError} If the assertion fails.
 */
export function assertNotNull(actual, messageSupplier) {
    if (actual === null || actual === undefined) {
        throw new AssertionError(null, actual, messageSupplier);
    }
}