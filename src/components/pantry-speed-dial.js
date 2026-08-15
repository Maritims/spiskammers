import styles from '../styles/stylesheet.css?inline';
import componentStyles from './pantry-speed-dial.css?inline';

/**
 * @typedef {Object} SpeedDialAction
 * @property {string} eventName
 * @property {string} buttonLabel
 * @property {string} icon
 */

/**
 * A web component which displays a speed dial menu containing the following actions:
 * - Open the pantry check-in dialog.
 * - Open the pantry product dialog.
 */
export class PantrySpeedDial extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        /** @type {SpeedDialAction[]} */
        this._actions = [];
    }

    /**
     * @return {SpeedDialAction[]}
     */
    get actions() {
        return this._actions;
    }

    /**
     * @param {SpeedDialAction[]} val
     * @return {void}
     */
    set actions(val) {
        this._actions = val || [];
        this.render();
    }

    connectedCallback() {
        this.render();

        this.shadowRoot.addEventListener('click', (event) => {
            const speedDial = this.shadowRoot.querySelector('#speedDial');

            const triggerEl = event.target.closest('.trigger');
            if (triggerEl) {
                event.stopPropagation();
                const isOpen = speedDial.classList.toggle('open');
                triggerEl.setAttribute('aria-expanded', String(isOpen));
                return;
            }

            const actionEl = event.target.closest('.action');
            if (actionEl) {
                const eventName = actionEl.dataset.event;
                if (!eventName) {
                    throw new Error(`Missing data-event attribute for action: ${actionEl.outerHTML}`);
                }

                this.close();

                this.dispatchEvent(new CustomEvent(eventName, {
                    bubbles: true,
                    composed: true
                }));
            }
        });
    }

    close() {
        const speedDial = this.shadowRoot.querySelector('#speedDial');
        if (speedDial) {
            speedDial.classList.remove('open');
            const trigger = speedDial.querySelector('.trigger');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
                ${componentStyles}
            </style>
            <div class="speed-dial" id="speedDial">
                <button class="trigger" aria-expanded="false" aria-label="Open the speed dial menu">➕</button>
                <div class="actions">
                    ${this._actions.map(action => `
                        <button data-event="${action.eventName}" class="action" aria-label="${action.buttonLabel}">
                            <span class="icon">${action.icon}</span>
                            <span class="label">${action.buttonLabel}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `
    }
}

customElements.define('pantry-speed-dial', PantrySpeedDial);