import { Github } from "~/icons/Github"

export interface HeaderComponentProps{
    userDataState : {
        avatar_url : string,
        login : string
    }
    
}


export default function Header({ userDataState }: HeaderComponentProps){


    return(

        <header className="sticky top-0 z-10 border-b border-gray-800 bg-github-light backdrop-blur-sm px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="invert">
                        <Github width={28} height={28} />
                    </div>
                    <span className="text-white font-semibold">Dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                    <img
                        src={userDataState.avatar_url}
                        alt="avatar"
                        fetchPriority="high"
                        className="w-8 h-8 rounded-full ring-2 ring-gray-700"
                    />
                    <span className="text-sm text-gray-300">{userDataState.login}</span>
                </div>
            </div>
        </header>
    )
}