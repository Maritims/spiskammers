/**
 * @typedef {Object} TestCaseResult
 * @property {string} name - The name of the runner.
 * @property {boolean} passed - Whether the runner passed.
 * @property {AssertionError} [error] - The error object if the test failed.
 * @property {number} elapsedMs - The elapsed time in milliseconds.
 */

/**
 * @typedef {Object} TestSuiteResult
 * @property {string} name - The name of the test suite.
 * @property {TestCaseResult[]} results - The list of test results.
 * @property {number} elapsedMs - The elapsed time in milliseconds.
 */

/**
 * @typedef {Object} TestSuiteResults
 * @property {TestSuiteResult[]} results - The list of test suite results.
 * @property {number} elapsedMs - The elapsed time in milliseconds.
 */

import {getTestSuites, TestCase, TestSuite} from "./testSuite";
import {AssertionError, VerificationError, VerifyEventError} from "./asserts";

/**
 * Runs a test case and returns the result.
 * @param {TestCase} testCase - The test case to run.
 * @return {Promise<TestCaseResult>} The test result.
 */
async function runTestCase(testCase) {
    const startMs = performance.now();
    let passed = true;
    /** @type {AssertionError | Error | null} */
    let error;
    /** @type {Error | null} */
    let unexpectedError;

    const sandbox = document.createElement('div');
    document.body.appendChild(sandbox);

    /**
     * Global error handler to catch any errors thrown during the test occurring outside the test function like in an event listener.
     * @param {ErrorEvent} errorEvent - The error event.
     */
    const errorHandler = (errorEvent) => {
        errorEvent.preventDefault();
        passed = false;
        if (!unexpectedError) {
            unexpectedError = errorEvent.error || new Error(errorEvent.message);
        }
    };

    /**
     * Global promise rejection handler to catch any promise rejections that occur during the test.
     * @param {PromiseRejectionEvent} promiseRejectionEvent - The promise rejection event.
     */
    const rejectionHandler = (promiseRejectionEvent) => {
        promiseRejectionEvent.preventDefault();
        passed = false;
        if (!unexpectedError) {
            unexpectedError = promiseRejectionEvent.reason instanceof Error ? promiseRejectionEvent.reason : new Error(promiseRejectionEvent.reason);
        }
    }

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    try {
        await testCase.testFn(sandbox);
    }
    /** @type {AssertionError} */
    catch (e) {
        passed = false;
        if (e instanceof AssertionError || e instanceof VerificationError) {
            console.log(e);
            error = e;
        } else {
            unexpectedError = unexpectedError || e;
        }
    } finally {
        window.removeEventListener('error', errorHandler);
        window.removeEventListener('unhandledrejection', rejectionHandler);
        sandbox.remove();
    }

    if (unexpectedError && !error) {
        passed = false;
        error = new AssertionError(undefined, undefined, () => `Unexpected error occurred: `, unexpectedError);
    } else if (unexpectedError && error) {
        passed = false;
        error = new AssertionError(
            error.expected,
            error.actual,
            error.messageSupplier,
            unexpectedError
        );
    }

    return {
        name: testCase.name,
        passed: passed,
        error: error,
        elapsedMs: performance.now() - startMs
    };
}

/**
 * Runs a test suite and returns the result.
 * @param {TestSuite} testSuite - The test suite to run.
 * @return {Promise<TestSuiteResult>} The test suite result.
 */
async function runTestSuite(testSuite) {
    const startMs = performance.now();

    /** @type {TestCaseResult[]} */
    const testResults = [];

    for (const testCase of testSuite.testCases) {
        const testCaseResult = await runTestCase(testCase);
        testResults.push(testCaseResult);
    }

    return {
        name: testSuite.name,
        results: testResults,
        elapsedMs: performance.now() - startMs
    };
}

/**
 * Runs all registered tests and returns the results.
 * @return {Promise<TestSuiteResults>} The test suite results.
 */
export async function runTestSuites() {
    const startMs = performance.now();
    const testSuites = getTestSuites();
    /** @type {TestSuiteResult[]} */
    const testSuiteResults = [];

    for (const suite of Object.values(testSuites)) {
        const testSuiteResult = await runTestSuite(suite);
        testSuiteResults.push(testSuiteResult);
    }

    return {
        results: testSuiteResults,
        elapsedMs: performance.now() - startMs
    };
}