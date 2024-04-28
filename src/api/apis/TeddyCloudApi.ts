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

import { TagsTonieCardList, TonieCardProps } from '../../components/tonies/TonieCard';
import { TonieboxCardList, TonieboxCardProps } from '../../components/tonieboxes/TonieboxCard';


export interface ApiSetCloudCacheContentPostRequest {
    body: boolean;
}

export interface ApiUploadCertPostRequest {
    filename?: Array<Blob>;
}

/**
 * 
 */
export class TeddyCloudApi extends runtime.BaseAPI {

    /**
     * get all tonieboxes
     */
    async apiGetTonieboxesIndexRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TonieboxCardList>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/getBoxes`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);
        return new runtime.JSONApiResponse<TonieboxCardList>(response);
    }

    /**
    * get all tonieboxes
    */
    async apiGetTonieboxesIndex(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TonieboxCardProps[]> {
        const response = await this.apiGetTonieboxesIndexRaw(initOverrides);
        return (await response.value()).boxes;
    }

    /**
     * get all tags
     */
    async apiGetTagIndexRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TagsTonieCardList>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/getTagIndex`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);
        return new runtime.JSONApiResponse<TagsTonieCardList>(response);
    }
    /**
     * get all tags
     */
    async apiGetTagIndex(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TonieCardProps[]> {
        const response = await this.apiGetTagIndexRaw(initOverrides);
        return (await response.value()).tags;
    }

    /**
     * get all options
     */
    async apiGetIndexGetRaw(overlay: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<OptionsList>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        let path = `/api/settings/getIndex`;
        if (overlay != "") {
            path = path + "?overlay=" + overlay;
        }

        const response = await this.request({
            path: path,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => OptionsListFromJSON(jsonValue));
    }

    /**
     * get all options
     */
    async apiGetIndexGet(overlay: string, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<OptionsList> {
        const response = await this.apiGetIndexGetRaw(overlay, initOverrides);
        return await response.value();
    }

    /**
     * Cache cloud content on local server
     */
    async apiSetCloudCacheContentPostRaw(requestParameters: ApiSetCloudCacheContentPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body', 'Required parameter requestParameters.body was null or undefined when calling apiSetCloudCacheContentPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'text/plain';

        const response = await this.request({
            path: `/api/settings/set/cloud.cacheContent`,
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

    /**
     * upload certificates
     */
    async apiUploadCertPostRaw(requestParameters: ApiUploadCertPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<string>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters.filename) {
            requestParameters.filename.forEach((element) => {
                formParams.append('filename', element as any);
            })
        }

        const response = await this.request({
            path: `/api/uploadCert`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        if (this.isJsonMime(response.headers.get('content-type'))) {
            return new runtime.JSONApiResponse<string>(response);
        } else {
            return new runtime.TextApiResponse(response) as any;
        }
    }

    /**
     * upload certificates
     */
    async apiUploadCertPost(requestParameters: ApiUploadCertPostRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<string> {
        const response = await this.apiUploadCertPostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
