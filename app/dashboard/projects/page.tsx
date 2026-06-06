import { fetchFilteredProjects } from "@/app/lib/project-actions";
import Modal from "@/app/ui/common/modal";
import CreateProjectModal from "@/app/ui/projects/create-project-modal";
import ProjectListTile from "@/app/ui/projects/project-list-tile";
import ProjectsHeader from "@/app/ui/projects/projects-header";

export default async function Page() {
    const projects = await fetchFilteredProjects('', 1);
    

    return (<div>
        <ProjectsHeader />
        <div className="space-y-4">
            {projects.map((project) => (
                <ProjectListTile key={project.id} project={project} />
            ))}
        </div>
    </div>);
}