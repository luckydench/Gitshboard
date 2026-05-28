import { useQuery } from "@tanstack/react-query";
import {useRef} from "react";
import { dench, DenchInstancePreset } from "~/dench/denchfetch/dench";
import { HTTPCredentials } from "~/dench/types/denchEnum";
import useRegistLoading from "~/hooks/dev/useRegistLoading";
import type { TestResponse } from "~/routes/testpage";



export default function TanstackComponent(){
    
    const denchInstance = useRef(dench("http://localhost:3000/api/", "3000 test"));

    const { data, error, isLoading } = useQuery<TestResponse>({
        queryKey: ["tanstackTest"],
        queryFn: async () => {
            const dench = denchInstance.current;
            const response = await dench.get<TestResponse>("testing/authjson")
                .credentials(HTTPCredentials.INCLUDE)
                .toJson();
            return response;
        },
        staleTime: 1000 * 60, // 1 minute
    });        

    useRegistLoading("TanstackComponent", isLoading);


    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {data && (
                <div>
                    <h2>Tanstack Component</h2>
                    <div> name : {data.name}</div>
                    <div> timestamp : {data.timestamp}</div>
                    <div> description : {data.description}</div>
                </div>
            )}
        </>
    )
}