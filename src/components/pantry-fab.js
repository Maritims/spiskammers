import commonStyles from '../styles/stylesheet.css?inline';

export class PantryFab extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('fab-click', {
                bubbles: true,
                composed: true
            }));
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${commonStyles}</style>
            <button class="btn btn-circle btn-circle-lg btn-success position-fixed bottom">+</button>
        `;
    }
}

customElements.define('pantry-fab', PantryFab);