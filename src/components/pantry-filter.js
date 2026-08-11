import styles from '../styles/stylesheet.css?inline';
import componentStyles from './pantry-filter.css?inline';

export class PantryFilter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._categories = [];
        this._selectedCategories = new Set();
    }

    set categories(val) {
        this._categories = val || [];
        this.render();
    }

    get selectedCategory() {
        return Array.from(this._selectedCategories);
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.addEventListener('change', (event) => {
            if(event.target.type === 'checkbox') {
                const category = event.target.value;
                if (event.target.checked) {
                    this._selectedCategories.add(category);
                } else {
                    this._selectedCategories.delete(category);
                }

                this.dispatchEvent(new CustomEvent('category-filter', {
                    detail: {categories: Array.from(this._selectedCategories)},
                    bubbles: true,
                    composed: true
                }));
            }
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            ${styles}
            ${componentStyles}
        </style>
        <div class="filter-container">
            ${this._categories.map(category => `
                <label class="checkbox-label">
                    <input type="checkbox" value="${category}" ${this._selectedCategories.has(category) ? 'checked' : ''}>
                    ${category}
                </label>
            `).join('')}
        </div>
        `;
    }
}

customElements.define('pantry-filter', PantryFilter);