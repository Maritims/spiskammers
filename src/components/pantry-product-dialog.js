import styles from '../styles/stylesheet.css?inline';
import {createMeasurementUnitOptionsAsHtml, createPackageUnitOptionsAsHtml} from "../units";
import {i18n} from "../i18n";

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
            nameInput.value = product.code;
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
                    <h2>${this.isEditing ? i18n.t('pantry.product.title.edit') : i18n.t('pantry.product.title.create')}</h2>
                    <div class="field">
                        <label for="ean">${i18n.t('pantry.product.ean.label')}</label>
                        <input type="text" id="ean" name="ean" required>
                    </div>
                    <div class="field" style="padding-block-end: 1rem; border-bottom: 1px solid #ddd;">
                        <label for="name">${i18n.t('pantry.product.name.label')}</label>
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
                    
                    <div class="actions">
                        ${this.isEditing ? `<button type="button" class="btn btn-danger" id="delete-btn">${i18n.t('common.action.delete')}</button>` : ''}
                        <div style="flex-grow: 1;"></div>
                        <button type="button" class="btn btn-secondary" id="cancel-btn">${i18n.t('common.action.cancel')}</button>
                        <button type="submit" class="btn btn-primary">${i18n.t('common.action.save')}</button>
                    </div>
                </form>
            </dialog>
        `;
    }
}

customElements.define('pantry-product-dialog', PantryProductDialog);