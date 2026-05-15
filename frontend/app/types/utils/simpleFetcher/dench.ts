import type { HTTPCredentials } from "./simpleFetcher"

export interface DenchBaseConfig{
    baseURL : string,
    api : string,
    errorcallback? : (error : unknown) => void,
    options : {
        method : string,
        credentials? : HTTPCredentials,
        signal? : AbortSignal,
        headers? : Record<string, string>
    },
}

export interface DenchConfig extends DenchBaseConfig{
    abortController?: AbortController,   
    timeout? : number;
}


export interface DenchBuilder<T>{
    config : DenchBaseConfig,
    error: (callback: (error: unknown) => void) => void,
    toResponse: () => Promise<Response>

}

export interface DenchCreateBuilder<T> extends DenchBuilder<T>{
    abort: () => DenchCreateBuilder<T>,
    auth: (token:string) => DenchCreateBuilder<T>,
    credentials: (credentials : HTTPCredentials) => DenchCreateBuilder<T>,
    cors: () => DenchCreateBuilder<T>,
    timeout: (ms : number) => DenchCreateBuilder<T>,
    toFormData: () => Promise<FormData>,
    toJson: () => Promise<T>,
    toObject: () => Promise<T>
}


/**
 * GET 요청 빌더 인터페이스
 * 
 * @interface DenchGetBuilder
 */

export interface DenchGetBuilder<T> extends DenchBuilder<T>{
    abort: (controller : AbortController) => DenchGetBuilder<T>,
    auth: (token:string) => DenchGetBuilder<T>,
    timeout : (ms : number) => DenchGetBuilder<T>,
    credentials: (credentials : HTTPCredentials) => DenchGetBuilder<T>,

    toFormData: () => Promise<FormData>,
    toJson: () => Promise<T>,
    toObject: () => Promise<T>
}


/**
 *  HTTP 요청 빌더 인터페이스
 * 
 *  @interface DenchInterface
 *  @function get - GET 요청을 위한 빌더 반환
 *  @function post - POST 요청을 위한 빌더 반환
 *  @function put - PUT 요청을 위한 빌더 반환
 *  @function delete - DELETE 요청을 위한 빌더 반환
 */
export interface DenchInterface{
    baseURL : string,
    get : <T>(api:string) => DenchGetBuilder<T>
    post? : <T>(api: string, data : any) => DenchCreateBuilder<T>
    put? : <T>(api: string, data : any) => DenchCreateBuilder<T>
    delete? : <T>(api: string) => DenchGetBuilder<T>
}
