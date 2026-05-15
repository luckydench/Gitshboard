import { Github } from "~/icons/Github"

export interface HeaderComponentProps{
    userDataState : {
        avatar_url : string,
        login : string
    }
    
}


export default function Header({ userDataState }: HeaderComponentProps){


    return(

        <header className="sticky top-0 z-10 bg-white/80 px-6 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-gray-950/70">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-gray-950 p-2 shadow-lg shadow-gray-950/15 dark:bg-white">
                        <div className="invert dark:invert-0">
                            <Github width={28} height={28} />
                        </div>
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Dashboard</span>
                </div>
                <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:bg-gray-900">
                    <img
                        src={userDataState.avatar_url}
                        alt="avatar"
                        fetchPriority="high"
                        className="h-8 w-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{userDataState.login}</span>
                </div>
            </div>
        </header>
    )
}
