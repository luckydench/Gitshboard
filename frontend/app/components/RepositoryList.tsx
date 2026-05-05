import useGithub from "~/hooks/useGithub";
import type { GithubRepo } from "~/types/GithubInfo";
import type { useGithubResult } from "~/types/hooks/useGithub";


interface GithubRepositoryResponse{
    repos : GithubRepo[];
}


export default function RepositoryList(){
    const { githubDataState, isLoading, isError } = useGithub<GithubRepositoryResponse>("/api/users/repos") as useGithubResult<GithubRepositoryResponse>;

    if(isLoading){
        return <p className="text-xl">Loading repositories...</p>;
    }

    console.log("Repository Data State:", githubDataState);

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Your Repositories</h2>
            {githubDataState?.repos.map(repo => {
                return(
                    <div key={repo.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-3 text-gray-50">
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:underline">
                            {repo.name}
                        </a>
                        <p className="text-gray-400 text-sm mt-1">{repo.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                            <span>⭐ {repo.watchers}</span>
                            <span>📝 {repo.language || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                            {repo.fork ? <span>🍴 Forked</span> : <span>🍴 Original</span>}
                        </div>
                    </div>
                )
            })}
        </section>
    )
}