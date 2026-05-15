import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router";
import { Loading } from "~/components/common/Loading";
import RepositoryList from "~/components/RepositoryList";
import useFetchAll from "~/hooks/useFetchAll";
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
        <div className="min-h-screen bg-[#f4f6f1] text-gray-950 dark:bg-gray-950">

            <Header userDataState={userDataState} />

            <div className="mx-auto grid max-w-380 gap-8 px-6 py-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
                <SideProfile userDataState={userDataState} />

                <main className="flex min-w-0 flex-col gap-8">
                    <section className="rounded-[2.25rem] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.10)] dark:bg-gray-900">
                        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                            <div className="max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
                                    GitHub Overview
                                </p>
                                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-950 dark:text-white md:text-5xl">
                                    {userDataState.name ?? userDataState.login}'s workspace
                                </h1>
                                <p className="mt-5 text-base leading-7 text-gray-500 dark:text-gray-400">
                                    Profile activity, repository scale, and account signals are arranged with more breathing room for quick scanning.
                                </p>
                            </div>
                            <div className="rounded-3xl bg-[#eef4ff] px-6 py-5 text-right shadow-inner dark:bg-gray-800">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">Account</p>
                                <p className="mt-2 text-lg font-semibold text-gray-950 dark:text-white">@{userDataState.login}</p>
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-5 md:grid-cols-3">
                        <StatCard label="Followers" value={userDataState.followers} caption="People watching your updates" />
                        <StatCard label="Following" value={userDataState.following} caption="Accounts in your network" />
                        <StatCard label="Repos" value={reposDataState.repos.length} caption="Repositories available here" />
                    </div>

                    <RepositoryList githubDataState={reposDataState} isLoading={isLoading} isError={isError} />
                </main>
            </div>

        </div>
    );
}
