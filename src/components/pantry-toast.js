import styles from '../styles/stylesheet.css?inline';

export class PantryToast extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
        window.addEventListener('toast-show', (event) => {
            const {message, type, duration} = event.detail;
            this.show(message, type, duration);
        });
    }

    /**
     * Shows a toast message.
     * @param {string} message - The message to display.
     * @param {'success'|'warning'|'danger'|'info'} type - The type of toast.
     * @param {number} duration - The duration of the toast in milliseconds. If less than or equal to 0, the toast will not dismiss automatically.
     */
    show(message, type, duration) {
        const container = this.shadowRoot.querySelector('.toast-container');
        if (!container) {
            console.error('Toast container not found');
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));
        toast.addEventListener('click', () => this.dismiss(toast));

        if (duration > 0) {
            setTimeout(() => this.dismiss(toast), duration);
        }
    }

    dismiss(toast) {
        if (!toast.isConnected) {
            return;
        }
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <div class="toast-container"></div>
        `;
    }
}

customElements.define('pantry-toast', PantryToast);