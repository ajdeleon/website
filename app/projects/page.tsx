import Link from "next/link";

export const metadata = {
  title: "Projects",
  description: "Personal Projects",
};

const projects = [{ slug: "/project1", title: "Project 1" }];

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        My Projects
      </h1>
      <ul>
        {projects.map((project) => (
          <li>
            <Link
              key={project.slug}
              className="flex flex-col space-y-1 mb-4"
              href={`/projects/${project.slug}`}
            >
              <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {project.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
