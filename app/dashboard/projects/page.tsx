import { Project } from "@/app/lib/definitions";
import { fetchFilteredProjects, fetchProjectById } from "@/app/lib/project-actions";
import Clickable from "@/app/ui/common/clickable";
import Modal from "@/app/ui/common/modal";
import CreateProjectModal from "@/app/ui/projects/create-project-modal";
import ProjectListTile from "@/app/ui/projects/project-list-tile";
import ProjectsHeader from "@/app/ui/projects/projects-header";
import { CardsSkeleton, ProjectsListSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        projectId?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const projectId = searchParams?.projectId;
    let project: Project | null = null;

    if (projectId) {
        project = await fetchProjectById(projectId);
    }


    return (<div>
        <ProjectsHeader />
        <div className="space-y-4">
            <Suspense fallback={<ProjectsListSkeleton />}>
                <ProjectSection query={query} currentPage={currentPage} />
            </Suspense>

        </div>
        {projectId &&
            <Modal title='Update Project' isOpen={true}>
                <CreateProjectModal project={project} />
            </Modal>}
    </div>);
}


async function ProjectSection({ query, currentPage }: { query: string; currentPage: number }) {
    const projects = await fetchFilteredProjects(query, currentPage);
    return (<>
        {
            projects.map((project) => (
                <Clickable key={project.id} id={project.id}>
                    <ProjectListTile project={project} />
                </Clickable>
            ))
        }
    </>
    );
}