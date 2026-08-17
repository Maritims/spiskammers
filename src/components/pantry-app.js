import './pantry-speed-dial';
import './locale-selector';
import './pantry-scanner-dialog';
import './pantry-filter';
import './pantry-toast';
import './pantry-list';
import './pantry-checkin-dialog';
import './pantry-product-dialog';

import commonStyles from '../styles/stylesheet.css?inline';
import componentStyles from './pantry-app.css?inline';
import {i18n} from "../i18n";
import {
    addOrUpdateProduct, addOrUpdateStock,
    decrementStock,
    getPositiveProductStock,
    incrementStock
} from "../db/service";
import {requirePositiveNumber} from "../helpers/argumentHelper";

export class PantryApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        /**
         * The product stock to render in the pantry list.
         * @type {ProductStock[]}
         * @private
         */
        this._productStock = [];

        /**
         * The action to be performed when the language changes.
         * @private
         */
        this._onLanguageChange = () => this.render();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @listens PantryItem#event:IncrementStock
     * @listens PantryItem#event:DecrementStock
     * @return {Promise<void>}
     */
    async connectedCallback() {
        i18n.addEventListener('languagechange', this._onLanguageChange);
        await this.loadProductStock();
        this.render();

        /** @type {PantrySpeedDial} */
        const speedDial = this.shadowRoot.querySelector('pantry-speed-dial');
        speedDial.actions = [{
            action: 'request-open-checkin-dialog',
            buttonLabel: i18n.t('pantry.speed-dial.checkin.button.label'),
            icon: '📦'
        }];

        this.shadowRoot.addEventListener('speed-dial-click',
            /**
             * @param {PantrySpeedDialEvent} event
             * @return {Promise<void>}
             */
            async (event) => {
                const action = event.action;

                switch (action) {
                    case 'request-open-checkin-dialog':
                        await this.loadProductStock();
                        const dialog = this.shadowRoot.querySelector('pantry-checkin-dialog');
                        if (dialog) {
                            dialog.products = this.products;
                            dialog.open();
                        }
                        break;
                    default:
                        throw new Error(`Unknown action: ${action}`);
                }
            });

        this.shadowRoot.addEventListener('increment-stock',
            /** @param {UpdateStockEvent} event */
            async (event) => {
                const stockId = requirePositiveNumber(event.detail.stockId, 'event.detail.stockId');

                await incrementStock(stockId);
                await this.loadProductStock();

                this.updateList();
                this.notify(i18n.t('pantry.checkin.notification.item-checkin'), 'success', 3000);
            });

        this.shadowRoot.addEventListener('decrement-stock',
            /** @param {UpdateStockEvent} event */
            async (event) => {
                const stockId = requirePositiveNumber(event.detail.stockId, 'event.detail.stockId');

                try {
                    await decrementStock(stockId);
                } catch (error) {
                    console.error(error);
                    this.notify(i18n.t('pantry.checkin.notification.item-checkout.error'), 'danger', -1);
                    return;
                }

                await this.loadProductStock();
                this.updateList();
                this.notify(i18n.t('pantry.checkin.notification.item-checkout'), 'success', 3000);
            });

        this.shadowRoot.addEventListener('pantry-checkin',
            /** @param {PantryCheckinEvent} event */
            async (event) => {
                const productId = await addOrUpdateProduct(event.product);
                await addOrUpdateStock(productId, event.unit, event.quantity);
                await this.loadProductStock();

                this.updateList();
                this.notify(i18n.t('pantry.checkin.notification.item-checkin'), 'success', 3000);
            });

        this.shadowRoot.addEventListener('category-filter', async (event) => {
            const {categories} = event.detail;
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
            this.shadowRoot.querySelector('pantry-checkin-dialog').setGtinValue(barcode);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    disconnectedCallback() {
        i18n.removeEventListener('languagechange', this._onLanguageChange);
    }

    notify(message, type = 'success', duration) {
        window.dispatchEvent(new CustomEvent('toast-show', {
            detail: {message, type, duration}
        }));
    }

    /**
     * Retrieves all product stock with a positive quantity.
     * @async
     * @return {Promise<void>}
     */
    async loadProductStock() {
        try {
            this._productStock = await getPositiveProductStock();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    /**
     * Updates the pantry list with the current product stock.
     */
    updateList() {
        /** @type {PantryList} */
        const listEl = this.shadowRoot.querySelector('pantry-list');
        /** @type {PantryFilter} */
        const filterEl = this.shadowRoot.querySelector('pantry-filter');

        if (listEl) {
            listEl.productStock = this._productStock;
        }

        if (filterEl) {
            //filterEl.categories = [...new Set(this.stock.map(item => item.category).filter(Boolean))];
        }
    }

    render() {
        // noinspection CssMissingComma
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
        <pantry-speed-dial></pantry-speed-dial>
        <pantry-checkin-dialog></pantry-checkin-dialog>
        <pantry-scanner-dialog></pantry-scanner-dialog>
        <pantry-toast></pantry-toast>
        `;
        this.updateList();
    }
}

customElements.define('pantry-app', PantryApp);