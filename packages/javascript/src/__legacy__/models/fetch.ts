/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

export type Method =
    | "get"
    | "GET"
    | "delete"
    | "DELETE"
    | "head"
    | "HEAD"
    | "options"
    | "OPTIONS"
    | "post"
    | "POST"
    | "put"
    | "PUT"
    | "patch"
    | "PATCH"
    | "purge"
    | "PURGE"
    | "link"
    | "LINK"
    | "unlink"
    | "UNLINK";

export type FetchCredentials = "omit" | "same-origin" | "include";

export type FetchRedirect = "follow" | "error" | "manual";

export interface FetchRequestConfig extends RequestInit {
    method?: Method;
    url?: string;
    credentials?: FetchCredentials;
    body?: any; // FIXME: Add proper type
    bodyUsed?: boolean;
    cache?: any; // FIXME: Add proper type
    destination?: string;
    integrity?: string;
    mode?: any; // FIXME: Add proper type
    redirect?: FetchRedirect;
    referrer?: string;
    referrerPolicy?: any;
}

export interface FetchResponse<T = any> extends ResponseInit {
    body: T;
    ok: boolean;
    bodyUsed?: boolean;
    redirected?: boolean;
    type: any; // FIXME: Add proper type
    url: string;
    //TODO: Implement trailer property once the MDN docs are completed
    json();
    text();
    formData();
    blob();
    arrayBuffer();
}

export interface FetchError<T = any> extends Error {
    config: FetchRequestConfig;
    code?: string;
    request?: any;
    response?: FetchResponse<T>;
    isFetchError: boolean;
    // eslint-disable-next-line @typescript-eslint/ban-types
    toJSON: () => object;
}
