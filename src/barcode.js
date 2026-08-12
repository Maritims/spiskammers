/**
 * EAN-13 Left-hand side odd parity (L-code) bit patterns for digits 0-9.
 * Each code is 7 modules wide and contains an odd number of black bars (1s).
 * @type {readonly string[]}
 */
const L_CODES = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];

/**
 * EAN-13 Left-hand side even parity (G-code) bit patterns for digits 0-9.
 * Each code is 7 modules wide and contains an even number of black bars (1s).
 * @type {readonly string[]}
 */
const G_CODES = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];

/**
 * EAN-13 Right-hand side bit patterns for digits 0-9.
 * Each code is 7 modules wide and serves as the inverse complement of L-codes.
 * @type {readonly string[]}
 */
const R_CODES = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];

/**
 * EAN-13 parity pattern mapping used to encode the hidden first digit based on
 * the combination of L-codes (L) and G-codes (G) across the first 6 digits.
 * @type {readonly string[]}
 */
const FIRST_DIGIT_PARITIES = [
    "LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG",
    "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"
];

/**
 * Converts RGB values to grayscale using the coefficients in the ITU-R BT.601 standard.
 * @param {number} r - The red component of the RGB color.
 * @param {number} g - The green component of the RGB color.
 * @param {number} b - The blue component of the RGB color.
 * @return {number} A number between 0 and 1 representing the grayscale value (also known as luminance).
 */
export function convertRgbToGrayscale(r, g, b) {
    if (r < 0 || r > 255) {
        throw new Error(`Invalid red value. Must be between 0 and 255, but was "${r}" (quotes added)`);
    }
    if (g < 0 || g > 255) {
        throw new Error(`Invalid green value. Must be between 0 and 255, but was "${g}" (quotes added)`);
    }
    if (b < 0 || b > 255) {
        throw new Error(`Invalid blue value. Must be between 0 and 255, but was "${b}" (quotes added)`);
    }
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

/**
 * Converts an image to a binarized version in which each pixel is either white (0) or black (1) using a naive threshold based on the average grayscale value.
 * @param {ImageDataArray} pixels - A flat, one-dimensional array of pixels stored using four consecutive values.
 * @param {number} width - The width of the image in pixels.
 * @return {Array<Number>} A binary array representing the binarized image. Each element is either 0 (white) or 1 (black).
 */
function binarizeRowNaively(pixels, width) {
    let sum = 0;
    for (let i = 0; i < width; i++) {
        const pixelIndex = i * 4;
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];
        const grayscale = convertRgbToGrayscale(r, g, b);
        sum += grayscale;
    }
    const threshold = sum / width;


    const binary = [];

    for (let i = 0; i < width; i++) {
        const pixelStartIndex = i * 4;
        const r = pixels[pixelStartIndex];
        const g = pixels[pixelStartIndex + 1];
        const b = pixels[pixelStartIndex + 2];
        const grayscale = convertRgbToGrayscale(r, g, b);
        binary.push(grayscale < threshold ? 1 : 0);
    }

    return binary;
}

/**
 * Binarizes a single row of pixels using local adaptive thresholding.
 * @param {Uint8ClampedArray} pixels - A flat, one-dimensional array of pixels stored using four consecutive values.
 * @param {number} width - The width of the image in pixels.
 * @param {object} [options] - Optional parameters.
 * @param {number} [options.windowSize=31] - The size of the sliding window used for adaptive thresholding.
 * @param {number} [options.contrastFactor=0.95] - The contrast factor used for adaptive thresholding.
 * @return {Array<0 | 1>} A binary array representing the binarized image. Each element is either 0 (white) or 1 (black).
 */
function binarizeRowAdaptive(pixels, width, options = {}) {
    const windowSize = options.windowSize || 31;
    const contrastFactor = options.contrastFactor || 0.95;

    const gray = new Uint8Array(width);
    for (let i = 0; i < width; i++) {
        const pixelIndex = i * 4;
        gray[i] = convertRgbToGrayscale(pixels[pixelIndex], pixels[pixelIndex + 1], pixels[pixelIndex + 2]);
    }

    // Build a prefix-sum array for fast O(1) range-sum calculations.
    // I don't think I've used this before, but the internet suggested it and it seemed like a good idea!
    const sum = new Float64Array(width);
    sum[0] = gray[0];
    for (let i = 1; i < width; i++) {
        sum[i] = sum[i - 1] + gray[i];
    }

    // Helper function to get the sum of pixel intensities between index l and r instantly.
    const getRangeSum = (l, r) => (l === 0 ? sum[r] : sum[r] - sum[l - 1]);
    const binary = [];
    const half = Math.floor(windowSize / 2);

    // Slide across each pixel to calculate its local adaptive threshold.
    for (let i = 0; i < width; i++) {
        // Define the bounds of the local window, clamping to the edges of the row.
        const l = Math.max(0, i - half);
        const r = Math.min(width - 1, i + half);
        const count = r - l + 1;

        // Compute the local average brightness of the window.
        const localAverage = getRangeSum(l, r) / count;

        // Binarize: if pixel is darker than the local average multiplied by the contrast factor, classify it as a black bar (1), otherwise white space (0).
        binary.push(gray[i] < (localAverage * contrastFactor) ? 1 : 0);
    }

    return binary;
}

