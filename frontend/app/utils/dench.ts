import { HTTPCredentials } from "~/types/utils/simpleFetcher/simpleFetcher"
import type { DenchConfig, DenchCreateBuilder, DenchGetBuilder, DenchInterface, DenchRunner } from "~/types/utils/simpleFetcher/dench";
import denchfetcher from "./denchfetcher";



function runfetch<T>(config : DenchConfig) : Promise<Response>{
    return denchfetcher<T>(`${config.baseURL}${config.api}`, config);
}


/**
 * timeout 설정 
 * 
 * @param config 
 * @param ms 
 * @returns 
 */
function timeoutConfig(config : DenchConfig, ms : number) : DenchConfig {
    return {
        ...config,
        timeout : ms
    }
}

/**
 * AbortController를 통한 abort signal 설정
 * 
 * 만약 해당 DechConfig 객체를 풀에 넣어 재 사용할 계획이라면 
 * 해당 함수를 통해 다시 abort controller를 설정할 것을 권장합니다.
 * 
 * @param config 
 * @param controller 
 * @returns 
 */
function abortConfig(config : DenchConfig, controller : AbortController) : DenchConfig {
    return {
        ...config,
        abortController: controller,
        options : {
            ...config.options,
            signal : controller.signal
        }
    }
}


/**
 * 
 * 인증 토큰을 Authorization 헤더에 설정하는 함수
 * 
 * @param config 
 * @param token 
 * @returns 
 */
function authConfig(config: DenchConfig, token: string): DenchConfig {
    const header = {
        ...config.options.headers,
        'Authorization': `Bearer ${token}`
    }

    return {
        ...config,
        options: {
            ...config.options,
            headers: header
        }
    }
}

/**
 * 쿠키 기반 인증을 위한 credentials 설정 함수
 * 
 * @param config 
 * @param credentials 
 * @returns 
 */
function credentialsConfig(config: DenchConfig, credentials: HTTPCredentials): DenchConfig {
    
    return {
        ...config,
        options : {
            ...config.options,
            headers : {
                ...config.options.headers
            },
            credentials : credentials
        }
    }
}


function sendJsonConfig(config : DenchConfig) :DenchConfig{
    return{
        ...config,
        options : {
            ...config.options,
            headers :{
                ...config.options.headers,
                'Content-Type' : 'application/json'
             },
             body : JSON.stringify(config.options.body)
            }
        }
}

function sendFormConfig(config : DenchConfig) : DenchConfig {

    if(!(config.options.body instanceof FormData)){
        throw new Error("Body must be an instance of FormData when using sendForm");
    }

    return {
        ...config,
        options : {
            ...config.options,
            headers : {
                ...config.options.headers,
            },
            body : config.options.body
        }
    }
}


function sendBlobConfig(config : DenchConfig) : DenchConfig {
    return{
        ...config,
        options : {
            ...config.options,
            headers : {
                ...config.options.headers,
                'Content-Type' : 'application/octet-stream'
             },
            body : config.options.body
        }
    }
}




const toJson = async <T>(config : DenchConfig)  => {
    return runfetch<T>(config).then((res) => {
        return res.json() as T;
    })
}

const toObject = async <T>(config: DenchConfig) => {
    return runfetch<T>(config).then((res) => {
        return res as unknown as T;
    })
}


const toFormData = async <T>(config: DenchConfig) => {
    return runfetch<T>(config).then((res) => {
        return res.formData();
    }
)
}


const error = (config: DenchConfig, callback : (error : unknown) => void) => {
    config.errorcallback = callback;
}



export function denchRunner<T>(config : DenchConfig) : DenchRunner<T>{
    return {
        toResponse : () => runfetch<T>(config),
        toJson : () => toJson<T>(config),
        toObject : () => toObject<T>(config),
        toFormData : () => toFormData<T>(config)
     }
}


/**
 * Dench 빌더 함수
 * 
 * @param baseURL baseURL 
 * @param label 빌더 레이블
 * @returns 
 */
export function dench(baseURL:string, label? :string) : DenchInterface{

    const get = <T>(api :string) : DenchGetBuilder<T> => {

        const baseConfig : DenchConfig = {
            baseURL,
            api,
            options : {
                method : 'GET',
            }
        }

        const builder : DenchGetBuilder<T> = {
            config : baseConfig,
            toResponse : () => runfetch<T>(builder.config),
            toJson :  () => toJson(builder.config),
            toObject : () => toObject(builder.config),
            toFormData : () => toFormData(builder.config),
            error : (callback: (error: unknown) => void) => {
                error(builder.config, callback);
                 return { ...builder };
            },
            credentials : (credentials: HTTPCredentials)=>{
                const newBuilder : DenchGetBuilder<T> = {
                    ...builder,
                    config : credentialsConfig(builder.config, credentials)
                }
                return newBuilder;
            },
            abort : (controller : AbortController) =>{
                builder.config = abortConfig(builder.config, controller);
                return { ...builder };
            },
            auth : (token:string)=>{
                builder.config = authConfig(builder.config, token);
                return { ...builder };
            },
            timeout : (ms : number) => {
                builder.config = timeoutConfig(builder.config, ms);
                return { ...builder };
            }
        }

        return builder;
    }


    const post = <T>(api:string, data?: any) : DenchCreateBuilder<T>=>{

        const baseConfig : DenchConfig = {
            baseURL,
            api,
            options : {
                method : 'POST',
                body : data
            }
        }

        const createBuilder = <T>(config : DenchConfig) : DenchCreateBuilder<T> => ({
            config : config,
            toResponse : () => runfetch<T>(config),
            toJson :  () => toJson(config),
            toObject : ()=> toObject(config),
            toFormData : ()=>toFormData(config),
            sendJson: () =>  createBuilder<T>(sendJsonConfig(config)),
            sendForm: () => createBuilder<T>(sendFormConfig(config)),
            sendBlob: () => createBuilder<T>(sendBlobConfig(config)),
            error : (callback: (error: unknown) => void) => {
                error(config, callback);
                return createBuilder<T>(config);
            },
            credentials : (credentials: HTTPCredentials)=>{
                const newConfig = credentialsConfig(config, credentials);
                return createBuilder<T>(newConfig);
            },
            abort : (controller : AbortController) =>{
                const newConfig = abortConfig(config, controller);
                return createBuilder<T>(newConfig);
            },
            auth : (token:string)=>{
                const newConfig = authConfig(config, token);
                return createBuilder<T>(newConfig);
            },
            timeout : (ms : number) => {
                const newConfig = timeoutConfig(config, ms);
                return createBuilder<T>(newConfig); 
                }
            })

        return createBuilder<T>(baseConfig);
    }

    return {
        baseURL,
        get : get,
        post : post
    }
}
