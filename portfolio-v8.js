document.addEventListener('DOMContentLoaded', () => {
    // Hent prosjekter fra LocalStorage hvis de finnes
    let projects = JSON.parse(localStorage.getItem('projects')) || [];

    function displayProjects() {
        const projectList = document.querySelector('.project-list ul');
        projectList.innerHTML = '';

        projects.forEach(project => {
            const listItem = document.createElement('li');
            listItem.textContent = `${project.name} - ${project.description}`;
            projectList.appendChild(listItem);
        });
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        const projectName = document.getElementById('project-name').value;
        const description = document.getElementById('description').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        const newProject = {
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

        event.target.reset();
    }

    const projectForm = document.querySelector('.project-form form');
    projectForm.addEventListener('submit', handleFormSubmit);

    displayProjects();
});
