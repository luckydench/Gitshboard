import type { DenchConfig, DenchRunner } from "~/types/utils/simpleFetcher/dench";
import { HTTPCredentials } from "~/types/utils/simpleFetcher/denchEnum";
import type { DenchPresetsOptionalParams } from "~/types/utils/simpleFetcher/denchPreset";
import { runfetch, toFormData, toJson, toObject } from "./denchRunnter";

function deepFreezeConfig(config : DenchConfig) : DenchConfig{

    const frozenOptions = Object.freeze({
        ...config.options,
        headers : config.options.headers ? Object.freeze(config.options.headers) : undefined
    });

    return Object.freeze({
        ...config,
        options : frozenOptions
    });
}


export const createDenchPresets = (type : string, baseURL : string, optionParmas?: DenchPresetsOptionalParams) : Readonly<DenchConfig> => {

    const { api, token, data } = optionParmas || {};

    const commonConfig : Omit<DenchConfig, "options">={
        baseURL,
        api : api || ""
    }

    interface createConfigParams{
        method : string,
        auth? : string,
        acceptType? : string,
        contentType ? :string,
        credentials? : HTTPCredentials
        data? : BodyInit
    }


    const createConfig = (params : createConfigParams) :DenchConfig => {
        const { method, auth, acceptType, contentType, credentials, data } = params;
        return {
            ...commonConfig,
            options : {
                method,
                headers : {
                    //스프레드 조건문 구문을 사용하면 조건적 레코드 설정이 가능합니다.
                    ...(acceptType ? { Accept: acceptType } : {}),
                    ...(contentType ? { "Content-Type": contentType } : {}),
                    ...(auth ? { Authorization: `Bearer ${auth}` } : {})
                },
                ...(credentials ? { credentials : credentials } : {}),
                ...(data ? { body : data } : {})
            }
        }
    }



    const presets : Record<string, DenchConfig> ={
        getJson : {
            ...createConfig({ method: "GET", acceptType: "application/json" })
        },
        getAuthJson:{
            ...createConfig({ method: "GET", auth: token, acceptType: "application/json" })
        },
        getCookiesJson:{
            ...createConfig({ method: "GET", credentials: HTTPCredentials.INCLUDE, acceptType: "application/json" })
        },
        getFormData : {
            ...createConfig({ method: "GET", acceptType: "multipart/form-data" })
        },
        getAuthFormData : {
            ...createConfig({ method: "GET", auth: token, acceptType: "multipart/form-data" })
        },
        getCookiesFormData : {
            ...createConfig({ method: "GET", credentials: HTTPCredentials.INCLUDE, acceptType: "multipart/form-data" })
        },
        getBlob : {
            ...createConfig({ method: "GET", acceptType: "application/octet-stream" })
         },
        getAuthBlob : {
            ...createConfig({ method: "GET", auth: token, acceptType: "application/octet-stream" })
        },
        getCookiesBlob : {
            ...createConfig({ method: "GET", credentials: HTTPCredentials.INCLUDE, acceptType: "application/octet-stream" })
        },
        postData : {
            ...createConfig({ method: "POST", data })
        },
        postAuthData : {
            ...createConfig({ method: "POST", auth: token, data })
        },
        postCookiesData : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, data })
        },
        postJson : {
            ...createConfig({ method: "POST", acceptType: "application/json", data })
        },
        postAuthJson : {
            ...createConfig({ method: "POST", auth: token, acceptType: "application/json", data })
        },
        postCookiesJson : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, acceptType: "application/json", data })
        },
        postFormData : {
            ...createConfig({ method: "POST", acceptType: "multipart/form-data", data })
        },
        postAuthFormData : {
            ...createConfig({ method: "POST", auth: token, acceptType: "multipart/form-data", data })
        },
        postCookiesFormData : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, acceptType: "multipart/form-data", data })
        },
        postBlob : {
            ...createConfig({ method: "POST", acceptType: "application/octet-stream", data })
        },
        postAuthBlob : {
            ...createConfig({ method: "POST", auth: token, acceptType: "application/octet-stream", data })
        },
        postCookiesBlob : {
            ...createConfig({ method: "POST", credentials: HTTPCredentials.INCLUDE, acceptType: "application/octet-stream", data })
        }
    }

    const preset = presets[type];


    return deepFreezeConfig(preset);
}


export function denchPresetRunner<T>(config : DenchConfig) : DenchRunner<T>{
    return {
        toResponse : () => runfetch<T>(config),
        toJson : () => toJson<T>(config),
        toObject : () => toObject<T>(config),
        toFormData : () => toFormData<T>(config)
     }
}