/**
 * Performs Run-Length Encoding on the binarized image data row.
 * @param {Array<0 | 1>} binarizedRow - The binarized image data row.
 * @return {Array<{value: 0 | 1, length: number}>} An array of objects representing the encoded runs. Each object contains the value (0 or 1) and the length of the run.
 */
function calculateRuns(binarizedRow) {
    /**
     * @type {Array<{
     *     value: 0 | 1,
     *     length: number
     * }>}
     */
    const runs = [];
    let currentValue = binarizedRow[0];
    let currentLength = 1;

    for (let i = 1; i < binarizedRow.length; i++) {
        if (binarizedRow[i] === currentValue) {
            currentLength++;
        } else {
            runs.push({value: currentValue, length: currentLength});
            currentValue = binarizedRow[i];
            currentLength = 1;
        }
    }

    runs.push({value: currentValue, length: currentLength});

    return runs;
}

/**
 * Finds the start guard in the binarized image data row.
 * @param {Array<{value: 0 | 1, length: number}>} runs - The encoded runs in the row.
 * @return {{
 *     index: number,
 *     moduleWidth: number
 * }|null} An object containing the index of the start guard and the width of the module. If no start guard is found, returns null.
 */
function findStartGuard(runs) {
    for (let i = 1; i < runs.length - 2; i++) {
        const isStartGuardPattern = runs[i].value === 1 && runs[i + 1].value === 0 && runs[i + 2].value === 1;

        if (isStartGuardPattern) {
            const totalWidth = runs[i].length + runs[i + 1].length + runs[i + 2].length;
            const moduleWidth = totalWidth / 3;

            // Check if the preceding run is a white space (0) acting as a quiet zone.
            // A standard quiet zone should ideally be >= 7 modules wide, but we can accept >= 3 modules
            // to account for tight viewfinders or minor crop overlaps.
            const precedingRun = runs[i - 1];
            if (precedingRun.value === 0 && precedingRun.length >= (moduleWidth * 3)) {
                return {
                    index: i,
                    moduleWidth: moduleWidth
                };
            }
        }
    }

    return null;
}

/**
 * Parses the Run-Length Encoded data from the binarized image data row and returns a 13-digit string representing the GTIN-13 code.
 * @param {Array<{
 *     value: 0 | 1,
 *     length: number
 * }>} runs - The encoded runs in the row.
 * @param {number} startIndex - The index of the start guard in the row.
 * @param {number} moduleWidth - The width of the module in the row.
 * @return {string|null} A 13-digit string representing the GTIN-13 code, or null if the code cannot be parsed.
 */
