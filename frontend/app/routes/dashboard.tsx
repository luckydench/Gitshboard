import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router";
import { Loading } from "~/components/common/Loading";
import RepositoryList from "~/components/RepositoryList";
import useFetchAll from "~/hooks/useFetchAll";
import { Github } from "~/icons/Github";
import type { GithubRepositoryResponse, GithubUserResponse } from "~/types/GithubInfo";
import useRenderingTimer from "~/hooks/dev/useRenderingTimer";
import simpleFetcher from "~/utils/simpleFetcher";
import { fetchFactory } from "~/utils/simpleFetcherFactory";
import { HTTPCredentials } from "~/types/utils/simpleFetcher/simpleFetcher";
import { dench } from "~/utils/dench";
import Header from "~/components/common/Header";
import SideProfile from "~/components/dashboard/SideProfile";
import StatCard from "~/components/dashboard/StatCard";


export default function Dashboard(){
    const {dataState, isLoading, isError} = useFetchAll<[GithubUserResponse, GithubRepositoryResponse]>({
        method : 'GET',
        credentials : 'include'
    }, 5 * 60 * 1000, "api/users", "api/users/repos") 
    const navigate = useNavigate();

    const render_time = useRenderingTimer("Dashboard", isLoading);
    const [testState, setTestState] = useState<GithubUserResponse>({} as GithubUserResponse); 
    const fetcherRef = useRef(fetchFactory("http://localhost:3000/", undefined, HTTPCredentials.INCLUDE));


    useEffect(()=>{
        
        const testFetch = async()=>{
            try{
                const fetcher = fetcherRef.current;
                const data2 = fetcher.get<GithubUserResponse>("api/users").then((data)=>{
                    console.log("Data from fetch factory:", data);
                }).catch((error)=>{
                    console.error("Error in fetch factory:", error);
                });

                console.log("Data from fetch factory (before await):", data2);               

                const data =  await simpleFetcher<GithubUserResponse>(
                    "http://localhost:3000/api/users", 
                    {
                        method : 'GET',
                        credentials : 'include'
                    }
                )
                setTestState(data!);
                console.log("Test fetch data:", data);
            }catch(error){
                console.error("Error in test fetch:", error);
            }
        }
        

        const testFetch2 = async()=>{
            const controller= new AbortController();

            const preset = dench("http://localhost:3000/")
            .get<GithubUserResponse>("api/users")
            .credentials(HTTPCredentials.INCLUDE)
            .abort(controller)
            .timeout(5000);
            console.log("Preset config:", preset);

            const data = await preset.toJson();



            console.log("Data from dench:", data);
        }

        testFetch();
        
        testFetch2();
    },[])



    useEffect(()=>{
        if(isError){
            navigate("/");
        }
    }, [isError, navigate]);


    if (isLoading) {
        return (
            <Loading/>
        );
    }

    const userDataState = dataState![0].user;
    const reposDataState = dataState![1];


    return (
        <div className="min-h-screen">

            <Header userDataState={userDataState} />

            {/* Body */}
            <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
                <SideProfile userDataState={userDataState} />

                {/* ── Right Main Content ── */}
                <main className="flex-1 flex flex-col gap-6 min-w-0">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <StatCard anyState={userDataState.followers} />
                        <StatCard anyState={userDataState.following} />
                        <StatCard anyState={reposDataState.repos.length} />
                    </div>
                    {/* Repository List */}
                    <RepositoryList githubDataState={reposDataState} isLoading={isLoading} isError={isError} />
                </main>
            </div>

        </div>
    );
}