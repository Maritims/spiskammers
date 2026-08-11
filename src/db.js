/**
 * @typedef {Object} Product
 * @property {number} [id] - Auto incremented primary key.
 * @property {string} name - Name of the product.
 * @property {string} ean - Unique EAN barcode.
 */

/**
 * @typedef {Object} Ingredient
 * @property {number} [id] - Auto incremented primary key.
 * @property {number} productId - Foreign key referencing the product ID.
 * @property {string} name - Name of the ingredient.
 * @property {number} quantity - Quantity of the ingredient.
 */

const DB_NAME = 'pantry_db';
const PANTRY_STORE_NAME = 'pantry';
const PRODUCT_STORE_NAME = 'products';
const DB_VERSION = 1;

export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(PANTRY_STORE_NAME)) {
                const pantryStore = db.createObjectStore(PANTRY_STORE_NAME, {keyPath: 'id', autoIncrement: true});
                pantryStore.createIndex('name', 'name', {unique: false});

                const initialItems = [{
                    name: 'Oats',
                    category: 'Grains',
                    packageQuantity: 2,
                    packageUnit: 'bag(s)',
                    baseQuantity: 1,
                    baseUnit: 'kg'
                }, {
                    name: 'Olive oil',
                    category: 'Oils',
                    packageQuantity: 1,
                    packageUnit: 'bottle(s)',
                    baseQuantity: 500,
                    baseUnit: 'ml'
                }, {
                    name: 'Butter',
                    category: 'Dairy',
                    packageQuantity: 4,
                    packageUnit: 'package(s)',
                    baseQuantity: 1,
                    baseUnit: 'kg'
                }, {
                    name: 'Milk',
                    category: 'Dairy',
                    packageQuantity: 6,
                    packageUnit: 'carton(s)',
                    baseQuantity: 1,
                    baseUnit: 'l'
                }, {
                    name: 'Apples',
                    category: 'Fruits',
                    packageQuantity: 6,
                    packageUnit: 'package(s)',
                    baseQuantity: 1,
                    baseUnit: 'kg'
                }, {
                    name: 'Broccoli',
                    category: 'Vegetables',
                    packageQuantity: 1,
                    packageUnit: 'package(s)',
                    baseQuantity: 1,
                    baseUnit: 'kg'
                }];
                initialItems.forEach(item => pantryStore.add(item));
            }

            if(!db.objectStoreNames.contains(PRODUCT_STORE_NAME)) {
                const productStore = db.createObjectStore(PRODUCT_STORE_NAME, {keyPath: 'id', autoIncrement: true});
                productStore.createIndex('name', 'name', {unique: true});

                const initialItems = [{
                    ean: '7038010000065',
                    name: 'TINE Helmelk 3,5 % fett 1 liter',
                    packageUnit: 'carton',
                    baseQuantity: 1.75,
                    baseUnit: 'l'
                }];
                initialItems.forEach(product => productStore.add(product));
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

export async function getPantryItems() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PANTRY_STORE_NAME, 'readonly');
        const store = transaction.objectStore(PANTRY_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

export async function addPantryItem(item) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PANTRY_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(PANTRY_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = (event) => {
            const items = event.target.result;
            let existing = null;

            if (item.ean) {
                existing = items.find(i => i.ean === item.ean);
            } else {
                existing = items.find(i => i.name.trim().toLowerCase() === item.name.trim().toLowerCase());
            }

            if (existing) {
                existing.packageQuantity += Number(existing.packageQuantity) + Number(item.packageQuantity);

                const updateRequest = store.put(existing);
                updateRequest.onsuccess = () => resolve(existing.id);
                updateRequest.onerror = (event) => reject(event.target.error);
            } else {
                const addRequest = store.add(item);
                addRequest.onsuccess = (event) => resolve(event.target.result);
                addRequest.onerror = (event) => reject(event.target.error);
            }
        };

        request.onerror = (event) => reject(event.target.error);
    })
}

export async function decrementPantryItemPackageQuantity(id, amount = 1) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PANTRY_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(PANTRY_STORE_NAME);
        const getRequest = store.get(Number(id));

        getRequest.onsuccess = () => {
            const item = getRequest.result;
            if (item) {
                item.packageQuantity -= amount;
                if (item.packageQuantity <= 0) {
                    store.delete(Number(id));
                } else {
                    store.put(item);
                }
                transaction.oncomplete = () => resolve(item);
            } else {
                reject(new Error('Item not found'));
            }
        };
        getRequest.onerror = (event) => reject(event.target.error);
    });
}

export async function addProduct(product) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PRODUCT_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(PRODUCT_STORE_NAME);
        const request = store.add(product);

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

export async function updateProduct(product) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PRODUCT_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(PRODUCT_STORE_NAME);
        const request = store.put(product);

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

export async function deleteProduct(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PRODUCT_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(PRODUCT_STORE_NAME);
        const request = store.delete(Number(id));

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

export async function getProductByEAN(ean) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PRODUCT_STORE_NAME, 'readonly');
        const store = transaction.objectStore(PRODUCT_STORE_NAME);
        const request = store.get(Number(ean));

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

export async function getAllProducts() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PRODUCT_STORE_NAME, 'readonly');
        const store = transaction.objectStore(PRODUCT_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}