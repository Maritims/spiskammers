/**
 * @callback TestFunction
 * @param {HTMLElement} sandbox - The sandbox element to use for testing.
 * @return {void}
 */

export class TestCase {
    /**
     * Creates a new TestFunction instance.
     * @param {string} name - The name of the test function.
     * @param {TestFunction} testFn - The test function.
     */
    constructor(name, testFn) {
        this._name = name;
        this._testFn = testFn;
    }

    get name() {
        return this._name;
    }

    get testFn() {
        return this._testFn;
    }
}

export class TestSuite {
    /**
     * Creates a new TestSuite instance.
     * @param {string} name - The name of the test suite.
     */
    constructor(name) {
        this.name = name;
        /** @type {TestCase[]} */
        this.testCases = [];
    }

    /**
     * Adds a test case to the test suite.
     * @param {TestCase} testCase
     */
    add(testCase) {
        this.testCases.push(testCase);
    }
}

/**
 * A list of registered test suites.
 * @type {Object.<string, TestSuite>}
 */
const testSuites = {
    'default': new TestSuite('default')
};

/**
 * The current active test suite for scoping.
 * @type {TestSuite | null}
 */
let currentSuite = null;

/**
 * Registers a test function. If a test suite is active, it will be added to the current suite; otherwise, it will be added to the default suite.
 * @param {string} name - The name of the test.
 * @param {() => void} testFn - The test function.
 */
export function test(name, testFn) {
    const targetSuite = currentSuite || testSuites['default'];
    const testCase = new TestCase(name, testFn);
    targetSuite.add(testCase);
}

/**
 * Registers a test suite.
 * @param {string} name - The name of the test suite.
 * @param {() => void} fn - A function containing the suite's tests.
 * @return {TestSuite} The created test suite.
 */
export function describe(name, fn) {
    const previousSuite = currentSuite;
    const newSuite = new TestSuite(name);

    testSuites[name] = newSuite;
    currentSuite = newSuite;

    try {
        // Execute the function containing the suite's tests to populate the suite.
        fn();
    } finally {
        // Reset the current suite to the previous one, otherwise we'll get stuck.
        currentSuite = previousSuite;
    }

    return newSuite;
}

/**
 * Returns a safe, cloned copy of the test suites registry.
 * @return {Object.<string, TestSuite>}
 */
export function getTestSuites() {
    const copy = {};
    for (const [key, suite] of Object.entries(testSuites)) {
        copy[key] = {
            name: suite.name,
            testCases: [...suite.testCases]
        };
    }
    return copy;
}