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


import * as runtime from '../runtime';
import type {
  Errors,
  OptionsList,
  StatsList,
} from '../models';
import {
    ErrorsFromJSON,
    ErrorsToJSON,
    OptionsListFromJSON,
    OptionsListToJSON,
    StatsListFromJSON,
    StatsListToJSON,
} from '../models';

export interface ApiSetCloudCacheContentPostRequest {
    body: boolean;
}

/**
 * 
 */
export class TeddyCloudApi extends runtime.BaseAPI {

    /**
     * get all options
     */
    async apiGetIndexGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<OptionsList>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/getIndex`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => OptionsListFromJSON(jsonValue));
    }

    /**
     * get all options
     */
    async apiGetIndexGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<OptionsList> {
        const response = await this.apiGetIndexGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * Cache cloud content on local server
     */
    async apiSetCloudCacheContentPostRaw(requestParameters: ApiSetCloudCacheContentPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling apiSetCloudCacheContentPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'text/plain';

        const response = await this.request({
            path: `/api/set/cloud.cacheContent`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Cache cloud content on local server
     */
    async apiSetCloudCacheContentPost(requestParameters: ApiSetCloudCacheContentPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiSetCloudCacheContentPostRaw(requestParameters, initOverrides);
    }

    /**
     * Load all available stats.
     */
    async apiStatsGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<StatsList>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/stats`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StatsListFromJSON(jsonValue));
    }

    /**
     * Load all available stats.
     */
    async apiStatsGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<StatsList> {
        const response = await this.apiStatsGetRaw(initOverrides);
        return await response.value();
    }

    /**
     * tell server to write to config file
     */
    async apiTriggerWriteConfigGetRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/triggerWriteConfig`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * tell server to write to config file
     */
    async apiTriggerWriteConfigGet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.apiTriggerWriteConfigGetRaw(initOverrides);
        return await response.value();
    }

}