function parseModules(runs, startIndex, moduleWidth) {
    if (!runs) {
        throw new Error("runs is required");
    }
    if (startIndex === undefined || startIndex === null) {
        throw new Error("startIndex is required");
    }
    if (!moduleWidth) {
        throw new Error("moduleWidth is required");
    }

    let runIndex = startIndex;

    /**
     * Consumes a specified number of modules from the runs array.
     * @param {number} numberOfModules - The number of modules to consume.
     * @return {string} The bit string representing the consumed modules.
     */
    function consumeModules(numberOfModules) {
        const targetWidth = numberOfModules * moduleWidth;
        let accumulated = 0;
        let bitString = '';

        while (runIndex < runs.length && accumulated < (targetWidth - moduleWidth * 0.5)) {
            const run = runs[runIndex];
            const count = Math.round(run.length / moduleWidth);
            bitString += run.value.toString().repeat(count);

            accumulated += run.length;
            runIndex++;
        }

        return bitString.substring(0, numberOfModules);
    }

    // Consume start guard (101 = 3 modules).
    const startGuard = consumeModules(3);
    if (startGuard !== '101') {
        // We've scanned something which isn't a barcode.
        return null;
    }

    // Consume left-hand-side (6 digits * 7 modules = 42 modules).
    const leftSideBits = [];
    for (let d = 0; d < 6; d++) {
        leftSideBits.push(consumeModules(7));
    }

    // Consume center guard (01010 = 5 modules).
    const centerGuard = consumeModules(5);
    if (centerGuard !== '01010') {
        // We've scanned something which isn't a barcode.
        return null;
    }

    // Consume right-hand side (6 digits * 7 modules = 42 modules).
    const rightSideDigits = [];
    for (let d = 0; d < 6; d++) {
        const code = consumeModules(7);
        let found = -1;
        for (let n = 0; n < 10; n++) {
            if (code === R_CODES[n]) {
                found = n;
                break;
            }
        }

        if (found === -1) {
            return null;
        }
        rightSideDigits.push(found);
    }

    // Decode left-hand parity and digits.
    let parityPattern = '';
    const leftSideDigitsEncoded = [];

    for (let d = 0; d < 6; d++) {
        const code = leftSideBits[d];
        let found = -1;
        let type = '';

        for (let n = 0; n < 10; n++) {
            if (code === L_CODES[n]) {
                found = n;
                type = 'L';
                break;
            }
            if (code === G_CODES[n]) {
                found = n;
                type = 'G';
            }
        }

        if (found === -1) {
            // We've scanned something, which isn't a barcode.
            return null;
        }
        leftSideDigitsEncoded.push(found);
        parityPattern += type;
    }

    let firstDigit = -1;
    for (let p = 0; p < FIRST_DIGIT_PARITIES.length; p++) {
        if (parityPattern === FIRST_DIGIT_PARITIES[p]) {
            firstDigit = p;
            break;
        }
    }
    if (firstDigit === -1) {
        // We've scanned something which isn't a barcode.
        return null;
    }

    return firstDigit.toString() + leftSideDigitsEncoded.join('') + rightSideDigits.join('');
}

/**
 * Validates the GTIN-13 check digit using the standard EAN-13 algorithm (even positions get weight 1, odd positions get weight 3).
 * @param {string} code - A 13-digit string returned by parseModules.
 * @return {boolean} True if the check digit is valid, false otherwise.
 */
function validateChecksum(code) {
    if (code.length !== 13) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(code[i], 10);
        sum += digit * (i % 2 === 0 ? 1 : 3);
    }

    const checksum = (10 - (sum % 10)) % 10;
    return checksum === parseInt(code[12], 10);
}

/**
 * Scans a barcode from a canvas context and returns the barcode string if found.
 * @param {CanvasRenderingContext2D} ctx - The context to read the barcode from.
 * @param {number} width - The width of the image containing the barcode.
 * @param {number} height - The height of the image containing the barcode.
 * @param {object} [options] - Optional parameters.
 * @param {function(Uint8ClampedArray, number, object): Array<0 | 1>} [options.binarizeFn=binarizeRowAdaptive] - A function to binarize the image data.
 * @return {null|string} The barcode string if found, null otherwise.
 */
export function scanBarcodeFromContext(ctx, width, height, options = {}) {
    if (!ctx) {
        throw new Error("ctx is required");
    }
    if (!width) {
        throw new Error("width is required");
    }
    if (!height) {
        throw new Error("height is required");
    }

    const binarizeFn = options.binarizeFn || binarizeRowAdaptive;

    const boxWidth = Math.floor(width * 0.8);
    const boxHeight = 120;
    const startX = Math.floor((width - boxWidth) / 2);
    const startY = Math.floor((height - boxHeight) / 2);
    const endY = startY + boxHeight;
    const step = 2;

    for (let y = startY; y < endY; y += step) {
        const rowData = ctx.getImageData(startX, y, boxWidth, 1).data;
        const binarizedRow = binarizeFn(rowData, boxWidth, options);
        const runs = calculateRuns(binarizedRow);

        const startGuard = findStartGuard(runs);
        if (!startGuard) {
            continue;
        }

        const barcode = parseModules(runs, startGuard.index, startGuard.moduleWidth);
        if (!barcode) {
            continue;
        }

        if (validateChecksum(barcode)) {
            return barcode;
        }
    }

    return null;
}

/**
 * Starts the live camera stream and continuously scans for barcodes.
 * @param {HTMLVideoElement} videoElement - The video element to use for camera capture.
 * @param {(barcode: string) => void} onDetected - Callback function to handle detected barcodes.
 * @return {Promise<() => void>} A cleanup function to stop the camera stream.
 */
