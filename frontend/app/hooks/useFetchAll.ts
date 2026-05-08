import { useEffect, useState } from "react";
import useFetchStore from "~/stores/fetchStore";



export default function useFetchAll<T extends any[]>( config? : RequestInit, ...api_url : string[]) : 
{ dataState : T | null, isLoading : boolean, isError : boolean}{

    const [dataState, setDataState] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const {fetchMap, setFetchMap, hashydrate} = useFetchStore();

    useEffect(()=>{

        const cachedData = api_url.map((url)=>{
            const cached = fetchMap[url];

            if(!cached) return null;
            else if(cached.lastFetched + cached.staleTime < Date.now()){
                console.log(`Data for ${url} is stale. Refetching...`);
                return null;
            }

            return cached.data;
        })

        const fetchData = async()=>{
            try{
                const req = api_url.map(async(url)=>{
                    const res = await fetch(`http://localhost:3000/${url}`,
                        config ? config : {}
                    )   
                    
                    if(!res.ok){
                        throw new Error(`API request failed for ${url}: ${res.status} ${res.statusText}`);
                    }

                    return res.json();
                })

                const data = await Promise.all(req);
                 data.forEach((item, index)=>{
                     setFetchMap(api_url[index], item, 1 * 10 * 1000);
                 })
 
                console.log("Fetched data:", data);

                setDataState(data as T);
                setIsLoading(false);

            } catch (error) {
                console.error("Error fetching data:", error);
                setIsError(true);
            } 
        }

        if (!hashydrate && !fetchMap) return;
        const hasEveryData = cachedData.every(data => data !== null);

        if(hasEveryData){
            console.log("Using cached data:", cachedData);
            setDataState(cachedData as T);
            setIsLoading(false);
            return;
        }
        else{
            fetchData();
        }

    }, [hashydrate]);



    return { dataState, isLoading, isError };
}

