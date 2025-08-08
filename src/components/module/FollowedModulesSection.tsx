import ModuleCardSkeleton from "./ModuleCardSkeleton.tsx";
import ModuleCard from "./ModuleCard.tsx";
import {useFollowedModules, useToggleFollow} from "../../hooks/useModuleQueries.ts";
import OutlineLinkButton from "../../common/button/OutlineLinkButton.tsx";
import { useAutoAnimate } from '@formkit/auto-animate/react';

const FollowedModulesSection = () => {

    const [parent] = useAutoAnimate<HTMLDivElement>();

    const {isLoading, isError, data} = useFollowedModules();

    const toggleFollowMutation = useToggleFollow();

    const toggleFollow = async (moduleId: string) => {
        await toggleFollowMutation.mutateAsync(moduleId)

    }


    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => <ModuleCardSkeleton key={i}/>)}
                </div>
            );
        }

        if (isError) {
            return (
                <div className="text-center py-10 px-6 bg-red-50 text-red-700 rounded-lg">
                    <p>Ein Fehler ist aufgetreten.</p>
                    <p className="text-sm">Die Module konnten nicht geladen werden.</p>
                </div>
            );
        }

        if (!data || data.content.length === 0) {
            return (
                <div className="text-center py-10 px-6 bg-blue-50 text-blue-700 rounded-lg">
                    <h3 className="font-semibold">Sie folgen noch keinen Modulen.</h3>
                    <p className="mt-2 text-sm">Entdecken Sie Module und folgen Sie ihnen, um hier zu beginnen!</p>
                    <OutlineLinkButton link="/explore-modules" text="Module entdecken"/>

                </div>
            );
        }

        return (
            <div ref={parent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.content.map(module => {
                    const isTogglingThisCard = toggleFollowMutation.isPending && toggleFollowMutation.variables === module.id;

                    return (<ModuleCard key={module.id} module={module} onToggleFollow={toggleFollow}
                                        isToggling={isTogglingThisCard}/>)
                })}
            </div>
        );
    };

    return (
        <section className="py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Meine gefolgten Module</h2>
                    <p className="text-gray-500">Ihr schneller Zugriff auf Ihre Lernmaterialien.</p>
                </div>

                <OutlineLinkButton link="/explore-modules" text="Mehr entdecken" />
            </div>
            {renderContent()}
        </section>
    );
};

export default FollowedModulesSection;