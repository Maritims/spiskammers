import commonStyles from '../styles/stylesheet.css?inline';

export class PantryProductFab extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
      this.render();
      this.shadowRoot.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('product-fab-click', {
              bubbles: true,
              composed: true
          }));
      });
  }

  render() {
      this.shadowRoot.innerHTML = `
        <style>${commonStyles}</style>
        <button class="btn btn-success btn-circle btn-circle-lg position-fixed bottom right">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 5v14M21 5v14M8 5v14M12 5v14M16 5v14"></path>
            </svg>
        </button>
    `;
  }
}

customElements.define('pantry-product-fab', PantryProductFab);