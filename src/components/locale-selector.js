import styles from '../styles/stylesheet.css?inline';
import {i18n, LOCALES} from '../i18n';

export class LocaleSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._onLanguageChange = () => this.render();
    }

    connectedCallback() {
        i18n.addEventListener('languagechange', this._onLanguageChange);
        this.render();
    }

    disconnectedCallback() {
        i18n.removeEventListener('languagechange', this._onLanguageChange);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            <select id="language-select" aria-label="${i18n.t('common.select.language')}">
                ${Object.keys(LOCALES).map(localeKey => {
                    /** @type {LocaleDefinition} */
                    const localeDefinition = LOCALES[localeKey];
                    const language = i18n.t(localeDefinition.key);
                    return `<option value="${localeKey}">${localeDefinition.emoji} ${language}</option>`;
                })}
            </select>
        `;

        const select = this.shadowRoot.querySelector('select');
        select.value = i18n.locale;

        select.addEventListener('change', (event) => {
            i18n.locale = event.target.value;
        });
    }
}

customElements.define('locale-selector', LocaleSelector);