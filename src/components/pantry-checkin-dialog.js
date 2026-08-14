import styles from '../styles/stylesheet.css?inline';
import {
    createMeasurementUnitOptionsAsHtml,
    createPackageUnitOptionsAsHtml
} from "../units";
import {i18n} from "../i18n";

export class PantryCheckinDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        /** @type {Product[]} */
        this._products = [];
    }

    /**
     * @param {Product[]} val
     * @return {void}
     */
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
                    this.shadowRoot.querySelector('input[name="name"]').value = product.code;
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

    isOpen() {
        return this.shadowRoot.querySelector('dialog').open;
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
        /** @type {HTMLDataListElement} */
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
                    <h2>${i18n.t('pantry.checkin.title')}</h2>
                    <div class="field">
                        <label for="ean">${i18n.t('pantry.checkin.ean.label')}</label>
                        <input type="text" id="ean" name="ean" list="product-list" required>
                        <datalist id="product-list">${this._products.map(product => `<option value="${product.ean}">${product.code}</option>`).join('')}</datalist>
                    </div>
                    <div class="field">
                        <label for="name">${i18n.t('pantry.checkin.name.label')}</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    
                    <fieldset>
                        <legend>${i18n.t('pantry.product.package.legend')}</legend>
                        <datalist id="package-unit-list">${createPackageUnitOptionsAsHtml()}</datalist>
                        
                        <div class="qty-unit-input-group">
                            <div>
                                <label for="packageQuantity">${i18n.t('pantry.product.package.quantity.label')}</label>
                                <input type="number" id="packageQuantity" name="packageQuantity" min="1" step="any" inputmode="decimal">
                            </div>
                            
                            <div>
                                <label for="packageUnit">${i18n.t('pantry.product.package.unit.label')}</label>
                                <input type="text" id="packageUnit" name="packageUnit" list="package-unit-list" required>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>${i18n.t('pantry.product.measurement.legend')}</legend>
                        <datalist id="measurement-unit-list">${createMeasurementUnitOptionsAsHtml()}</datalist>
                        
                        <div class="qty-unit-input-group">
                            <div>
                                <label for="baseUnit">${i18n.t('pantry.product.measurement.quantity.label')}</label>
                                <input type="number" id="baseUnit" name="baseUnit" min="1" step="any" inputmode="decimal" required>
                            </div>
                            <div>
                                <label for="baseQuantity">${i18n.t('pantry.product.measurement.unit.label')}</label>
                                <input type="text" id="baseUnit" name="baseUnit" list="measurement-unit-list" required>
                            </div>
                        </div>
                    </fieldset>
                    
                    <div class="actions justify-content-between">
                        <button type="button" id="scan-btn" class="btn btn-primary" title="${i18n.t('pantry.checkin.scan.barcode.label')}">📷</button>
                        <div class="justify-content-flex-end">
                            <button type="submit" class="btn btn-primary">${i18n.t('common.action.save')}</button>
                            <button type="button" class="btn btn-secondary" id="cancel-btn">${i18n.t('common.action.cancel')}</button>
                        </div>
                    </div>
                </form>
            </dialog>
        `;
    }
}

customElements.define('pantry-checkin-dialog', PantryCheckinDialog);