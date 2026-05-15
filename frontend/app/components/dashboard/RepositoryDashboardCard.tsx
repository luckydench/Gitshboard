

export interface RepositoryCardComponentProps{
    repo : {
        id : number,
        name  : string,
        description : string | null,
        html_url : string,
        watchers : number,
        language : string | null,
        fork : boolean
     }
}


export default function RepositoryDashboardCard({ repo } : RepositoryCardComponentProps){

    return(
        <a key={repo.id} href={repo.html_url}  target="_blank" rel="noopener noreferrer" className="flex flex-col bg-gray-800 border border-gray-800 rounded-lg p-4 mb-3 text-gray-50 hover:scale-105 transition-transform">
        <div className="text-lg font-bold hover:underline">
            {repo.name}
        </div>
        <p className="text-gray-400 text-sm mt-1">{repo.description ? repo.description : "No description"}</p>
        <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
            <span>⭐ {repo.watchers}</span>
            <span>📝 {repo.language || "Unknown"}</span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
            {repo.fork ? <span>Forked</span> : <span>Original</span>}
        </div>
    </a>
    )
}