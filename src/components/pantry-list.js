import './pantry-item';
import styles from './pantry-list.css?inline';

export class PantryList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._items = [];
    }

    set items(val) {
        this._items = val;
        this.render();
    }

    get items() {
        return this._items;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        ${this._items.length === 0 ?
            `<div class="empty">Your pantry is completely empty!</div>`
            :
            this._items.map(item => `
                <pantry-item
                    item-id="${item.id}"
                    name="${item.name}"
                    package-quantity="${item.packageQuantity}"
                    package-unit="${item.packageUnit}"
                    base-quantity="${item.baseQuantity}"
                    base-unit="${item.baseUnit}">
                </pantry-item>`).join('')
        }`;
    }
}

customElements.define('pantry-list', PantryList);