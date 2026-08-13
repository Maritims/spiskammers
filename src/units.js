/**
 * @typedef {Object} PackageUnit
 * @property {string} code - The unit code.
 */

import {i18n} from "./i18n";

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
 * @property {string} code - The unit code.
 * @property {string} dimension - The dimension of the unit.
 * @property {number} factor - The factor to convert the unit to base units.
 */

/**
 * @readonly
 * @type {Object.<string, PackageUnit>}
 */
export const PACKAGE_UNITS = Object.freeze({
    BAG: {
        code: 'bag',
    },
    BOTTLE: {
        code: 'bottle',
    },
    BOX: {
        code: 'box'
    },
    CAN: {
        code: 'can'
    },
    JAR: {
        code: 'jar'
    },
    PACK: {
        code: 'pack'
    },
    PIECE: {
        code: 'piece',
    },
});

/**
 * @readonly
 * @type {Object.<string, MeasurementUnit>}
 */
export const MEASUREMENT_UNITS = Object.freeze({
    GRAM: {
        code: 'gram',
        dimension: DIMENSIONS.MASS,
        factor: 1
    },
    KILOGRAM: {
        code: 'kilogram',
        dimension: DIMENSIONS.MASS,
        factor: 1000
    },
    MILLILITER: {
        code: 'milliliter',
        dimension: DIMENSIONS.VOLUME,
        factor: 1
    },
    DECILITER: {
        code: 'deciliter',
        dimension: DIMENSIONS.VOLUME,
        factor: 100
    },
    LITER: {
        code: 'liter',
        dimension: DIMENSIONS.VOLUME,
        factor: 1000
    },
    PIECE: {
        code: 'piece',
        dimension: DIMENSIONS.COUNT,
        factor: 1
    }
});

// noinspection JSUnusedGlobalSymbols
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
        return Object.values(MEASUREMENT_UNITS).find(measurementUnit => measurementUnit.code === normalizedStr || measurementUnit.abbreviation === normalizedStr);
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
    return Object.values(PACKAGE_UNITS).map(unit => `<option label="${unit.code}" value="${i18n.t(`package.unit.${unit.code}.long`)}"></option>`).join('');
}

/**
 * Creates a list of option elements for measurement units as HTML.
 * @return {string} HTML string containing the option elements.
 */
export function createMeasurementUnitOptionsAsHtml() {
    return Object.values(MEASUREMENT_UNITS).map(unit => `<option label="${unit.code}" value="${i18n.t(`measurement.unit.${unit.code}.long`)}"></option>`).join('');
}