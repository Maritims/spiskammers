function formatMilliseconds(ms) {
    if (ms === 0) return '0 ms';

    const units = [
        {label: 'day', ms: 86400000},
        {label: 'hour', ms: 3600000},
        {label: 'minute', ms: 60000},
        {label: 'second', ms: 1000},
        {label: 'ms', ms: 1}
    ];

    let remaining = ms;
    const parts = [];

    for (const unit of units) {
        if (remaining >= unit.ms || (unit.label === 'ms' && parts.length === 0)) {
            const count = Math.floor(remaining / unit.ms);
            if (count > 0 || (unit.label === 'ms' && parts.length === 0)) {
                // Skip plural 's' for 'ms' unit
                const suffix = unit.label === 'ms' || count === 1 ? '' : 's';
                parts.push(`${count} ${unit.label}${suffix}`);
                remaining %= unit.ms;
            }
        }
    }

    return parts.join(', ') + '.';
}

/**
 * Creates a summary element for a test suite result.
 * @param {TestSuiteResult} testSuiteResult - The test suite result.
 * @return {HTMLDivElement} The created summary element.
 */
function createTestSuiteSummary(testSuiteResult) {
    const summaryEl = document.createElement('details');
    summaryEl.classList.add('test-suite-summary');

    const duration = formatMilliseconds(testSuiteResult.elapsedMs);
    const passedCount = testSuiteResult.results.filter(testCaseResult => testCaseResult.passed).length;
    const failedCount = testSuiteResult.results.length - passedCount;
    const totalCount = testSuiteResult.results.length;
    const allPassed = testSuiteResult.results.every(testCaseResult => testCaseResult.passed);
    summaryEl.open = true;
    summaryEl.innerHTML = `
        <summary>
            <h2>
                Test Suite: ${testSuiteResult.name}
                <span class="${allPassed ? 'passed' : 'failed'}">${allPassed ? `[${passedCount}/${totalCount} PASSED]` : `[${failedCount}/${totalCount} FAILED]`}</span>
            </h2>
        </summary>
        
        <strong>Time:</strong>
        <time datetime="${duration}">${duration}</time>
        
        <table>
            <thead>
                <tr>
                    <th class="test-case">Test Case</th>
                    <th class="result">Result</th>
                    <th class="duration">Time</th>
                </tr>
            </thead>
            <tbody>
            ${testSuiteResult.results.map(testCaseResult => `
                <tr>
                    <td>${testCaseResult.name}</td>
                    <td>
                        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem">
                            <div class="${testCaseResult.passed ? 'passed' : 'failed'}">
                                <strong>${testCaseResult.passed ? 'PASSED' : 'FAILED'}</strong>
                            </div>
                            ${testCaseResult.passed ? '' : `
                                <div style="display: grid; grid-template-columns: 1fr">
                                    <div>
                                        <strong>Expected:</strong> ${testCaseResult.error.expected}
                                    </div>
                                    <div>
                                        <strong>Actual:</strong> ${testCaseResult.error.actual}                                
                                    </div>
                                    <div>
                                        <strong>Message:</strong> ${testCaseResult.error.messageSupplier()}
                                    </div>
                                </div>
                            `}
                        </div>
                    </td>
                    <td>${formatMilliseconds(testCaseResult.elapsedMs)}</td>
                </tr>
            `).join('')}
            </tbody>
        </table>
    `;

    return summaryEl;
}

/**
 * Renders the test results in the UI.
 * @param {TestSuiteResults} testSuiteResults
 */
export function renderTestResults(testSuiteResults) {
    const resultsEl = document.getElementById('results');

    testSuiteResults.results
        .filter(testSuiteResult => testSuiteResult.results.length > 0)
        .forEach(testSuiteResult => {
            const summaryEl = createTestSuiteSummary(testSuiteResult);
            resultsEl.appendChild(summaryEl);
        });
}