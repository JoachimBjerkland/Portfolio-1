interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
}

document.addEventListener('DOMContentLoaded', () => {
    // Hent prosjekter fra LocalStorage hvis de finnes
    let projects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');

    function displayProjects(): void {
        const projectList = document.querySelector('.project-list ul');
        if (projectList) {
            projectList.innerHTML = '';

            projects.forEach(project => {
                const listItem = document.createElement('li');
                listItem.textContent = `${project.name} - ${project.description}`;
                projectList.appendChild(listItem);
            });
        }
    }

    function handleFormSubmit(event: Event): void {
        event.preventDefault();
        const projectName = (document.getElementById('project-name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
        const startDate = (document.getElementById('start-date') as HTMLInputElement).value;
        const endDate = (document.getElementById('end-date') as HTMLInputElement).value;

        const newProject: Project = {
            id: projects.length + 1,
            name: projectName,
            description: description,
            startDate: startDate,
            endDate: endDate
        };

        projects.push(newProject);

        // Lagre prosjektene i LocalStorage
        localStorage.setItem('projects', JSON.stringify(projects));

        displayProjects();

        (event.target as HTMLFormElement).reset();
    }

    const projectForm = document.querySelector('.project-form form');
    if (projectForm) {
        projectForm.addEventListener('submit', handleFormSubmit);
    }

    displayProjects();
});
