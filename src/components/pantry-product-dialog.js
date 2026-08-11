import styles from '../styles/stylesheet.css?inline';

export class PantryProductDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();

        this.shadowRoot.addEventListener('submit', (event) => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);

            const newProduct = {
                ean: formData.get('ean'),
                name: formData.get('name'),
                packageUnit: formData.get('packageUnit'),
                baseQuantity: formData.get('baseQuantity'),
                baseUnit: formData.get('baseUnit'),
            };

            this.dispatchEvent(new CustomEvent('product-create', {
                detail: newProduct,
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
        });
    }

    open() {
        const dialog = this.shadowRoot.querySelector('dialog');
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
                    <h2>Register Product</h2>
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
                        <input type="number" id="baseQuantity" name="baseQuantity" value="1" min="1" required>
                    </div>
                    <div class="field">
                        <label for="baseUnit">Base Unit</label>
                        <input type="text" id="baseUnit" name="baseUnit" placeholder="e.g. ml" required>
                    </div>
                    <div class="actions">
                        <button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </dialog>
        `;
    }
}

customElements.define('pantry-product-dialog', PantryProductDialog);