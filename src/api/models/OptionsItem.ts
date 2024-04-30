/* tslint:disable */
/* eslint-disable */
/**
 * TeddyCloud API
 * OpenAPI specification for TeddyCloud Backend API
 *
 * The version of the OpenAPI document: 1.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * Option item.
 * @export
 * @interface OptionsItem
 */
export interface OptionsItem {
    /**
     * Object title
     * @type {string}
     * @memberof OptionsItem
     */
    iD: string;
    /**
     * Object shortname
     * @type {string}
     * @memberof OptionsItem
     */
    shortname: string;
    /**
     * Object description
     * @type {string}
     * @memberof OptionsItem
     */
    description: string;
    /**
     * Object label
     * @type {string}
     * @memberof OptionsItem
     */
    label: string;
    /**
     * Object type
     * @type {string}
     * @memberof OptionsItem
     */
    type: string;

    /**
     * Object value
     * @type {string}
     * @memberof OptionsItem
     */
     value: string;

     /**
      * Object value
      * @type {boolean}
      * @memberof OptionsItem
      */
      overlayed: boolean;
}

/**
 * Check if a given object implements the OptionsItem interface.
 */
export function instanceOfOptionsItem(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "iD" in value;
    isInstance = isInstance && "shortname" in value;
    isInstance = isInstance && "description" in value;
    isInstance = isInstance && "label" in value;
    isInstance = isInstance && "type" in value;
    isInstance = isInstance && "value" in value;
    isInstance = isInstance && "overlayed" in value;

    return isInstance;
}

export function OptionsItemFromJSON(json: any): OptionsItem {
    return OptionsItemFromJSONTyped(json, false);
}

export function OptionsItemFromJSONTyped(json: any, ignoreDiscriminator: boolean): OptionsItem {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'iD': json['ID'],
        'shortname': json['shortname'],
        'description': json['description'],
        'label': json['label'],
        'type': json['type'],
        'value': json['value'],
        'overlayed': json['overlayed'],
    };
}

export function OptionsItemToJSON(value?: OptionsItem | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'ID': value.iD,
        'shortname': value.shortname,
        'description': value.description,
        'label': value.label,
        'type': value.type,
        'value': value.value,
        'overlayed': value.overlayed,
    };
}

