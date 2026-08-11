import commonStyles from '../styles/stylesheet.css?inline';
import componentStyles from './pantry-item.css?inline';

export class PantryItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() {
        return ['item-id', 'name', 'package-quantity', 'package-unit', 'base-quantity', 'base-unit'];
    }

    attributeChangedCallback() {
        this.render();
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.addEventListener('click', (event) => {
            if (event.target.classList.contains('checkout-btn')) {
                const id = this.getAttribute('item-id');
                const amount = Number(event.target.dataset.amount) || 1;

                this.dispatchEvent(new CustomEvent('item-checkout', {
                    detail: {id, amount},
                    bubbles: true,
                    composed: true
                }));
            }
        });
    }

    render() {
        const name = this.getAttribute('name') || '';
        const packageQuantity = this.getAttribute('package-quantity') || '';
        const packageUnit = this.getAttribute('package-unit') || '';
        const baseQuantity = this.getAttribute('base-quantity') || '';
        const baseUnit = this.getAttribute('base-unit') || '';

        const totalQuantity = Number(packageQuantity) * Number(baseQuantity);

        this.shadowRoot.innerHTML = `
            <style>
                ${commonStyles}
                ${componentStyles}
            </style>
            <div class="info">
                <span class="name">${name}</span>
                <span class="quantity">${totalQuantity} ${baseUnit} (${packageQuantity} ${packageUnit})</span>
            </div>
            <div class="actions">
                <button class="btn btn-square btn-primary checkout-btn" data-amount="1">-1</button>
                <button class="btn btn-square btn-primary checkout-btn" data-amount="2">-2</button>
            </div>
        `;
    }
}

customElements.define('pantry-item', PantryItem);