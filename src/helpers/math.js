/**
 * Multiplies two numbers precisely, avoiding JavaScript floating-point precision errors (e.g. 307 * 1.1 or 0.1 * 0.2).
 *
 * @param {number} a - The first number to multiply.
 * @param {number} b - The second number to multiply.
 * @returns {number} The precise product of the two numbers.
 */
export function multiplyPrecisely(a, b) {
    const getDecimals = (num) => {
        const str = num.toString();
        const index = str.indexOf('.');
        return index === -1 ? 0 : str.length - index - 1;
    };

    const decimalsA = getDecimals(a);
    const decimalsB = getDecimals(b);
    const totalDecimals = decimalsA + decimalsB;

    // Scale both numbers into integers to eliminate floating-point artifacts
    const integerA = Math.round(a * Math.pow(10, decimalsA));
    const integerB = Math.round(b * Math.pow(10, decimalsB));

    // Multiply the integers and scale back down
    return (integerA * integerB) / Math.pow(10, totalDecimals);
}