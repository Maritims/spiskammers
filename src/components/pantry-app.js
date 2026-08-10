import './pantry-list';
import './pantry-fab';
import './pantry-checkin-dialog';
import {addPantryItem, decrementPantryItemPackageQuantity, getPantryItems} from "../db";
import commonStyles from '../styles/stylesheet.css?inline';
import componentStyles from './pantry-app.css?inline';

export class PantryApp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.items = [];
    }

    async connectedCallback() {
        await this.loadItems();
        this.render();

        this.shadowRoot.addEventListener('item-checkout', async (event) => {
            const { id, amount } = event.detail;
            await decrementPantryItemPackageQuantity(id, amount);
            await this.loadItems();
            this.updateList();
        });

        this.shadowRoot.addEventListener('fab-click', () => {
            const dialog = this.shadowRoot.querySelector('pantry-checkin-dialog');
            if (dialog) {
                dialog.open();
            }
        });

        this.shadowRoot.addEventListener('item-checkin', async (event) => {
            const newItem = event.detail;
            await addPantryItem(newItem);
            await this.loadItems();
            this.updateList();
        })
    }

    async loadItems() {
        try {
            this.items = await getPantryItems();
        } catch (error) {
            console.error('Error loading pantry items:', error);
        }
    }

    updateList() {
        const listEl = this.shadowRoot.querySelector('pantry-list');
        if(listEl) {
            listEl.items = this.items;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            ${commonStyles}
            ${componentStyles}
        </style>
        <header>
            <h1>Pantry</h1>
        </header>
        <main>
            <pantry-list></pantry-list>
        </main>
        <pantry-fab></pantry-fab>
        <pantry-checkin-dialog></pantry-checkin-dialog>
        `;
        this.updateList();
    }
}

customElements.define('pantry-app', PantryApp);