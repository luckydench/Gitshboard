

export interface SideProfileComponentProps{
    userDataState : {
        avatar_url : string,
        login : string,
        name: string | null,
        bio: string | null,
        html_url: string,
        followers: number,
        following: number,
        company: string | null,
        location: string | null,
        email: string | null,
        blog: string | null
    }
}



export default function SideProfile({ userDataState }: SideProfileComponentProps){
    return(
        <aside className="w-64 shrink-0 flex flex-col gap-5">

            {/* Avatar */}
            <img
                src={userDataState.avatar_url}
                alt="avatar"
                className="w-full rounded-full ring-2 ring-gray-700"
            />

            {/* Name / Login */}
            <div>
                <h1 className="text-xl font-bold text-white leading-tight">
                    {userDataState.name ?? userDataState.login}
                </h1>
                <p className="text-gray-400 text-base">{userDataState.login}</p>
            </div>

            {/* Bio */}
            {userDataState.bio && (
                <p className="text-gray-300 text-sm leading-relaxed">{userDataState.bio}</p>
            )}

            {/* GitHub Profile 버튼 */}
            <a
                href={userDataState.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm py-1.5 px-4 rounded-md transition-colors"
            >
                View GitHub Profile
            </a>

            {/* Followers / Following */}
            <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>
                    <span className="font-semibold text-white">{userDataState.followers}</span>
                    {" "}followers
                </span>
                <span className="text-gray-600">·</span>
                <span>
                    <span className="font-semibold text-white">{userDataState.following}</span>
                    {" "}following
                </span>
            </div>

            {/* Detail Info */}
            <div className="flex flex-col gap-2 text-sm text-gray-400 border-t border-gray-800 pt-4">
                {userDataState.company && (
                    <div className="flex items-center gap-2">
                        <span>🏢</span>
                        <span className="truncate">{userDataState.company}</span>
                    </div>
                )}
                {userDataState.location && (
                    <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{userDataState.location}</span>
                    </div>
                )}
                {userDataState.email && (
                    <div className="flex items-center gap-2">
                        <span>✉️</span>
                        <span className="truncate">{userDataState.email}</span>
                    </div>
                )}
                {userDataState.blog && (
                    <div className="flex items-center gap-2">
                        <span>🔗</span>
                        <a
                            href={userDataState.blog}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline truncate"
                        >
                            {userDataState.blog}
                        </a>
                    </div>
                )}
            </div>
        </aside>

    )
}