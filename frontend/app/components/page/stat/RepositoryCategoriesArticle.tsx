import { surfaceClass } from "~/routes/statpage";
import SectionHeading from "./SectionHeading";
import EmptyState from "./EmptyState";
import type { calculateProjectCategories } from "~/utils/statpage";



export interface RepositoryCategoriesArticleProps{
    categories : ReturnType<typeof calculateProjectCategories>,
    isLoading : boolean;
}



export default function RepositoryCategoriesArticle({ categories, isLoading }: RepositoryCategoriesArticleProps){

return(
        <article className={`${surfaceClass} p-7 md:p-8 lg:col-span-2 xl:col-span-1`}>
                <SectionHeading eyebrow="Project types" title="Repository categories" detail="Inferred from names and topics" />
                <div className="mt-8 space-y-4">
                    {categories.map((category, index) => (
                        <div
                            key={category.name}
                            className="flex items-center justify-between rounded-3xl bg-gray-100 px-5 py-4 dark:bg-gray-800"
                        >
                            <div className="flex items-center gap-3">
                                <span className={`h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-github-light" : "bg-gray-400"}`} />
                                <span className="text-sm font-semibold">{category.name}</span>
                            </div>
                            <span className="text-sm text-gray-400">{category.count} repos · {category.percent}%</span>
                        </div>
                    ))}
                </div>
                {!isLoading && categories.length === 0 && <EmptyState text="No project topic data available" />}
            </article>         
    )
}