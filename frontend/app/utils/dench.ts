import { HTTPCredentials } from "~/types/utils/simpleFetcher/simpleFetcher"
import type { DenchConfig, DenchCreateBuilder, DenchGetBuilder, DenchInterface } from "~/types/utils/simpleFetcher/dench";
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

function credentialsConfig(config: DenchConfig): DenchConfig {
    return {
        ...config,
        options : {
            ...config.options,
            credentials : HTTPCredentials.INCLUDE
        }
    }
}

const toJson = async <T>(builder: DenchGetBuilder<T>) => {
    return runfetch<T>(builder.config).then((res) => {
        return res.json() as T;
    })
}


const error = (config: DenchConfig, callback : (error : unknown) => void) => {
    config.errorcallback = callback;
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

  

        const toObject = ()=>{
            return runfetch<T>(builder.config).then((res)=>{
                return res as unknown as T;
            })
        }

        const toFormData = ()=>{
            return runfetch<T>(builder.config).then((res)=>{
                return res.formData();
            })
        }


        const builder : DenchGetBuilder<T> = {
            config : baseConfig,
            toResponse : () => runfetch<T>(builder.config),
            toJson :  () => toJson(builder),
            toObject : toObject,
            toFormData : toFormData,
            error : (callback: (error: unknown) => void) => error(builder.config, callback),
            credentials : ()=>{
                builder.config = credentialsConfig(builder.config);
                return { ...builder };
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




    const del = <T>(api:string) : DenchGetBuilder<T> => {
        const baseConfig : DenchConfig = {
            baseURL,
            api,
            options :{
                method : 'DELETE',
            }       
        }

        const builder: DenchGetBuilder<T> = {
            config: baseConfig,
            toResponse: () => runfetch<T>(builder.config),
            error: (callback: (error: unknown) => void) => error(builder.config, callback),
            abort: (controller: AbortController) => {
                builder.config = abortConfig(builder.config, controller);
                return { ...builder };
            },
            auth: (token: string) => {
                builder.config = authConfig(builder.config, token);
                return { ...builder };
            },
             timeout: (ms: number) => {
                builder.config = timeoutConfig(builder.config, ms);
                return { ...builder };
            },
            toJson: ()=>{
                return runfetch<T>(builder.config).then((res)=>{
                    return res.json() as T;
                })
            },
            toObject: ()=>{
                return runfetch<T>(builder.config).then((res)=>{
                    return res.json() as T;
                })
            },
            toFormData: ()=>{
                return runfetch<T>(builder.config).then((res)=>{
                    return res.formData();
                })
            },
            credentials: () => {
                builder.config = credentialsConfig(builder.config);
                return { ...builder };
            }
        }

        return builder;
    }

    const post = <T>(api:string) : DenchCreateBuilder<T>=>{

        const baseConfig : DenchConfig = {
            baseURL,
            api,
            options : {
                method : 'POST',
            }
        }


        const builder : DenchCreateBuilder<T> = {
            config : baseConfig,
            credentials() {
                builder.config = credentialsConfig(builder.config);
                return { ...builder };
            },
            abort(controller : AbortController) {
                builder.config = abortConfig(builder.config, controller);
                return { ...builder };
            },
            auth(token: string) {
                builder.config = authConfig(builder.config, token);
                return { ...builder };
            },
            timeout(ms: number) {
                builder.config = timeoutConfig(builder.config, ms);
                return { ...builder };
            },
            error(callback) {
                error(builder.config, callback);
                return { ...builder };
            },
            toResponse() {
                return runfetch<T>(builder.config);
            },
            toJson() {
                return toJson(builder);
            },
            toObject() {
                return runfetch<T>(builder.config).then((res) => {
                    return res as unknown as T;
                });
            },
            toFormData() {
                return runfetch<T>(builder.config).then((res) => {
                    return res.formData();
                }); 
            },
            sendJson(data : any){
                return {
                    ...builder,
                    config : {
                        ...builder.config,
                        options : {
                            ...builder.config.options,
                            headers : {
                                ...builder.config.options.headers,
                                'Content-Type' : 'application/json'
                            },
                            body : JSON.stringify(data)
                        }
                    }
                }
            },
            sendForm(data : FormData){
                return {
                    ...builder,
                    config : {
                        ...builder.config,
                        options : {
                            ...builder.config.options,
                            body : data
                        }
                    }
                }
            },
            sendBlob(data : Blob){
                return {
                    ...builder,
                    config : {
                        ...builder.config,
                        options : {
                            ...builder.config.options,
                            body : data
                        }
                    }
                }
            }
        }

        return builder;
    }


    return {
        baseURL,
        get : get,
        delete: del,
    }
}


