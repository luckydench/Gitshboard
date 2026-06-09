import { surfaceClass } from "~/routes/statpage";
import SectionHeading from "./SectionHeading";
import type { calculateDeveloperProfile } from "~/utils/statpage";
import EmptyState from "./EmptyState";

export interface WorkingStyleArticleProps{
    developer : ReturnType<typeof calculateDeveloperProfile>,
    isLoading : boolean;
}




export default function WorkingStyleArticle({ developer, isLoading }: WorkingStyleArticleProps){
    return(
            <article className={`${surfaceClass} p-7 md:p-8`}>
                <SectionHeading eyebrow="Development profile" title="Working style" detail="Inferred from time, stack, and topics" />
                <div className="mt-8 space-y-5">
                    {developer.profiles.slice(0, 5).map((profile) => (
                        <div key={profile.name}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="font-medium">{profile.name}</span>
                                <span className="text-gray-400">{profile.percent}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                <div className="h-full rounded-full bg-gray-950 dark:bg-white" style={{ width: `${profile.percent}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {developer.traits.map((trait) => (
                        <div key={trait.title} className="rounded-3xl bg-gray-100 p-4 dark:bg-gray-800">
                            <p className="text-sm font-semibold">{trait.title}</p>
                            <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{trait.detail}</p>
                        </div>
                    ))}
                </div>
                {!isLoading && developer.profiles.length === 0 && <EmptyState text="No developer profile data available" />}
            </article>
    )


}