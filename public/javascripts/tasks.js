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
    const deleteTaskButtons = document.querySelectorAll('.task__add_input')

    if (deleteTaskButtons) {
        deleteButtons.forEach((button) => {
            button.addEventListener('click', handleTaskDelete(button.id));
        });
    }
};

const handleTaskAdd = () => {
    return async () => {
        const taskAddInput = document.querySelector('.task__add_input');
        const taskName = taskAddInput.value;

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ taskName }),
            });

            if (!res.ok) {
                throw res;
            }

            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    }
};

const addTaskHandler = () => {
    const addTaskButton = document.querySelector('.task__add_button');
    addTaskButton.addEventListener('click', handleTaskAdd())
};

document.addEventListener('DOMContentLoaded', async (e) => {
    try {
        addTaskHandler();
        fetchTasks();
    } catch (e) {
        console.errors(e);
    }
});
