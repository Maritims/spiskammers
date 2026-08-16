/**
 * @import { Product, ProductInput, Stock } from './types';
 */
import {
    idbRequest,
    openDB,
    PRODUCT_STORE_NAME,
    STOCK_PRODUCT_ID_UNIT_IDX,
    STOCK_QUANTITY_IDX,
    STOCK_STORE_NAME
} from './db';

import {
    requireNonEmptyOptionalString,
    requireNonEmptyString,
    requirePositiveNumber,
    requirePresent
} from "../helpers/argumentHelper";

// noinspection JSUnusedGlobalSymbols
/**
 * @return {Promise<Product[]>}
 */
async function getAllProducts() {
    const db = await openDB();
    const tx = db.transaction(PRODUCT_STORE_NAME, 'readonly');
    const store = tx.objectStore(PRODUCT_STORE_NAME);

    return await idbRequest(store.getAll());
}

/**
 * Gets all positive stock.
 * @return {Promise<Stock[]>}
 */
async function getPositiveStock() {
    const db = await openDB();
    const tx = db.transaction(STOCK_STORE_NAME, 'readonly');
    const store = tx.objectStore(STOCK_STORE_NAME);
    const index = store.index(STOCK_QUANTITY_IDX);

    const range = IDBKeyRange.lowerBound(0, true);
    return await idbRequest(index.getAll(range))
}

/**
 * Gets all positive product stock.
 * @return {Promise<ProductStock[]>}
 */
export async function getPositiveProductStock() {
    const allProducts = await getAllProducts();
    const allStock = await getPositiveStock();

    /** @type {ProductStock[]} */
    const allProductStock = [];
    for (const product of allProducts) {
        const stock = allStock.find(s => s.productId === product.id);
        if (stock) {
            allProductStock.push({product, stock});
        }
    }
    return allProductStock;
}

/**
 * Adds or updates a product in the database.
 * @param {Product} product - The product to add or update.
 * @return {Promise<number>} The product ID.
 */
export async function addOrUpdateProduct(product) {
    requirePresent(product, 'product');
    requireNonEmptyOptionalString(product.gtin, 'product.gtin');
    requireNonEmptyString(product.name, 'product.name');
    requireNonEmptyString(product.baseUnit, 'product.baseUnit');
    requirePresent(product.packaging, 'product.packaging');

    const db = await openDB();
    const tx = db.transaction(PRODUCT_STORE_NAME, 'readwrite');
    const store = tx.objectStore(PRODUCT_STORE_NAME);

    return await idbRequest(store.put(product));
}

/**
 * Adds or updates product stock in the database.
 * @param {number} productId - Unique product identifier.
 * @param {keyof PackagingMap} unit - The stock unit.
 * @param {number} quantity - The new stock quantity.
 * @return {Promise<Stock>} The created or updated stock.
 */
export async function addOrUpdateStock(productId, unit, quantity) {
    requirePositiveNumber(productId, 'productId');
    requireNonEmptyString(unit, 'unit');
    requirePositiveNumber(quantity, 'quantity');

    const db = await openDB();
    const tx = db.transaction(STOCK_STORE_NAME, 'readwrite');
    const store = tx.objectStore(STOCK_STORE_NAME);
    /** @type {Stock} */
    let stock = await idbRequest(store.index(STOCK_PRODUCT_ID_UNIT_IDX).get([productId, unit]));

    if (stock) {
        stock.quantity = quantity;
    } else {
        stock = {
            productId,
            quantity,
            unit,
        };
    }

    stock.id = await idbRequest(store.put(stock));
    return stock;
}

/**
 * Increments existing stock by one unit.
 * @param {number} stockId - Unique identifier of the stock to increment.
 * @returns {Promise<Stock>} The updated stock.
 * @throws {Error} If no stock record with the given id exists.
 */
export async function incrementStock(stockId) {
    requirePositiveNumber(stockId, 'stockId');

    const db = await openDB();
    const transaction = db.transaction(STOCK_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STOCK_STORE_NAME);
    /** @type {Stock} */
    const stock = await idbRequest(store.get(stockId));

    if (!stock) {
        throw new Error(`Stock record not found for ID ${stockId}`);
    }

    stock.quantity += 1;
    await idbRequest(store.put(stock));

    return stock;
}

/**
 * Decrements existing stock by one unit.
 * @param {number} stockId - Unique identifier of the stock to decrement.
 * @return {Promise<Stock>} The updated stock.
 * @throws {Error} If no stock record with the given id exists.
 */
export async function decrementStock(stockId) {
    requirePositiveNumber(stockId, 'stockId');

    const db = await openDB();
    const transaction = db.transaction(STOCK_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STOCK_STORE_NAME);
    /** @type {Stock} */
    const stock = await idbRequest(store.get(stockId));

    if (!stock) {
        throw new Error(`Stock record not found for ID ${stockId}`);
    }

    if ((stock.quantity - 1) < 0) {
        throw new Error(`Decrementing stock would lead to negative value for stock ID ${stockId}`);
    }

    stock.quantity -= 1;
    await idbRequest(store.put(stock));
}