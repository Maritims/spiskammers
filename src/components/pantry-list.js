import './pantry-item';
import styles from './pantry-list.css?inline';

export class PantryList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        /** @type {ProductStock[]} */
        this._productStock = [];
        this._filters = [];
    }

    get productStock() {
        return this._productStock;
    }

    /**
     * @param {ProductStock[]} productStock
     */
    set productStock(productStock) {
        this._productStock = productStock || [];
        this.render();
    }

    // noinspection JSUnusedGlobalSymbols
    set filter(val) {
        this._filters = val || [];
        this.render();
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        this.render();
    }

    render() {
        /** @type {ProductStock[]} */
        const filteredProductStock = this._filters.length === 0 ? this._productStock : [];//this._productStock.filter(item => this._filters.includes(item.category));

        this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        ${this.productStock.length === 0 ?
            `<div class="empty">No items found.</div>`
            :
            filteredProductStock.map(productStock => {
                const {product, stock} = productStock;
                /** @type {number} */
                const factor = product.packaging[stock.unit] || 1;
                const totalBaseQuantity = factor * stock.quantity;

                return `
                    <pantry-item
                        stock-id="${stock.id}"
                        stock-quantity="${stock.quantity}"
                        stock-unit="${stock.unit}"
                        product-name="${product.name}"
                        total-base-quantity="${totalBaseQuantity}"
                        base-unit="${product.baseUnit}">
                    </pantry-item>`
            }).join('')
        }`;
    }
}

customElements.define('pantry-list', PantryList);