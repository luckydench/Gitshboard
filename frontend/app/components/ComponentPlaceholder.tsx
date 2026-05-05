

// 컴포넌트의 로딩 상태 표시를 위한 컴포넌트인데, 추후 사용을 위해 예시 및 저장 용으로 만들어놓은 것
export function ComponentPlaceholder(){
    return (
        <div>
           {/* Pinned Repositories (placeholder) */}
                    <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h2 className="text-white font-semibold mb-4">Pinned Repositories</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="border border-gray-700 rounded-md p-4 flex flex-col gap-2">
                                    <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3" />
                                    <div className="h-3 bg-gray-800 rounded animate-pulse w-full" />
                                    <div className="h-3 bg-gray-800 rounded animate-pulse w-4/5" />
                                    <div className="flex gap-3 mt-1">
                                        <div className="h-3 bg-gray-700 rounded animate-pulse w-12" />
                                        <div className="h-3 bg-gray-700 rounded animate-pulse w-10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Activity (placeholder) */}
                    <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0 animate-pulse" />
                                    <div className="flex flex-col gap-1 flex-1">
                                        <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4" />
                                        <div className="h-3 bg-gray-800 rounded animate-pulse w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
            </div>
    )
}