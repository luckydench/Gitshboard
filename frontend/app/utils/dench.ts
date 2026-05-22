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

        const builder : DenchCreateBuilder<T> = {
            config : baseConfig,
            credentials(credentials: HTTPCredentials) {
                
                console.log("crediential builder", this);

                const newBuilder : DenchCreateBuilder<T> = {
                    ...this,
                    config : credentialsConfig(this.config, credentials)
                }

                console.log("new builder after credentials:", newBuilder);
                return newBuilder;
            },
            abort(controller : AbortController) {

                const newBuilder : DenchCreateBuilder<T> = {
                    ...this,
                    config : abortConfig(this.config, controller)
                }
                return newBuilder;
            },
            auth(token: string) {
                const newBuilder : DenchCreateBuilder<T> = {
                    ...this,
                    config : authConfig(this.config, token)
                }
                return newBuilder;
            },
            timeout(ms: number) {
                const newBuilder : DenchCreateBuilder<T> = {
                    ...this,
                    config : timeoutConfig(this.config, ms)
                }
                return newBuilder;
            },
            error(callback) {
                error(this.config, callback);
                return { ...this };
            },
            toResponse() {
                return runfetch<T>(this.config);
            },
            toJson() {
                return toJson(this);
            },
            toObject() {
                return runfetch<T>(this.config).then((res) => {
                    return res as unknown as T;
                });
            },
            toFormData() {
                return runfetch<T>(this.config).then((res) => {
                    return res.formData();
                }); 
            },
            sendJson(){
                //console.log("sendJson called with data:", data);

                const newBuilder : DenchCreateBuilder<T> = {
                    ...this,
                    config: {
                        ...this.config,
                        options: {
                            ...this.config.options,
                            headers: {
                                ...this.config.options.headers,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        }
                    }
                }

                console.log("New builder config after sendJson:", newBuilder);

                return newBuilder;
                    
            },
            sendForm(){
                return {
                    ...this,
                    config : {
                        ...this.config,
                        options : {
                            ...this.config.options,
                            body : data
                        }
                    }
                }
            },
            sendBlob(){
                return {
                    ...this,
                    config : {
                        ...this.config,
                        options : {
                            ...this.config.options,
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
        post : post
    }
}


