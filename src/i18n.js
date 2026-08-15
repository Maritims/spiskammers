/**
 * Defines the structure of the translation dictionary.
 * @typedef {
 * | 'i18n.locale.english'
 * | 'i18n.locale.norwegian'
 * | 'pantry.app.title'
 * | 'package.unit.bag.short'
 * | 'package.unit.bag.long'
 * | 'package.unit.bottle.short',
 * | 'package.unit.bottle.long',
 * | 'package.unit.box.short'
 * | 'package.unit.box.long'
 * | 'package.unit.can.short'
 * | 'package.unit.can.long'
 * | 'package.unit.jar.short'
 * | 'package.unit.jar.long'
 * | 'package.unit.pack.short'
 * | 'package.unit.pack.long'
 * | 'package.unit.piece.short'
 * | 'package.unit.piece.long'
 * | 'measurement.unit.gram.short'
 * | 'measurement.unit.gram.long'
 * | 'measurement.unit.kilogram.short'
 * | 'measurement.unit.kilogram.long'
 * | 'measurement.unit.milliliter.short'
 * | 'measurement.unit.milliliter.long'
 * | 'measurement.unit.deciliter.short'
 * | 'measurement.unit.deciliter.long'
 * | 'measurement.unit.liter.short'
 * | 'measurement.unit.liter.long'
 * | 'measurement.unit.piece.short'
 * | 'measurement.unit.piece.long'
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
 * | 'pantry.product.notification.product-create'
 * | 'pantry.product.notification.product-update'
 * | 'pantry.product.notification.product-delete'
 * | 'pantry.checkin.title'
 * | 'pantry.checkin.ean.label'
 * | 'pantry.checkin.name.label'
 * | 'pantry.checkin.package.unit.label'
 * | 'pantry.checkin.package.quantity.label'
 * | 'pantry.checkin.measurement.unit.label'
 * | 'pantry.checkin.measurement.quantity.label'
 * | 'pantry.checkin.scan.barcode.label'
 * | 'pantry.checkin.notification.item-checkin'
 * | 'pantry.checkin.notification.item-checkout'
 * | 'common.action.save'
 * | 'common.action.cancel'
 * | 'common.action.remove'
 * | 'common.error.invalid-value'
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
    'package.unit.bag.short': 'bag',
    'package.unit.bag.long': 'bag',
    'package.unit.bottle.short': 'btl',
    'package.unit.bottle.long': 'bottle',
    'package.unit.box.short': 'box',
    'package.unit.box.long': 'box',
    'package.unit.can.short': 'can',
    'package.unit.can.long': 'can',
    'package.unit.jar.short': 'jar',
    'package.unit.jar.long': 'jar',
    'package.unit.pack.short': 'pk',
    'package.unit.pack.long': 'pack',
    'package.unit.piece.short': 'pc',
    'package.unit.piece.long': 'piece',
    'measurement.unit.gram.short': 'g',
    'measurement.unit.gram.long': 'gram',
    'measurement.unit.kilogram.short': 'kg',
    'measurement.unit.kilogram.long': 'kilogram',
    'measurement.unit.milliliter.short': 'ml',
    'measurement.unit.milliliter.long': 'milliliter',
    'measurement.unit.deciliter.short': 'dl',
    'measurement.unit.deciliter.long': 'deciliter',
    'measurement.unit.liter.short': 'l',
    'measurement.unit.liter.long': 'liter',
    'measurement.unit.piece.short': 'pc',
    'measurement.unit.piece.long': 'pieces',
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
    'pantry.product.notification.product-create': 'Product created successfully',
    'pantry.product.notification.product-update': 'Product updated successfully',
    'pantry.product.notification.product-delete': 'Product deleted successfully',
    'pantry.checkin.title': 'Check in item',
    'pantry.checkin.ean.label': 'EAN',
    'pantry.checkin.name.label': 'Name',
    'pantry.checkin.package.unit.label': 'Unit',
    'pantry.checkin.package.quantity.label': 'Quantity',
    'pantry.checkin.measurement.unit.label': 'Unit',
    'pantry.checkin.measurement.quantity.label': 'Quantity',
    'pantry.checkin.scan.barcode.label': 'Scan barcode',
    'pantry.checkin.notification.item-checkin': 'Item checked in successfully',
    'pantry.checkin.notification.item-checkout': 'Item checked out successfully',
    'common.action.save': 'Save',
    'common.action.cancel': 'Cancel',
    'common.action.remove': 'Delete',
    'common.error.invalid-value': 'Invalid value',
};

/** @type {TranslationDictionary} */
const norwegianTranslations = {
    'i18n.locale.english': 'Engelsk',
    'i18n.locale.norwegian': 'Norsk',
    'package.unit.bag.short': 'pose',
    'package.unit.bag.long': 'pose',
    'package.unit.bottle.short': 'fl',
    'package.unit.bottle.long': 'flaske',
    'package.unit.box.short': 'eske',
    'package.unit.box.long': 'eske',
    'package.unit.can.short': 'boks',
    'package.unit.can.long': 'boks',
    'package.unit.jar.short': 'glass',
    'package.unit.jar.long': 'glass',
    'package.unit.pack.short': 'pk',
    'package.unit.pack.long': 'pakke',
    'package.unit.piece.short': 'pc',
    'package.unit.piece.long': 'piece',
    'measurement.unit.gram.short': 'g',
    'measurement.unit.gram.long': 'gram',
    'measurement.unit.kilogram.short': 'kg',
    'measurement.unit.kilogram.long': 'kilogram',
    'measurement.unit.milliliter.short': 'ml',
    'measurement.unit.milliliter.long': 'milliliter',
    'measurement.unit.deciliter.short': 'dl',
    'measurement.unit.deciliter.long': 'desiliter',
    'measurement.unit.liter.short': 'l',
    'measurement.unit.liter.long': 'liter',
    'measurement.unit.piece.short': 'stk',
    'measurement.unit.piece.long': 'stykk',
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
    'pantry.product.notification.product-create': 'Produkt opprettet',
    'pantry.product.notification.product-update': 'Produkt oppdatert',
    'pantry.product.notification.product-delete': 'Produkt slettet',
    'pantry.checkin.title': 'Sjekk inn',
    'pantry.checkin.ean.label': 'EAN',
    'pantry.checkin.name.label': 'Navn',
    'pantry.checkin.package.unit.label': 'Enhet',
    'pantry.checkin.package.quantity.label': 'Antall',
    'pantry.checkin.measurement.unit.label': 'Enhet',
    'pantry.checkin.measurement.quantity.label': 'Antall',
    'pantry.checkin.scan.barcode.label': 'Skann strekkode',
    'pantry.checkin.notification.item-checkin': 'Innhold sjekket inn',
    'pantry.checkin.notification.item-checkout': 'Innhold sjekket ut',
    'common.action.save': 'Lagre',
    'common.action.cancel': 'Avbryt',
    'common.action.remove': 'Slett',
    'common.error.invalid-value': 'Ugyldig verdi',
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
     * @param {TranslationKey} key - The key to translate.
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