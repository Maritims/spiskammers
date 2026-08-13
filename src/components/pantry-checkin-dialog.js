import styles from '../styles/stylesheet.css?inline';
import {
    createMeasurementUnitOptionsAsHtml,
    createPackageUnitOptionsAsHtml
} from "../units";

export class PantryCheckinDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._products = [];
    }

    set products(val) {
        this._products = val || [];
        this.updateProductList();
    }

    get products() {
        return this._products;
    }

    setEanValue(ean) {
        const eanInput = this.shadowRoot.querySelector('input[name="ean"]');
        if (eanInput) {
            eanInput.value = ean;
            eanInput.dispatchEvent(new Event('blur', { bubbles: true}));
        }
    }

    connectedCallback() {
        this.render();

        const eanInput = this.shadowRoot.querySelector('input[name="ean"]');
        if (eanInput) {
            eanInput.addEventListener('blur', (event) => {
                const ean = event.target.value;
                if (!ean) {
                    return;
                }

                const product = this._products.find(p => p.ean === ean);
                if (product) {
                    this.shadowRoot.querySelector('input[name="name"]').value = product.name;
                    this.shadowRoot.querySelector('input[name="packageUnit"]').value = product.packageUnit;
                    this.shadowRoot.querySelector('input[name="baseQuantity"]').value = product.baseQuantity;
                    this.shadowRoot.querySelector('input[name="baseUnit"]').value = product.baseUnit;
                }
            });
        }

        this.shadowRoot.addEventListener('submit', (event) => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);

            const newData = {
                name: formData.get('name'),
                packageQuantity: formData.get('packageQuantity'),
                packageUnit: formData.get('packageUnit'),
                baseQuantity: formData.get('baseQuantity'),
                baseUnit: formData.get('baseUnit'),
            };

            this.dispatchEvent(new CustomEvent('item-checkin', {
                detail: newData,
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

        this.shadowRoot.querySelector('#scan-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('open-scanner', {
                bubbles: true,
                composed: true
            }));
        })
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

    updateProductList() {
        const datalist = this.shadowRoot.querySelector('#product-list');
        if (datalist) {
            datalist.innerHTML = this._products.map(product => `<option value="${product.ean}">${product.name}</option>`).join('');
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <dialog>
                <form method="dialog">
                    <h2>Check In Item</h2>
                    <div class="field">
                        <label for="ean">EAN</label>
                        <input type="text" id="ean" name="ean" list="product-list" placeholder="e.g. 7038010000065" required>
                        <datalist id="product-list">${this._products.map(product => `<option value="${product.ean}">${product.name}</option>`).join('')}</datalist>
                    </div>
                    <div class="field">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="field">
                        <label for="packageQty">Package Qty</label>
                        <input type="number" id="packageQty" name="packageQuantity" value="1" min="1" step="any" required>
                    </div>
                    <div class="field">
                        <label for="packageUnit">Package Unit</label>
                        <input type="text" id="packageUnit" name="packageUnit" list="package-unit-list" placeholder="e.g. bottle" required>
                        <datalist id="package-unit-list">${createPackageUnitOptionsAsHtml()}</datalist>
                    </div>
                    <div class="field">
                        <label for="baseQty">Base Qty per Package</label>
                        <input type="number" id="baseQty" name="baseQuantity" value="1" min="1" step="any" required>
                    </div>
                    <div class="field">
                        <label for="baseUnit">Base Unit</label>
                        <input type="text" id="baseUnit" name="baseUnit" list="measurement-unit-list" placeholder="e.g. ml" required>
                        <datalist id="measurement-unit-list">${createMeasurementUnitOptionsAsHtml()}</datalist>
                    </div>
                    <div class="actions justify-content-between">
                        <button type="button" id="scan-btn" class="btn btn-primary" title="Scan Barcode">📷</button>
                        <div class="justify-content-flex-end">
                            <button type="submit" class="btn btn-primary">Save</button>
                            <button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </form>
            </dialog>
        `;
    }
}

customElements.define('pantry-checkin-dialog', PantryCheckinDialog);