import styles from '../styles/stylesheet.css?inline';
import {
    createMeasurementUnitOptionsAsHtml,
    createPackageUnitOptionsAsHtml
} from "../units";
import {i18n} from "../i18n";

export class PantryCheckinEvent extends CustomEvent {
    /**
     * @param {Product} product
     * @param {keyof PackagingMap} unit
     * @param {number} quantity
     */
    constructor(product, unit, quantity) {
        super('pantry-checkin', {
            detail: {
                product,
                unit,
                quantity
            },
            bubbles: true,
            composed: true
        });
    }

    /**
     * @return {Product}
     */
    get product() {
        return this.detail.product;
    }

    /**
     * @return {keyof PackagingMap}
     */
    get unit() {
        return this.detail.unit;
    }

    /**
     * @return {number}
     */
    get quantity() {
        return this.detail.quantity;
    }
}

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

    setGtinValue(gtin) {
        const gtinInput = this.shadowRoot.querySelector('input[name="gtin"]');
        if (gtinInput) {
            gtinInput.value = gtin;
            gtinInput.dispatchEvent(new Event('blur', {bubbles: true}));
        }
    }

    // noinspection JSUnusedGlobalSymbols
    connectedCallback() {
        this.render();

        const gtinInput = this.shadowRoot.querySelector('input[name="gtin"]');
        if (gtinInput) {
            gtinInput.addEventListener('blur', (event) => {
                const gtin = event.target.value;
                if (!gtin) {
                    return;
                }

                const product = this._products.find(p => p.gtin === gtin);
                if (product) {
                    this.shadowRoot.querySelector('input[name="name"]').value = product.name;
                    this.shadowRoot.querySelector('input[name="baseUnit"]').value = product.baseUnit;
                }
            });
        }

        this.shadowRoot.addEventListener('submit', (event) => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);

            const gtin = formData.get('gtin');
            const name = formData.get('name');
            const baseUnit = formData.get('baseUnit');
            const baseQuantity = formData.get('baseQuantity');
            const packageUnit = formData.get('packageUnit');
            const packageQuantity = Number(formData.get('packageQuantity'));
            const factor = packageQuantity / baseQuantity;

            this.dispatchEvent(new PantryCheckinEvent({
                gtin,
                name,
                baseUnit,
                packaging: {
                    [packageUnit]: factor
                }
            }, packageUnit, packageQuantity));

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
            datalist.innerHTML = this._products.map(product => `<option value="${product.gtin}">${product.name}</option>`).join('');
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <dialog>
                <form method="dialog">
                    <h2>${i18n.t('pantry.checkin.title')}</h2>
                    <div class="field">
                        <label for="gtin">${i18n.t('pantry.checkin.ean.label')}</label>
                        <input type="text" id="gtin" name="gtin" list="product-list" pattern="^[0-9]{13}$">
                        <datalist id="product-list">${this._products.map(product => `<option value="${product.gtin}">${product.name}</option>`).join('')}</datalist>
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
                                <label for="baseQuantity">${i18n.t('pantry.product.measurement.quantity.label')}</label>
                                <input type="number" id="baseQuantity" name="baseQuantity" min="1" step="any" inputmode="decimal" required>
                            </div>
                            <div>
                                <label for="baseUnit">${i18n.t('pantry.product.measurement.unit.label')}</label>
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