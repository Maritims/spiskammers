import './locale-selector';
import './pantry-scanner-dialog';
import './pantry-filter';
import './pantry-toast';
import './pantry-list';
import './pantry-fab';
import './pantry-checkin-dialog';
import './pantry-product-fab';
import './pantry-product-dialog';
import {
    addPantryItem,
    addProduct,
    decrementPantryItemPackageQuantity,
    deleteProduct,
    getAllProducts,
    getPantryItems,
    updateProduct
} from "../db";
import commonStyles from '../styles/stylesheet.css?inline';
import componentStyles from './pantry-app.css?inline';
import {i18n} from "../i18n";

export class PantryApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        /** @type {Ingredient[]} */
        this.items = [];
        /** @type {Product[]} */
        this.products = [];
        this._onLanguageChange = () => this.render();
    }

    async connectedCallback() {
        i18n.addEventListener('languagechange', this._onLanguageChange);
        await this.loadItems();
        this.render();

        this.shadowRoot.addEventListener('fab-click', async () => {
            await this.loadProducts();
            const dialog = this.shadowRoot.querySelector('pantry-checkin-dialog');
            if (dialog) {
                dialog.products = this.products;
                dialog.open();
            }
        });

        this.shadowRoot.addEventListener('product-fab-click', () => {
            const dialog = this.shadowRoot.querySelector('pantry-product-dialog');
            if (dialog) {
                dialog.open();
            }
        });

        this.shadowRoot.addEventListener('item-checkin', async (event) => {
            const newItem = event.detail;
            await addPantryItem(newItem);
            await this.loadItems();
            this.updateList();

            this.notify(i18n.t('pantry.checkin.notification.item-checkin'), 'success', 3000);
        });

        this.shadowRoot.addEventListener('item-checkout', async (event) => {
            const { id, amount } = event.detail;
            await decrementPantryItemPackageQuantity(id, amount);
            await this.loadItems();
            this.updateList();

            this.notify(i18n.t('pantry.checkin.notification.item-checkout'), 'success', 3000);
        });

        this.shadowRoot.addEventListener('product-create', async (event) => {
            const newProduct = event.detail;
            await addProduct(newProduct);

            this.notify(i18n.t('pantry.product.notification.product-create'), 'success', 3000);
        });

        this.shadowRoot.addEventListener('product-update', async (event) => {
            const updatedProduct = event.detail;
            await updateProduct(updatedProduct);

            this.notify(i18n.t('pantry.product.notification.product-update'), 'success', 3000);
        });

        this.shadowRoot.addEventListener('product-delete', async (event) => {
            const ean = event.detail.ean;
            await deleteProduct(ean);

            this.notify(i18n.t('pantry.product.notification.product-delete'), 'success', 3000);
        });

        this.shadowRoot.addEventListener('category-filter', async (event) => {
            const { categories } = event.detail;
            const listEl = this.shadowRoot.querySelector('pantry-list');
            if (listEl) {
                listEl.filter = categories;
            }
        });

        this.shadowRoot.addEventListener('open-scanner', async () => {
            const scanner = this.shadowRoot.querySelector('pantry-scanner-dialog');
            if (scanner) {
                scanner.open();
            }
        });

        this.shadowRoot.addEventListener('barcode-scanned', async (event) => {
            const barcode = event.detail;
            this.shadowRoot.querySelector('pantry-checkin-dialog').setEanValue(barcode);
        });
    }

    disconnectedCallback() {
        i18n.removeEventListener('languagechange', this._onLanguageChange);
    }

    notify(message, type = 'success', duration) {
        window.dispatchEvent(new CustomEvent('toast-show', {
            detail: {message, type, duration}
        }));
    }

    async loadItems() {
        try {
            this.items = await getPantryItems();
        } catch (error) {
            console.error('Error loading pantry items:', error);
        }
    }

    async loadProducts() {
        try {
            this.products = await getAllProducts();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    updateList() {
        const listEl = this.shadowRoot.querySelector('pantry-list');
        const filterEl = this.shadowRoot.querySelector('pantry-filter');

        if(listEl) {
            listEl.items = this.items;
        }

        if (filterEl) {
            filterEl.categories = [...new Set(this.items.map(item => item.category).filter(Boolean))];
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            ${commonStyles}
            ${componentStyles}
        </style>
        <header>
            <h1>${i18n.t('pantry.app.title')}</h1>
            <locale-selector></locale-selector>
        </header>
        <main>
            <pantry-filter></pantry-filter>
            <pantry-list></pantry-list>
        </main>
        <pantry-fab></pantry-fab>
        <pantry-product-fab></pantry-product-fab>
        <pantry-checkin-dialog></pantry-checkin-dialog>
        <pantry-scanner-dialog></pantry-scanner-dialog>
        <pantry-product-dialog></pantry-product-dialog>
        <pantry-toast></pantry-toast>
        `;
        this.updateList();
    }
}

customElements.define('pantry-app', PantryApp);