export async function startCameraScanner(videoElement, onDetected) {
    let stream;
    let isScanning = true;

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment",
                width: {ideal: 1280},
                height: {ideal: 720}
            }
        });

        videoElement.srcObject = stream;
        await videoElement.play();

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", {
            willReadFrequently: true
        });

        const scanFrame = () => {
            if (!isScanning) {
                return;
            }

            if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
                const width = videoElement.clientWidth;
                const height = videoElement.clientHeight;

                if (canvas.width !== width) {
                    canvas.width = width;
                }
                if (canvas.height !== height) {
                    canvas.height = height;
                }

                ctx.drawImage(videoElement, 0, 0, width, height);

                const barcode = scanBarcodeFromContext(ctx, width, height);
                if (barcode) {
                    isScanning = false;
                    onDetected(barcode);
                    return;
                }
            }

            requestAnimationFrame(scanFrame);
        };

        requestAnimationFrame(scanFrame);

        return () => {
            isScanning = false;
            videoElement.srcObject = null;
            stream.getTracks().forEach(track => track.stop());
        }
    } catch (error) {
        console.error("Error accessing camera:", error);
        throw error;
    }
}

/**
 * Generates binarized image data and draws it on a canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} width - The width of the image.
 * @param {number} height - The height of the image.
 */
export function generateBinarizedImageData(ctx, width, height) {
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;

    for (let y = 0; y < height; y++) {
        const rowStartIndex = y * width * 4;
        let sum = 0;

        for (let x = 0; x < width; x++) {
            const pixelIndex = rowStartIndex + x * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            const grayscale = convertRgbToGrayscale(r, g, b);
            sum += grayscale;
        }

        const threshold = sum / width;

        for (let x = 0; x < width; x++) {
            const pixelIndex = rowStartIndex + x * 4;
            const grayscale = convertRgbToGrayscale(pixels[pixelIndex], pixels[pixelIndex + 1], pixels[pixelIndex + 2]);
            const value = grayscale < threshold ? 0 : 255;

            pixels[pixelIndex] = value;
            pixels[pixelIndex + 1] = value;
            pixels[pixelIndex + 2] = value;
        }
    }

    return imgData;
}

/**
 * Renders a stacked visual preview of the binarized viewfinder rows for debugging.
 * @param {CanvasRenderingContext2D} sourceCtx - The canvas context holding the video frame.
 * @param {CanvasRenderingContext2D} debugCtx - The debug canvas context.
 * @param {number} width - Video frame width.
 * @param {number} height - Video frame height.
 * @param {object} [options] - Binarization options.
 */
export function renderBinarizationDebugView(sourceCtx, debugCtx, width, height, options = {}) {
    if (!sourceCtx || !debugCtx) return;

    const binarizeFn = options.binarizeFn || binarizeRowAdaptive;

    const boxWidth = Math.floor(width * 0.8);
    const boxHeight = 120;
    const startX = Math.floor((width - boxWidth) / 2);
    const startY = Math.floor((height - boxHeight) / 2);

    const debugWidth = debugCtx.canvas.width;
    const debugHeight = debugCtx.canvas.height;

    // Clear debug canvas to black
    debugCtx.fillStyle = '#000000';
    debugCtx.fillRect(0, 0, debugWidth, debugHeight);

    // Sample rows across the viewfinder height
    const rowsToSample = 30;
    const rowStep = Math.max(1, Math.floor(boxHeight / rowsToSample));
    const targetRowHeight = Math.max(1, Math.floor(debugHeight / rowsToSample));

    let currentDebugY = 0;

    for (let y = startY; y < startY + boxHeight; y += rowStep) {
        if (currentDebugY >= debugHeight) break;

        const rowData = sourceCtx.getImageData(startX, y, boxWidth, 1).data;
        const binarizedRow = binarizeFn(rowData, boxWidth, options);

        // Draw each pixel of the binarized row onto the debug canvas
        for (let x = 0; x < boxWidth; x++) {
            const isBlack = binarizedRow[x] === 1;
            debugCtx.fillStyle = isBlack ? '#ffffff' : '#000000'; // White bars for 1s, black for 0s

            const debugX = Math.floor((x / boxWidth) * debugWidth);
            const debugXNext = Math.floor(((x + 1) / boxWidth) * debugWidth);
            const pixelWidth = Math.max(1, debugXNext - debugX);

            debugCtx.fillRect(debugX, currentDebugY, pixelWidth, targetRowHeight);
        }

        currentDebugY += targetRowHeight;
    }
}