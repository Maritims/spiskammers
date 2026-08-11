import styles from '../styles/stylesheet.css?inline';
import componentStyles from './pantry-scanner-dialog.css?inline';

export class PantryScannerDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.stream = null;
        this.animFrameId = null;
        this.detector = null;
    }

    async connectedCallback() {
        this.render();

        if('BarcodeDetector' in window) {
            try {
                this.detector = new BarcodeDetector({formats: ['code_39', 'codabar', 'ean_13']});
                console.log('BarcodeDetector API supported');
            } catch (error) {
                console.error('BarcodeDetector API not supported:', error);
            }
        } else {
            console.log('BarcodeDetector API not supported in this browser');
        }

        this.shadowRoot.addEventListener('click', (event) => {
            if(event.target.classList.contains('close-btn') || event.target.tagName === 'DIALOG') {
                this.close();
            }
        });
    }

    async open() {
        const dialog = this.shadowRoot.querySelector('dialog');
        if (dialog) {
            dialog.showModal();
        }
        await this.startCamera();
    }

    close() {
        this.stopCamera();
        const dialog = this.shadowRoot.querySelector('dialog');
        if (dialog) {
            dialog.close();
        }
    }

    async startCamera() {
        const video = this.shadowRoot.querySelector('video');
        const errorMsgEl = this.shadowRoot.querySelector('.error-msg');

        if(!navigator.mediaDevices?.getUserMedia) {
            if (errorMsgEl) {
                errorMsgEl.textContent = 'Camera access is not supported by your browser.';
                return;
            }
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment'
                }
            });
            video.srcObject = this.stream;
            await video.play();
            this.scanLoop(video);
        } catch (error) {
            console.error('Error accessing camera:', error);
            if (errorMsgEl) {
                errorMsgEl.textContent = 'Error accessing camera. Please check your permissions and try again.';
            }
        }
    }

    stopCamera() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    scanLoop(video) {
        const detect = async () => {
            if(!this.stream || video.readyState !== video.HAVE_ENOUGH_DATA) {
                this.animFrameId = requestAnimationFrame(() => detect());
                return;
            }

            if (this.detector) {
                try {
                    const barcodes = await this.detector.detect(video);
                    if (barcodes.length > 0) {
                        console.log('Barcode detected:', barcodes[0]);
                        const barcode = barcodes[0];
                        if (barcode.rawValue) {
                            this.dispatchEvent(new CustomEvent('barcode-detected', {
                                detail: {code: barcode.rawValue},
                                bubbles: true,
                                composed: true
                            }));
                        }
                    }
                } catch (error) {
                }
            }

            this.animFrameId = requestAnimationFrame(() => detect());
        };

        this.animFrameId = requestAnimationFrame(detect);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${styles}
                ${componentStyles}
            </style>
            <dialog>
                <div class="scanner-container">
                    <h2>Scan Barcode</h2>
                    <video autoplay playsinline muted></video>
                    <p class="error-msg"></p>
                    <div class="actions">
                        <button type="button" id="close-btn" class="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            </dialog>
        `
    }
}

customElements.define('pantry-scanner-dialog', PantryScannerDialog);