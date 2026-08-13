/**
 * @callback ConditionFunction - A function that returns a boolean indicating whether the condition is met.
 * @return {boolean} - Returns true if the condition is met, otherwise false.
 */

/**
 * @callback AssertFunction
 * @param {ConditionFunction} conditionFn - The condition to assert.
 * @param {string} description - The description of the assertion.
 */

/**
 * @callback TestFunction
 * @param {HTMLElement} sandbox - The function that performs the assertion.
 * @param {AssertFunction} assert - The function that asserts a condition.
 */

const testRegistry = [];

/**
 * Execute a test function within an isolated sandbox and collects assertion results.
 * @param {string} name - The name of the test.
 * @param {TestFunction} fn - The test function.
 * @return {Promise<{name: string, passed: boolean, assertions: {description: string, passed: boolean, error?: string}[], setupError?: string}>}
 */
export async function test(name, fn) {
    testRegistry.push({name, fn});
}

export function renderResults(results, containerId = 'test-results') {
    const resultsContainer = document.getElementById(containerId);
    if (!resultsContainer) {
        throw new Error(`Container with ID '${containerId}' not found`);
    }

    resultsContainer.innerHTML = '';

    results.forEach(test => {
        const testBlock = document.createElement('div');
        testBlock.className = `test-block ${test.passed ? 'block-pass' : 'block-fail'}`;

        const testTitle = document.createElement('div');
        testTitle.className = 'test-title';
        testTitle.textContent = test.name;
        testBlock.appendChild(testTitle);

        const casesList = document.createElement('ul');
        casesList.className = 'test-cases-list';

        if (test.setupError) {
            const li = document.createElement('li');
            li.className = 'case-fail';
            li.textContent = `✖ Setup/Execution Error: ${test.setupError}`;
            casesList.appendChild(li);
        } else {
            test.assertions.forEach(assertion => {
                const li = document.createElement('li');
                li.className = assertion.passed ? 'case-pass' : 'case-fail';
                li.textContent = assertion.passed ? `✔ ${assertion.description}` : `✖ ${assertion.description} - ${assertion.error}`;
                casesList.appendChild(li);
            });
        }

        testBlock.appendChild(casesList);
        resultsContainer.appendChild(testBlock);
    })
}

export async function runTests() {
    console.log(`Running ${testRegistry.length} tests...`);

    const results = [];

    for(const testDefinition of testRegistry) {
        const sandbox = document.createElement('div');
        document.body.appendChild(sandbox);

        const assertions = [];
        let setupError = null;

        /**
         * Asserts a condition.
         * @param {string} description - The description of the assertion.
         * @param {ConditionFunction} conditionFn - The condition to assert.
         */
        const assert = (description, conditionFn) => {
            try {
                const passed = typeof conditionFn === 'function' ? conditionFn() : conditionFn;
                if (!passed) {
                    throw new Error(`Assertion failed`);
                }
                assertions.push({description, passed: true});
            } catch (error) {
                assertions.push({description, passed: false, error: error.message});
            }
        }

        try {
            await testDefinition.fn(sandbox, assert);
        } catch (error) {
            setupError = error.message;
            console.error(error);
        } finally {
            sandbox.remove();
        }

        const allPassed = !setupError && assertions.every(assertion => assertion.passed);

        results.push({
            name: testDefinition.name,
            passed: allPassed,
            assertions,
            setupError
        });

        renderResults(results);
    }
}