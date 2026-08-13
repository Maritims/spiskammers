import styles from '../styles/stylesheet.css?inline';
import componentStyles from './pantry-scanner-dialog.css?inline';
import {startCameraScanner} from "../barcode";
import {i18n} from "../i18n";

export class PantryScannerDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        /**
         *
         * @type {(() => void) | null}
         */
        this.cleanupScanner = null;
        this._isStarting = false;
    }

    connectedCallback() {
        this.render();

        const dialog = this.shadowRoot.querySelector('dialog');
        if (dialog) {
            dialog.addEventListener('cancel', async (event) => {
                event.preventDefault();
                await this.close();
            });
        }

        this.shadowRoot.addEventListener('click', async (event) => {
            if (event.target.id === 'cancel-btn' || event.target.tagName === 'DIALOG') {
                await this.close();
            }
        });
    }

    async disconnectedCallback() {
        await this.stopCamera();
    }

    async open() {
        const dialog = this.shadowRoot.querySelector('dialog');
        if (dialog) {
            dialog.showModal();
        }
        await this.startCamera();
    }

    async close() {
        await this.stopCamera();
        const dialog = this.shadowRoot.querySelector('dialog');
        if (dialog) {
            dialog.close();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
                ${componentStyles}
            </style>
            <dialog>
                <div class="scanner-container">
                    <video id="video" autoplay playsinline muted></video>
                    <div class="viewfinder">
                        <div class="scan-line"></div>
                    </div>
                    <div class="actions">
                        <button type="button" id="cancel-btn" class="btn btn-secondary">${i18n.t('common.action.cancel')}</button>
                    </div>
                </div>
            </dialog>
        `;
    }

    async startCamera() {
        const videoElement = this.shadowRoot.querySelector('video');
        if (!videoElement || this._isStarting) {
            return;
        }

        this._isStarting = true;

        try {
            this.cleanupScanner = await startCameraScanner(videoElement, async (barcode) => {
                this.dispatchEvent(new CustomEvent('barcode-scanned', {
                    detail: barcode,
                    bubbles: true,
                    composed: true
                }));
                await this.close();
            });
        } catch (error) {
            console.error('Error starting camera:', error);
            this.dispatchEvent(new CustomEvent('scanner-error', {
                detail: {error: error},
                bubbles: true,
                composed: true
            }));
        } finally {
            this._isStarting = false;
        }
    }

    async stopCamera() {
        if (this.cleanupScanner) {
            this.cleanupScanner();
            this.cleanupScanner = null;
        }
    }
}

customElements.define('pantry-scanner-dialog', PantryScannerDialog);