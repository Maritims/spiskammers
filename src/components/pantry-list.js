import './pantry-item';
import styles from './pantry-list.css?inline';
import {multiplyPrecisely} from "../helpers/math";

/**
 * A web component showing the current stock or a message indicating no items are available.
 *
 * @element pantry-list
 */
export class PantryList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        /**
         * The current stock of products to display in the list.
         * @type {ProductStock[]}
         * */
        this._productStock = [];
    }

    /**
     * Set the current stock of products to display in the list and re-render the component.
     * @param {ProductStock[]} productStock
     */
    set productStock(productStock) {
        this._productStock = productStock || [];
        this.render();
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        this.render();
    }

    /**
     * Calculates the total base quantity by multiplying the stock unit's packaging factor with the stock quantity.
     *
     * @param {ProductStock} productStock - The product stock container.
     * @returns {number} The total base quantity.
     * @private
     * @readonly
     */
    #getTotalBaseQuantity(productStock) {
        const {product, stock} = productStock;
        const factor = product.packaging[stock.unit] || 1;
        return multiplyPrecisely(factor, stock.quantity);
    }

    /**
     * Renders the component by creating a new HTML template and inserting it into the shadow DOM,
     * displaying either a list of pantry items or a message indicating no items are available.
     */
    render() {
        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            ${this._productStock.length === 0 ?
            `<div class="empty">No items found.</div>` : this._productStock
                .map(productStock => `<pantry-item
                    stock-id="${productStock.stock.id}"
                    stock-quantity="${productStock.stock.quantity}"
                    stock-unit="${productStock.stock.unit}"
                    product-name="${productStock.product.name}"
                    total-base-quantity="${this.#getTotalBaseQuantity(productStock)}"
                    base-unit="${productStock.product.baseUnit}"></pantry-item>
                `)
                .join('')
        }`;
    }
}

customElements.define('pantry-list', PantryList);