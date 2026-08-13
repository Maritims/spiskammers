import './pantry-product-dialog';
import {test} from "../test";

test('PantryProductDialog renders correctly in edit mode', (sandbox, assert) => {
    // arrange
    const dialogEl = document.createElement('pantry-product-dialog');
    sandbox.appendChild(dialogEl);

    /** @type {Product} */
    const mockProduct = {
        ean: '7350012345678',
        name: 'Test Product',
        packageQuantity: 10,
        packageUnit: 'kg',
        baseQuantity: 10,
        baseUnit: 'kg'
    };

    // act
    dialogEl.open(mockProduct);

    const eanInput = dialogEl.shadowRoot.querySelector('input[name="ean"]');
    const nameInput = dialogEl.shadowRoot.querySelector('input[name="name"]');
    const packageQuantityInput = dialogEl.shadowRoot.querySelector('input[name="packageQuantity"]');
    const packageUnitInput = dialogEl.shadowRoot.querySelector('input[name="packageUnit"]');
    const baseQuantityInput = dialogEl.shadowRoot.querySelector('input[name="baseQuantity"]');
    const baseUnitInput = dialogEl.shadowRoot.querySelector('input[name="baseUnit"]');
    const deleteBtn = dialogEl.shadowRoot.querySelector('#delete-btn');

    // assert
    assert(`Expected EAN ${mockProduct.ean} but got ${eanInput.value}`, () => eanInput.value === mockProduct.ean);
    assert('EAN input should be read-only in edit mode', () => eanInput.readOnly === true);
    assert(`Expected name ${mockProduct.name} but got ${nameInput.value}`, () => nameInput.value === mockProduct.name);
    assert(`Expected package quantity ${mockProduct.packageQuantity} but got ${packageQuantityInput.value}`, () => Number(packageQuantityInput.value) === mockProduct.packageQuantity);
    assert(`Expected package unit ${mockProduct.packageUnit} but got ${packageUnitInput.value}`, () => packageUnitInput.value === mockProduct.packageUnit);
    assert(`Expected base quantity ${mockProduct.baseQuantity} but got ${baseQuantityInput.value}`, () => Number(baseQuantityInput.value) === mockProduct.baseQuantity);
    assert(`Expected base unit ${mockProduct.baseUnit} but got '${baseUnitInput.value}' (quotes added)`, () => baseUnitInput.value === mockProduct.baseUnit);
    assert('Delete button should be present in edit mode', () => deleteBtn !== null);

    // clean-up
    dialogEl.remove();
});

test('PantryProductDialog renders correctly in create mode', (sandbox, assert) => {
    // arrange
    const dialogEl = document.createElement('pantry-product-dialog');
    sandbox.appendChild(dialogEl);

    // act
    dialogEl.open();

    const eanInput = dialogEl.shadowRoot.querySelector('input[name="ean"]');
    const nameInput = dialogEl.shadowRoot.querySelector('input[name="name"]');
    const packageQuantityInput = dialogEl.shadowRoot.querySelector('input[name="packageQuantity"]');
    const packageUnitInput = dialogEl.shadowRoot.querySelector('input[name="packageUnit"]');
    const baseQuantityInput = dialogEl.shadowRoot.querySelector('input[name="baseQuantity"]');
    const baseUnitInput = dialogEl.shadowRoot.querySelector('input[name="baseUnit"]');
    const deleteBtn = dialogEl.shadowRoot.querySelector('#delete-btn');

    // assert
    assert('EAN input should be empty in create mode', () => eanInput.value === '');
    assert('EAN input should not be read-only in create mode', () => !eanInput.readOnly);
    assert('Name input should be empty in create mode', () => nameInput.value === '');
    assert('Package quantity input should be empty in create mode', () => packageQuantityInput.value === '');
    assert('Package unit input should be empty in create mode', () => packageUnitInput.value === '');
    assert('Base quantity input should be empty in create mode', () => baseQuantityInput.value === '');
    assert('Base unit input should be empty in create mode', () => baseUnitInput.value === '');
    assert('Delete button should not be present in create mode', () => deleteBtn === null);
});