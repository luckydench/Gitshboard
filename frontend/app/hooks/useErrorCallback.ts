import { useEffect } from "react";



/**
 * 에러 콜백 훅
 * 
 * @param isError 에러 발생 여부 
 * @param callback 에러 발생 시의 콜백 함수
 */
export default function useErrorCallback(isError : boolean, callback : ()=>void){
    useEffect(()=>{
        if(isError){
            callback();
        }
    }, [isError, callback])
}