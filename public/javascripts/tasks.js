const handleTaskDelete = (taskId) => {
    return async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/taskss/${taskId}`, {
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
    const tasksContainer = document.querySelector('.')
}
