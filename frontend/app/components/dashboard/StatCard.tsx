
export interface StatCardProps{
    anyState : number
}


export default function StatCard( { anyState } : StatCardProps){
    return(
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Followers</p>
        <p className="text-3xl font-bold text-white">{anyState}</p>
    </div>
    )
}