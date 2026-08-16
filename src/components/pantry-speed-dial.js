import styles from '../styles/stylesheet.css?inline';
import componentStyles from './pantry-speed-dial.css?inline';

/**
 * @typedef {Object} SpeedDialAction
 * @property {string} action - The name of the action.
 * @property {string} buttonLabel - The label for the action button.
 * @property {string} icon - The icon for the action button.
 */

/**
 * @typedef {Object} SpeedDialClickEventDetail
 * @property {string} action - The name of the action that was clicked.
 */

/**
 * Custom event class for pantry speed dial events.
 */
export class PantrySpeedDialEvent extends CustomEvent {
    /**
     * @param {string} action - The name of the action that was clicked.
     * @param {CustomEventInit<SpeedDialClickEventDetail>} [options] - Additional custom event options.
     */
    constructor(action, options) {
        super('speed-dial-click', {
            detail: {action},
            ...options,
            bubbles: true,
            composed: true,
        });
    }

    /**
     * The name of the action that was clicked.
     * @return {string}
     */
    get action() {
        /** @type {SpeedDialClickEventDetail} */
        const detail = this.detail;
        return detail.action;
    }
}

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
     * @param {SpeedDialAction[]} val
     * @return {void}
     */
    set actions(val) {
        this._actions = val || [];
        this.render();
    }

    // noinspection JSUnusedGlobalSymbols
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
                const action = actionEl.dataset.event;
                if (!action) {
                    throw new Error(`Missing data-event attribute for action: ${actionEl.outerHTML}`);
                }

                this.close();

                this.dispatchEvent(new PantrySpeedDialEvent(action));
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
        // noinspection CssMissingComma
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
                ${componentStyles}
            </style>
            <div class="speed-dial" id="speedDial">
                <button class="trigger" aria-expanded="false" aria-label="Open the speed dial menu">➕</button>
                <div class="actions">
                    ${this._actions.map(action => `
                        <button data-event="${action.action}" class="action" aria-label="${action.buttonLabel}">
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