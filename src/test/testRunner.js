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
import {AssertionError} from "./asserts";

/**
 * Runs a test case and returns the result.
 * @param {TestCase} testCase - The test case to run.
 * @return {TestCaseResult} The test result.
 */
function runTestCase(testCase) {
    const startMs = performance.now();
    let passed = true;
    /** @type {AssertionError} */
    let error;

    const sandbox = document.createElement('div');
    document.body.appendChild(sandbox);

    try {
        testCase.testFn(sandbox);
    } catch (e) {
        if (e instanceof AssertionError) {
            passed = false;
            error = e;
        }
    } finally {
        sandbox.remove();
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
 * @return {TestSuiteResult} The test suite result.
 */
function runTestSuite(testSuite) {
    const startMs = performance.now();
    console.group(`Running suite: ${testSuite.name}`);

    /** @type {TestCaseResult[]} */
    const testResults = [];

    for (const testCase of testSuite.testCases) {
        console.log(`Running test: ${testCase.name}`);
        testResults.push(runTestCase(testCase));
    }

    console.groupEnd();

    return {
        name: testSuite.name,
        results: testResults,
        elapsedMs: performance.now() - startMs
    };
}

/**
 * Runs all registered tests and returns the results.
 * @return {TestSuiteResults} The test suite results.
 */
export function runTestSuites() {
    const startMs = performance.now();
    const testSuites = getTestSuites();
    /** @type {TestSuiteResult[]} */
    const testSuiteResults = [];

    for (const suite of Object.values(testSuites)) {
        const testSuiteResult = runTestSuite(suite);
        testSuiteResults.push(testSuiteResult);
    }

    return {
        results: testSuiteResults,
        elapsedMs: performance.now() - startMs
    };
}