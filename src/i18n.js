/**
 * Defines the structure of the translation dictionary.
 * @typedef {
 * | 'i18n.locale.english'
 * | 'i18n.locale.norwegian'
 * | 'pantry.app.title'
 * | 'pantry.product.title.create'
 * | 'pantry.product.title.edit'
 * | 'pantry.product.ean.label'
 * | 'pantry.product.name.label'
 * | 'pantry.product.package.legend'
 * | 'pantry.product.package.unit.label'
 * | 'pantry.product.package.quantity.label'
 * | 'pantry.product.measurement.legend'
 * | 'pantry.product.measurement.quantity.label'
 * | 'pantry.product.measurement.unit.label'
 * | 'pantry.checkin.title'
 * | 'pantry.checkin.ean.label'
 * | 'pantry.checkin.name.label'
 * | 'pantry.checkin.package.unit.label'
 * | 'pantry.checkin.package.quantity.label'
 * | 'pantry.checkin.measurement.unit.label'
 * | 'pantry.checkin.measurement.quantity.label'
 * | 'pantry.checkin.scan.barcode.label'
 * | 'common.action.save'
 * | 'common.action.cancel'
 * | 'common.action.remove'
 * } TranslationKey
 */

/** @typedef {Record<TranslationKey, string>} TranslationDictionary */

/**
 * @typedef {Object} LocaleDefinition
 * @property {string} key - The key for the locale.
 * @property {string} emoji - The emoji associated with the locale.
 */

/** @type {Record<'en-US' | 'nb-NO', LocaleDefinition>} */
export const LOCALES = Object.freeze({
    'en-US': {
        key: 'i18n.locale.english',
        emoji: '🇺🇸'
    },
    'nb-NO': {
        key: 'i18n.locale.norwegian',
        emoji: '🇳🇴'
    },
});

/** @type {TranslationDictionary} */
const englishTranslations = {
    'i18n.locale.english': 'English',
    'i18n.locale.norwegian': 'Norwegian',
    'pantry.app.title': 'Pantry',
    'pantry.product.title.create': 'Create product',
    'pantry.product.title.edit': 'Edit product',
    'pantry.product.ean.label': 'EAN',
    'pantry.product.name.label': 'Name',
    'pantry.product.package.legend': 'Package',
    'pantry.product.package.unit.label': 'Unit',
    'pantry.product.package.quantity.label': 'Quantity',
    'pantry.product.measurement.legend': 'Measurement',
    'pantry.product.measurement.quantity.label': 'Quantity',
    'pantry.product.measurement.unit.label': 'Unit',
    'pantry.checkin.title': 'Check in item',
    'pantry.checkin.ean.label': 'EAN',
    'pantry.checkin.name.label': 'Name',
    'pantry.checkin.package.unit.label': 'Unit',
    'pantry.checkin.package.quantity.label': 'Quantity',
    'pantry.checkin.measurement.unit.label': 'Unit',
    'pantry.checkin.measurement.quantity.label': 'Quantity',
    'pantry.checkin.scan.barcode.label': 'Scan barcode',
    'common.action.save': 'Save',
    'common.action.cancel': 'Cancel',
    'common.action.remove': 'Delete',
};

/** @type {TranslationDictionary} */
const norwegianTranslations = {
    'i18n.locale.english': 'Engelsk',
    'i18n.locale.norwegian': 'Norsk',
    'pantry.app.title': 'Spiskammers',
    'pantry.product.title.create': 'Opprett produkt',
    'pantry.product.title.edit': 'Rediger produkt',
    'pantry.product.ean.label': 'EAN',
    'pantry.product.name.label': 'Navn',
    'pantry.product.package.legend': 'Pakke',
    'pantry.product.package.unit.label': 'Enhet',
    'pantry.product.package.quantity.label': 'Antall',
    'pantry.product.measurement.legend': 'Innhold pr. enhet',
    'pantry.product.measurement.quantity.label': 'Antall',
    'pantry.product.measurement.unit.label': 'Enhet',
    'pantry.checkin.title': 'Sjekk inn',
    'pantry.checkin.ean.label': 'EAN',
    'pantry.checkin.name.label': 'Navn',
    'pantry.checkin.package.unit.label': 'Enhet',
    'pantry.checkin.package.quantity.label': 'Antall',
    'pantry.checkin.measurement.unit.label': 'Enhet',
    'pantry.checkin.measurement.quantity.label': 'Antall',
    'pantry.checkin.scan.barcode.label': 'Skann strekkode',
    'common.action.save': 'Lagre',
    'common.action.cancel': 'Avbryt',
    'common.action.remove': 'Slett',
}

/** @type {Record<'en-US' | 'nb-NO', TranslationDictionary>} */
const translations = {
    'en-US': englishTranslations,
    'nb-NO': norwegianTranslations
};

class LocalizationManager extends EventTarget {

    static DEFAULT_LOCALE = 'nb-NO';

    constructor() {
        super();
        this._locale = localStorage.getItem('pantry-app-locale') || navigator.language || LocalizationManager.DEFAULT_LOCALE;
    }

    get locale() {
        return this._locale;
    }

    set locale(newLocale) {
        if (this._locale !== newLocale) {
            this._locale = newLocale;
            localStorage.setItem('pantry-app-locale', newLocale);
            this.dispatchEvent(new CustomEvent('languagechange', {
                detail: {locale: newLocale},
                bubbles: true,
                composed: true
            }));
        }
    }

    /**
     * Translate a key to the current locale. If the key is not found, it will return the key itself.
     * @param {string} key - The key to translate.
     * @return {string} The translated string, or the key itself if not found.
     */
    t(key) {
        const languageDictionary = translations[this._locale] || translations[LocalizationManager.DEFAULT_LOCALE];
        return languageDictionary[key] || key;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Add new translations to the current locale. Typically used for lazy-loading or custom modules.
     * @param {string} locale - The locale to add translations to.
     * @param {string[]} newKeys - An array of new keys to add to the locale.
     */
    addTranslations(locale, newKeys) {
        translations[locale] = {...translations[locale] || {}, ...newKeys};
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Format a number using the current locale's number formatting.'
     * @param {number} value - The number to format.
     * @param {Object} options - Options for the number formatter.
     * @return {string} The formatted number string.
     */
    formatNumber(value, options = {}) {
        return new Intl.NumberFormat(this._locale, options).format(value);
    }
}

export const i18n = new LocalizationManager();