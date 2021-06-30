const handleTaskDelete = (taskId) => {
    return async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw res;
            }

            document.querySelector(`#task-${taskId}`).remove();
        } catch (err) {
            console.error(err);
        }
    };
};

const fetchTasks = async () => {
    // GET tasks
    const res = await fetch('http://localhost:8080/api/tasks')

    if (res.status === 401) {
        window.location.href = '/login';
        return;
    }

    const { tasks } = await res.json();
    const tasksContainer = document.querySelector('.right-panel');

    const tasksHTML = tasks.map(
        ({ taskName, id }) => `
        <div class='task__container' id='task-${id}'>
          <div class='task__body'>
            <p class='task__text'>${taskName}</p>
            <button id='${id}' class='task__delete_button btn btn-secondary'>
              Delete
            </button>
          </div>
        </div>
        `
    );

    tasksContainer.innerHTML += tasksHTML.join('');

    // add event listeners to the delete buttons
    const deleteTaskButtons
}
