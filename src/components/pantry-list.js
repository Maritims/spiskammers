import './pantry-item';
import styles from './pantry-list.css?inline';

export class PantryList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._items = [];
        this._filters = [];
    }

    set items(val) {
        this._items = val || [];
        this.render();
    }

    set filter(val) {
        this._filters = val || [];
        this.render();
    }

    get items() {
        return this._items;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const filteredItems = this._filters.length === 0 ? this._items : this._items.filter(item => this._filters.includes(item.category));

        this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        ${this._items.length === 0 ?
            `<div class="empty">No items found.</div>`
            :
            filteredItems.map(item => `
                <pantry-item
                    item-id="${item.id}"
                    name="${item.code}"
                    package-quantity="${item.packageQuantity}"
                    package-unit="${item.packageUnit}"
                    base-quantity="${item.baseQuantity}"
                    base-unit="${item.baseUnit}">
                </pantry-item>`).join('')
        }`;
    }
}

customElements.define('pantry-list', PantryList);