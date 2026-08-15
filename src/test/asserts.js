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
     * @param {Error} [cause] - The underlying error that caused the assertion failure.
     */
    constructor(expected, actual, messageSupplier, cause) {
        super(`Expected ${expected} (${typeof expected}), but got ${actual} (${typeof actual}): ${messageSupplier()}`);
        this.expected = expected;
        this.actual = actual;
        this.messageSupplier = messageSupplier;
        this.cause = cause;
    }
}

export class VerificationError extends Error {
    /**
     * Creates a VerificationError.
     * @param {() => string} messageSupplier - A function that returns a message describing the verification failure.
     */
    constructor(messageSupplier) {
        super("Verification failed");
        this.messageSupplier = messageSupplier;
    }
}

/**
 * Represents an error related to verifying an event.
 * @extends VerificationError
 */
export class VerifyEventError extends VerificationError {
    /**
     * Creates a VerifyEventError.
     * @param {string} eventName - The name of the event that was expected.
     * @param {number} expectedInvocations - The number of times the event was expected to be dispatched.
     * @param {number} actualInvocations - The number of times the event was actually dispatched.
     * @param {() => string} [messageSupplier] - A function that returns a message describing the verification failure.
     */
    constructor(eventName, expectedInvocations, actualInvocations, messageSupplier) {
        super(messageSupplier);
        this.eventName = eventName;
        this.expectedInvocations = expectedInvocations;
        this.actualInvocations = actualInvocations;
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

/**
 * Executes an action and verifies that an event is dispatched on the target element.
 * @param {EventTarget} target - The element to listen on..
 * @param {string} eventName - The name of the event to listen for.
 * @param {() => void} action - The function that triggers the event.
 * @param {number} [timeoutMs=1000] Optional. The maximum time to wait for the event to be dispatched. Defaults to 1000ms.
 * @return {Promise<Event>} A promise that resolves with the dispatched event.
 */
export function verifyEvent(target, eventName, action, timeoutMs = 1000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            cleanup();
            reject(new VerifyEventError(eventName, 1, 0, () => 'The event did not occur within the specified timeout.'));
        }, timeoutMs);

        const eventListener = (event) => {
            cleanup();
            resolve(event);
        };

        function cleanup() {
            clearTimeout(timer);
            target.removeEventListener(eventName, eventListener);
        }

        target.addEventListener(eventName, eventListener);

        try {
            action();
        } catch (e) {
            cleanup();
            reject(e);
        }
    })
}