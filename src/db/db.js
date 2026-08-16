import {MassUnit, VolumeUnit} from "./types";

/**
 * Promisifies an IndexedDB request.
 *
 * @template T
 * @param {IDBRequest<T>} request - The IndexedDB request.
 * @returns {Promise<T>} A promise that resolves with the result of the request.
 */
export function idbRequest(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

/**
 * @typedef {Object} Ingredient
 * @property {number} [id] - Auto incremented primary key.
 * @property {string} [ean] - Unique EAN barcode.
 * @property {string} name - Name of the ingredient.
 * @property {string} category - Category of the ingredient.
 * @property {string} packageUnit - Unit of the ingredient in packages.
 * @property {number} packageQuantity - Quantity of the ingredient in packages.
 * @property {string} baseUnit - Unit of the ingredient in base units.
 * @property {number} baseQuantity - Quantity of the ingredient in base units.
 */

const DB_NAME = 'pantry_db';
const DB_VERSION = 2;

// region PRODUCT STORE
export const PRODUCT_STORE_NAME = 'products';
export const PRODUCT_GTIN_IDX = 'gtin_idx';
// endregion

// region STOCK STORE
export const STOCK_STORE_NAME = 'stock';
export const STOCK_PRODUCT_ID_IDX = 'productId_idx';
export const STOCK_PRODUCT_ID_UNIT_IDX = 'productId_unit_idx';
export const STOCK_QUANTITY_IDX = 'quantity_idx';

// endregion

async function seedInitialData(db) {
    const transaction = db.transaction([PRODUCT_STORE_NAME, STOCK_STORE_NAME], 'readwrite');
    const productStore = transaction.objectStore(PRODUCT_STORE_NAME);
    const stockStore = transaction.objectStore(STOCK_STORE_NAME);

    const countRequest = productStore.count();
    countRequest.onsuccess = () => {
        if (countRequest.result === 0) {
            /** @type {Product} */
            const oats = {
                id: 1,
                gtin: '7044416013141',
                name: 'AXA Bjørn Lettkokte Havregryn',
                baseUnit: MassUnit.KILOGRAM,
                packaging: {pack: 1.1}
            };
            /** @type {Product} */
            const butter = {
                id: 2,
                gtin: '7038010010187',
                name: 'TINE Ekte meierismør',
                baseUnit: MassUnit.GRAM,
                packaging: {pack: 500}
            };
            /** @type {Product} */
            const milk = {
                id: 3,
                gtin: '7038010000065',
                name: 'TINE Helmelk 3,5 % fett 1 liter',
                baseUnit: VolumeUnit.LITER,
                packaging: {pack: 1.75}
            };
            [butter, milk, oats].forEach(product => productStore.add(product));

            /** @type {Stock} */
            const butterStock = {
                productId: 2,
                quantity: 100,
                unit: 'pack'
            };
            /** @type {Stock} */
            const milkStock = {
                productId: 3,
                quantity: 200,
                unit: 'carton'
            };
            /** @type {Stock} */
            const oatsStock = {
                productId: 1,
                quantity: 300,
                unit: 'pack'
            };
            [butterStock, milkStock, oatsStock].forEach(stock => stockStore.add(stock));
        }
    }
}

export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(PRODUCT_STORE_NAME)) {
                const store = db.createObjectStore(PRODUCT_STORE_NAME, {keyPath: 'id', autoIncrement: true});
                store.createIndex(PRODUCT_GTIN_IDX, 'gtin', {unique: false});
            }

            if (!db.objectStoreNames.contains(STOCK_STORE_NAME)) {
                const store = db.createObjectStore(STOCK_STORE_NAME, {keyPath: 'id', autoIncrement: true});
                store.createIndex(STOCK_PRODUCT_ID_IDX, 'productId', {unique: false});
                store.createIndex(STOCK_PRODUCT_ID_UNIT_IDX, ['productId', 'unit'], {unique: true});
                store.createIndex(STOCK_QUANTITY_IDX, 'quantity', {unique: false});
            }
        };

        request.onsuccess = async (event) => {
            const db = event.target.result;
            await seedInitialData(db);
            resolve(db);
        }
        request.onerror = (event) => reject(event.target.error);
    });
}