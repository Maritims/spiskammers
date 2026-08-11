import styles from '../styles/stylesheet.css?inline';

export class PantryProductDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.isEditing = false;
    }

    connectedCallback() {
        this.render();

        this.shadowRoot.addEventListener('submit', (event) => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);

            const productData = {
                ean: formData.get('ean'),
                name: formData.get('name'),
                packageUnit: formData.get('packageUnit'),
                baseQuantity: formData.get('baseQuantity'),
                baseUnit: formData.get('baseUnit'),
            };

            const eventName = this.isEditing ? 'product-update' : 'product-create';
            this.dispatchEvent(new CustomEvent(eventName, {
                detail: productData,
                bubbles: true,
                composed: true
            }));

            form.reset();
            this.close();
        });

        this.shadowRoot.addEventListener('click', (event) => {
            if (event.target.id === 'cancel-btn') {
                this.close();
            }
            if (event.target.id === 'delete-btn') {
                const ean = this.shadowRoot.querySelector('input[name="ean"]').value;
                if (confirm(`Are you sure you want to delete this product?`)) {
                    this.dispatchEvent(new CustomEvent('product-delete', {
                        detail: {ean},
                        bubbles: true,
                        composed: true
                    }));
                }
                this.open();
            }
        });
    }

    open(product = null) {
        this.isEditing = !!product;
        this.render();

        const dialog = this.shadowRoot.querySelector('dialog');
        const eanInput = this.shadowRoot.querySelector('input[name="ean"]');
        const nameInput = this.shadowRoot.querySelector('input[name="name"]');
        const packageUnitInput = this.shadowRoot.querySelector('input[name="packageUnit"]');
        const baseQuantityInput = this.shadowRoot.querySelector('input[name="baseQuantity"]');
        const baseUnitInput = this.shadowRoot.querySelector('input[name="baseUnit"]');

        if (product) {
            eanInput.value = product.ean;
            eanInput.readOnly = true;
            nameInput.value = product.name;
            packageUnitInput.value = product.packageUnit;
            baseQuantityInput.value = product.baseQuantity;
            baseUnitInput.value = product.baseUnit;
        } else {
            eanInput.readOnly = false;
        }

        if (dialog) {
            dialog.showModal();
        }
    }

    close() {
        const dialog = this.shadowRoot.querySelector('dialog');
        if (dialog) {
            dialog.close();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <dialog>
                <form method="dialog">
                    <h2>${this.isEditing ? 'Edit Product' : 'Register Product'}</h2>
                    <div class="field">
                        <label for="ean">EAN</label>
                        <input type="text" id="ean" name="ean" placeholder="e.g. 7038010000065" required>
                    </div>
                    <div class="field">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="field">
                        <label for="packageUnit">Package Unit</label>
                        <input type="text" id="packageUnit" name="packageUnit" placeholder="e.g. bottle" required>
                    </div>
                    <div class="field">
                        <label for="baseQuantity">Base Quantity per Package</label>
                        <input type="number" id="baseQuantity" name="baseQuantity" value="1" min="1" step="any" inputmode="decimal" required>
                    </div>
                    <div class="field">
                        <label for="baseUnit">Base Unit</label>
                        <input type="text" id="baseUnit" name="baseUnit" placeholder="e.g. ml" required>
                    </div>
                    <div class="actions">
                        ${this.isEditing ? `<button type="button" class="btn btn-danger" id="delete-btn">Delete</button>` : ''}
                        <div style="flex-grow: 1;"></div>
                        <button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </dialog>
        `;
    }
}

customElements.define('pantry-product-dialog', PantryProductDialog);