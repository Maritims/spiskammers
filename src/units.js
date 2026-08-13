/**
 * @typedef {Object} PackageUnit
 * @property {string} name - The name of the unit.
 * @property {string} abbreviation - The abbreviation of the unit.
 */

/**
 * @readonly
 * @enum {string}
 */
export const DIMENSIONS = Object.freeze({
    MASS: 'mass',
    VOLUME: 'volume',
    COUNT: 'count'
});

/**
 * @typedef {Object} MeasurementUnit
 * @property {string} name - The name of the unit.
 * @property {string} abbreviation - The abbreviation of the unit.
 * @property {string} dimension - The dimension of the unit.
 * @property {number} factor - The factor to convert the unit to base units.
 */

/**
 * @readonly
 * @type {Object.<string, PackageUnit>}
 */
export const PACKAGE_UNITS = Object.freeze({
    BAG: {
        name: 'bag',
        abbreviation: 'bag'
    },
    BOTTLE: {
        name: 'bottle',
        abbreviation: 'btl'
    },
    BOX: {
        name: 'box',
        abbreviation: 'box'
    },
    CAN: {
        name: 'can',
        abbreviation: 'can'
    },
    JAR: {
        name: 'jar',
        abbreviation: 'jar'
    },
    PACK: {
        name: 'pack',
        abbreviation: 'pk'
    },
    PIECE: {
        name: 'piece',
        abbreviation: 'pc'
    },
    KILOGRAM: {
        name: 'kilogram',
        abbreviation: 'kg'
    },
    LITER: {
        name: 'liter',
        abbreviation: 'l'
    },
});

/**
 * @readonly
 * @type {Object.<string, MeasurementUnit>}
 */
export const MEASUREMENT_UNITS = Object.freeze({
    GRAM: {
        name: 'gram',
        abbreviation: 'g',
        dimension: DIMENSIONS.MASS,
        factor: 1
    },
    KILOGRAM: {
        name: 'kilogram',
        abbreviation: 'kg',
        dimension: DIMENSIONS.MASS,
        factor: 1000
    },
    MILLILITER: {
        name: 'milliliter',
        abbreviation: 'ml',
        dimension: DIMENSIONS.VOLUME,
        factor: 1
    },
    DECILITER: {
        name: 'deciliter',
        abbreviation: 'dl',
        dimension: DIMENSIONS.VOLUME,
        factor: 100
    },
    LITER: {
        name: 'liter',
        abbreviation: 'l',
        dimension: DIMENSIONS.VOLUME,
        factor: 1000
    },
    PIECE: {
        name: 'piece',
        abbreviation: 'pc',
        dimension: DIMENSIONS.COUNT,
        factor: 1
    }
});

/**
 * Converts a value from one measurement unit to another if they share the same dimension.
 * @param {number} value - The value to convert.
 * @param {string} fromUnitName - The name of the unit to convert from.
 * @param {string} toUnitName - The name of the unit to convert to.
 * @return {number} The converted value.
 */
export function convertMeasurementUnit(value, fromUnitName, toUnitName) {
    const findUnit = (str) => {
        const normalizedStr = str.toLowerCase();
        return Object.values(MEASUREMENT_UNITS).find(measurementUnit => measurementUnit.name === normalizedStr || measurementUnit.abbreviation === normalizedStr);
    }

    const fromUnit = findUnit(fromUnitName);
    if (!fromUnit) {
        throw new Error(`Invalid 'from' unit: ${fromUnitName}`);
    }

    const toUnit = findUnit(toUnitName);
    if (!toUnit) {
        throw new Error(`Invalid 'to' unit: ${toUnitName}`);
    }

    if (fromUnit.dimension !== toUnit.dimension) {
        throw new Error(`Cannot convert between different dimensions: ${fromUnit.dimension} and ${toUnit.dimension}`);
    }

    const baseFromValue = value * fromUnit.factor;
    return baseFromValue / toUnit.factor;
}

/**
 * Creates a list of option elements for package units as HTML.
 * @return {string} HTML string containing the option elements.
 */
export function createPackageUnitOptionsAsHtml() {
    return Object.values(PACKAGE_UNITS).map(unit => `<option label="${unit.name}" value="${unit.abbreviation}"></option>`).join('');
}

/**
 * Creates a list of option elements for measurement units as HTML.
 * @return {string} HTML string containing the option elements.
 */
export function createMeasurementUnitOptionsAsHtml() {
    return Object.values(MEASUREMENT_UNITS).map(unit => `<option label="${unit.name}" value="${unit.abbreviation}"></option>`).join('');
}