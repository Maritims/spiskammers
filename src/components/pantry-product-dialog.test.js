import './pantry-product-dialog';
import {assertEquals, assertFalse, assertNotNull, assertNull, assertTrue} from "../test/asserts";
import {anyNumber, anyString} from "../test/argumentMatchers";
import {describe, test} from "../test/testSuite";

describe('PantryProductDialog in edit mode', () => {
    test('EAN input contains expected value and is read-only in edit mode', (sandbox) => {
        // arrange
        const expected = '7350012345678';
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open({
            ean: expected,
            name: anyString(),
            packageQuantity: anyNumber(),
            packageUnit: anyString(),
            baseQuantity: anyNumber(),
            baseUnit: anyString()
        });
        const eanInputEl = dialogEl.shadowRoot.querySelector('input[name="ean"]');
        const actual = eanInputEl.value;

        // assert
        assertEquals(expected, actual, () => `EAN input has an unexpected value`);
        assertTrue(eanInputEl.readOnly, () => `EAN input should be read-only in edit mode`);
    });
    test('Name input contains expected value in edit mode', (sandbox) => {
        // arrange
        const expected = 'Test Product';
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open({
            ean: anyString(),
            name: expected,
            packageQuantity: anyNumber(),
            packageUnit: anyString(),
            baseQuantity: anyNumber(),
            baseUnit: anyString()
        });
        const nameInputEl = dialogEl.shadowRoot.querySelector('input[name="name"]');

        // assert
        assertEquals(expected, nameInputEl.value, () => `Name input has an unexpected value`);
    });
    test('Package quantity input contains expected value in edit mode', (sandbox) => {
        // arrange
        const expected = 10;
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open({
            ean: anyString(),
            name: anyString(),
            packageQuantity: expected,
            packageUnit: anyString(),
            baseQuantity: anyNumber(),
            baseUnit: anyString()
        });
        const packageQuantityInputEl = dialogEl.shadowRoot.querySelector('input[name="packageQuantity"]');

        // assert
        assertEquals(expected, packageQuantityInputEl.valueAsNumber, () => `Package quantity input has an unexpected value`);
    });
    test('Package unit input contains expected value in edit mode', (sandbox) => {
        // arrange
        const expected = 'kg';
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open({
            ean: anyString(),
            name: anyString(),
            packageQuantity: anyNumber(),
            packageUnit: expected,
            baseQuantity: anyNumber(),
            baseUnit: anyString()
        });
        const packageUnitInputEl = dialogEl.shadowRoot.querySelector('input[name="packageUnit"]');

        // assert
        assertEquals(expected, packageUnitInputEl.value, () => `Package unit input has an unexpected value`);
    });
    test('Base quantity input contains expected value in edit mode', (sandbox) => {
        // arrange
        const expected = 10;
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open({
            ean: anyString(),
            name: anyString(),
            packageQuantity: anyNumber(),
            packageUnit: anyString(),
            baseQuantity: expected,
            baseUnit: anyString()
        });
        const baseQuantityInputEl = dialogEl.shadowRoot.querySelector('input[name="baseQuantity"]');

        // assert
        assertEquals(expected, baseQuantityInputEl.valueAsNumber, () => `Base quantity input has an unexpected value`);
    });
    test('Base unit input contains expected value in edit mode', (sandbox) => {
        // arrange
        const expected = 'kg';
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open({
            ean: anyString(),
            name: anyString(),
            packageQuantity: anyNumber(),
            packageUnit: anyString(),
            baseQuantity: anyNumber(),
            baseUnit: expected
        });
        const baseUnitInputEl = dialogEl.shadowRoot.querySelector('input[name="baseUnit"]');

        // assert
        assertEquals(expected, baseUnitInputEl.value, () => `Base unit input has an unexpected value`);
    });
    test('Delete button is present in edit mode', (sandbox) => {
        // arrange
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open({
            ean: anyString(),
            name: anyString(),
            packageQuantity: anyNumber(),
            packageUnit: anyString(),
            baseQuantity: anyNumber(),
            baseUnit: anyString()
        });
        const deleteBtn = dialogEl.shadowRoot.querySelector('#delete-btn');

        // assert
        assertNotNull(deleteBtn, () => `Delete button should be present in edit mode`);
    })
});
describe('PantryProductDialog in create mode', () => {
    test('EAN input is empty and writable in create mode', (sandbox) => {
        // arrange
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open();
        const eanInputEl = dialogEl.shadowRoot.querySelector('input[name="ean"]');
        const actual = eanInputEl.value;

        // assert
        assertEquals('', actual, () => `EAN input should be empty in create mode`);
    });
    test('Name input is empty in create mode', (sandbox) => {
        // arrange
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open();
        const nameInputEl = dialogEl.shadowRoot.querySelector('input[name="name"]');
        const actual = nameInputEl.value;

        // assert
        assertEquals('', actual, () => `Name input should be empty in create mode`);
    });
    test('Package quantity input is empty in create mode', (sandbox) => {
        // arrange
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open();
        const packageQuantityInputEl = dialogEl.shadowRoot.querySelector('input[name="packageQuantity"]');
        const actual = packageQuantityInputEl.value;

        // assert
        assertEquals('', actual, () => `Package quantity input should be empty in create mode`);
    });
    test('Package unit input is empty in create mode', (sandbox) => {
        // arrange
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open();
        const packageUnitInputEl = dialogEl.shadowRoot.querySelector('input[name="packageUnit"]');
        const actual = packageUnitInputEl.value;

        // assert
        assertEquals('', actual, () => `Package unit input should be empty in create mode`);
    });
    test('Base quantity input is empty in create mode', (sandbox) => {
        // arrange
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open();
        const baseQuantityInputEl = dialogEl.shadowRoot.querySelector('input[name="baseQuantity"]');
        const actual = baseQuantityInputEl.value;

        // assert
        assertEquals('', actual, () => `Base quantity input should be empty in create mode`);
    });
    test('Delete button is not present in create mode', (sandbox) => {
        // arrange
        const dialogEl = document.createElement('pantry-product-dialog');
        sandbox.appendChild(dialogEl);

        // act
        dialogEl.open();
        const deleteBtn = dialogEl.shadowRoot.querySelector('#delete-btn');

        // assert
        assertNull(deleteBtn, () => `Delete button should not be present in create mode`);
    });
});
describe('Opening and closing PantryProductDialog', () => {
    test('open() should open the dialog', (sandbox) => {
        // arrange
        const sut = document.createElement('pantry-product-dialog');
        sandbox.appendChild(sut);
        assertFalse(sut.isOpen(), () => `Dialog should not be open before calling open()`);

        // act
        sut.open();

        // assert
        assertTrue(sut.isOpen(), () => `Dialog should be open after calling open()`);
    });
    test('close() should close the dialog', (sandbox) => {
        // arrange
        const sut = document.createElement('pantry-product-dialog');
        sandbox.appendChild(sut);
        sut.open();
        assertTrue(sut.isOpen(), () => `Dialog should be open before calling close()`);

        // act
        sut.close();

        // assert
        assertFalse(sut.isOpen(), () => `Dialog should be closed after calling close()`);
    });
});