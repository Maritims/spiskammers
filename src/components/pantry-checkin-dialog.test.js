import './pantry-checkin-dialog';
import {describe, test} from "../test/testSuite";
import {assertEquals, assertFalse, assertTrue} from "../test/asserts";

describe('Opening and closing PantryCheckinDialog', () => {
    test('open() should open the dialog', (sandbox) => {
        // arrange
        const sut = document.createElement('pantry-checkin-dialog');
        sandbox.appendChild(sut);
        assertFalse(sut.isOpen(), () => `Dialog should not be open before calling open()`);

        // act
        sut.open();

        // assert
        assertTrue(sut.isOpen(), () => `Dialog should be open after calling open()`);
    });
    test('close() should close the dialog', (sandbox) => {
        // arrange
        const sut = document.createElement('pantry-checkin-dialog');
        sandbox.appendChild(sut);
        sut.open();
        assertTrue(sut.isOpen(), () => `Dialog should be open before calling close()`);

        // act
        sut.close();

        // assert
        assertFalse(sut.isOpen(), () => `Dialog should be closed after calling close()`);
    });
});

describe('PantryCheckinDialog', () => {
    test('Setting products should update the product list', (sandbox) => {
        // arrange
        const sut = document.createElement('pantry-checkin-dialog');
        sandbox.appendChild(sut);

        let hasCalledUpdateProductList = false;
        sut.updateProductList = () => {
            hasCalledUpdateProductList = true;
        };

        // act
        sut.products = [];

        // assert
        assertTrue(hasCalledUpdateProductList, () => `updateProductList() should be called when products are set`);
    });
    test('Setting EAN value should update the EAN input and dispatch its blur event', (sandbox) => {
        // arrange
        const sut = document.createElement('pantry-checkin-dialog');
        sandbox.appendChild(sut);

        const eanInput = sut.shadowRoot.querySelector('input[name="ean"]');
        let hasDispatchedBlurEvent = false;
        eanInput.addEventListener('blur', () => {
            hasDispatchedBlurEvent = true;
        });

        // act
        sut.setEanValue('foobar');

        // assert
        assertEquals('foobar', eanInput.value, () => `EAN input should have the expected value`);
        assertTrue(hasDispatchedBlurEvent, () => `EAN input blur event should be dispatched`);
    });
    test('Updating the product list should update the product list HTML', (sandbox) => {
        // arrange
        /** @type {PantryCheckinDialog} */
        const sut = document.createElement('pantry-checkin-dialog');
        sandbox.appendChild(sut);

        // act
        sut.products = [{
            name: 'Test Product',
            ean: '0123456789',
            packageQuantity: 1,
            packageUnit: 'kg',
            baseQuantity: 1,
            baseUnit: 'kg'
        }];

        // assert
        /** @type {HTMLDataListElement} */
        const productList = sut.shadowRoot.querySelector('#product-list');
        console.log(productList.options[0]);
        assertEquals(1, productList.options.length, () => `Product list should have one child`);
        assertEquals('Test Product', productList.options[0].innerHTML, () => `Product list option should use the product name as its label`);
        assertEquals('0123456789', productList.options[0].value, () => `Product list option should use the product EAN as its value`);
    });
});