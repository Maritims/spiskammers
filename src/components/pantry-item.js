import commonStyles from '../styles/stylesheet.css?inline';
import componentStyles from './pantry-item.css?inline';
import {i18n} from "../i18n";

/**
 * @typedef {CustomEvent<{stockId: number}>} UpdateStockEvent
 * @property {number} detail.stockId - The ID of the stock to update.
 */

/**
 * Dispatched when a stock increase is requested.
 *
 * @event PantryItem#IncrementStock
 * @type {UpdateStockEvent}
 */

/**
 * Dispatched when a stock decrease is requested.
 *
 * @event PantryItem#DecrementStock
 * @type {UpdateStockEvent}
 */

/**
 * A web component which displays a single pantry item. It includes a name, quantity, and buttons for incrementing and decrementing the quantity.
 * Supports swiping on smaller screens to reveal item actions.
 *
 * @element pantry-item
 */
export class PantryItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        /**
         * Horizontal starting point for a swipe action.
         *
         * @private
         * @type {number}
         */
        this._startX = 0;

        /**
         * Current horizontal position during a swipe action.

         * @type {number}
         * @private
         */
        this._currentX = 0;

        /**
         * Translated horizontal starting for a swipe action.
         *
         * @type {number}
         * @private
         */
        this._startTranslateX = 0;

        /**
         * Current swipe state.
         * @type {boolean}
         * @private
         */
        this._isSwiped = false;

        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
    }

    // noinspection JSUnusedGlobalSymbols
    static get observedAttributes() {
        return ['stock-id', 'stock-quantity', 'stock-unit', 'product-name', 'total-base-quantity', 'base-unit'];
    }

    // noinspection JSUnusedGlobalSymbols
    attributeChangedCallback() {
        this.render();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @fires PantryItem#IncrementStock - Dispatched when the deposit button is clicked.
     * @fires PantryItem#DecrementStock - Dispatched when the withdraw button is clicked.
     */
    connectedCallback() {
        this.render();
        this.shadowRoot.addEventListener('click', (event) => {
            if (event.target.classList.contains('deposit') || event.target.classList.contains('withdraw')) {
                const stockId = Number(this.getAttribute('stock-id'));
                const stockUnit = this.getAttribute('stock-unit');
                const productName = this.getAttribute('product-name');

                if (confirm(i18n.t('pantry.item.deposit-button.confirmation-message', [1, stockUnit, productName])) === false) {
                    return;
                }

                this.resetSwipe();

                if (event.target.classList.contains('deposit')) {
                    this.dispatchEvent(new CustomEvent('increment-stock', {
                        detail: {stockId},
                        bubbles: true,
                        composed: true
                    }));
                } else if (event.target.classList.contains('withdraw')) {
                    this.dispatchEvent(new CustomEvent('decrement-stock', {
                        detail: {stockId},
                        bubbles: true,
                        composed: true
                    }));
                } else {
                    throw new Error('Unknown button clicked');
                }
            }
        });

        this.shadowRoot.addEventListener('touchstart', this._onTouchStart);
        this.shadowRoot.addEventListener('touchmove', this._onTouchMove);
        this.shadowRoot.addEventListener('touchend', this._onTouchEnd);
    }

    render() {
        const stockQuantity = this.getAttribute('stock-quantity') || '';
        const stockUnit = this.getAttribute('stock-unit') || '';
        const productName = this.getAttribute('product-name') || '';
        const totalBaseQuantity = this.getAttribute('total-base-quantity') || '';
        const baseUnit = this.getAttribute('base-unit') || '';

        // noinspection CssMissingComma
        this.shadowRoot.innerHTML = `
            <style>
                ${commonStyles}
                ${componentStyles}
            </style>
            <div class="item-container">
                <div class="info">
                    <div class="text-content">
                        <span class="name">${productName}</span>
                        <span class="quantity">${stockQuantity} ${stockUnit} (${totalBaseQuantity} ${baseUnit})</span>                    
                    </div>
                    <span class="swipe-hint" aria-hidden="true">‹</span>
                </div>
                <div class="actions">
                    <button class="btn btn-success deposit" data-amount="1">${i18n.t('pantry.item.deposit-button.label')}</button>
                    <button class="btn btn-danger withdraw" data-amount="1">${i18n.t('pantry.item.withdraw-button.label')}</button>
                </div>
            </div>
        `;
    }

    /**
     * Initiates a swipe action.
     *
     * @param {TouchEvent} event
     * @private
     */
    _onTouchStart(event) {
        this._startX = event.touches[0].clientX;
        this._currentX = this._startX;

        /** @type {HTMLDivElement} */
        const actions = this.shadowRoot.querySelector('.actions');
        if (actions) {
            this._startTranslateX = this._isSwiped ? 0 : actions.offsetWidth;
        }
    }

    /**
     * Tracks a swipe action.
     *
     * @param {TouchEvent} event
     * @private
     */
    _onTouchMove(event) {
        this._currentX = event.touches[0].clientX;
        const dx = this._currentX - this._startX;
        const actions = this.shadowRoot.querySelector('.actions');

        if (actions) {
            const actionsWidth = actions.offsetWidth;
            const rawTranslate = this._startTranslateX + dx;
            const translateX = Math.min(actionsWidth, Math.max(0, rawTranslate));

            actions.style.transition = 'none';
            actions.style.transform = `translateX(${translateX}px)`;
        }
    }

    /**
     * Ends a swipe action.
     *
     * @private
     */
    _onTouchEnd() {
        const actions = this.shadowRoot.querySelector('.actions');
        if (actions) {
            actions.style.transition = 'transform 0.3s ease-out';
            const actionsWidth = actions.offsetWidth;
            const dx = this._currentX - this._startX;
            const rawTranslate = this._startTranslateX + dx;

            if (rawTranslate < actionsWidth / 2) {
                actions.style.transform = 'translateX(0)';
                this._isSwiped = true;
            } else {
                actions.style.transform = `translateX(${actionsWidth}px)`;
                this.resetSwipe();
            }
        }
    }

    /**
     * Resets the swipe state and move the actions back to their starting position.
     */
    resetSwipe() {
        const actions = this.shadowRoot.querySelector('.actions');
        if (actions) {
            actions.style.transition = 'transform 0.3s ease-out';
            actions.style.transform = 'translateX(100%)';
        }
        this._isSwiped = false;
    }
}

customElements.define('pantry-item', PantryItem);