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
        <button class="btn-fab btn-fab-right">+</button>
    `;
  }
}

customElements.define('pantry-product-fab', PantryProductFab);