import { Project } from "@/app/lib/definitions";
import ProjectCard from "./project-card";

export default function ProjectCardList({ projects }: { projects: Project[] }) {
    return (
        <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}