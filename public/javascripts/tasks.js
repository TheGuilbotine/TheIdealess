const handleTaskDelete = (taskId) => {
  return async () => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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

const handleTaskEdit = (taskId) => {
  return async () => {
    const taskEditInput = document.querySelector(".task__edit_input");
    console.log(taskEditInput);
    const taskName = taskEditInput.value;
    console.log(taskId, taskName);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskName }),
      });

      if (!res.ok) {
        throw res;
      }

      document.querySelector(`.task__text_${taskId}`).innerHTML = taskName;
    } catch (err) {
      console.error(err);
    }
  };
};

const renderTasks = async () => {
  // GET tasks
  console.log("Who cares anymore!!!!");
  const res = await fetch("/api/tasks");

  if (res.status === 401) {
    window.location.href = "/login";
    return;
  }

  const { tasks } = await res.json();
  console.log(tasks);
  const tasksContainer = document.querySelector(".right-panel");

  tasksContainer.innerHTML = "";

  const labelField = document.createElement("label");
  labelField.setAttribute("for", "taskName");
  tasksContainer.append(labelField);
  const inputField = document.createElement("input");
  inputField.setAttribute("name", "taskName");
  inputField.setAttribute("id", "taskName");
  inputField.type = "text";
  inputField.className = "task__add_input";
  tasksContainer.append(inputField);
  const addButton = document.createElement("button");
  addButton.className = "task__add_button";
  addButton.innerHTML = "Add task";
  tasksContainer.append(addButton);

  const editField = document.createElement("input");
  editField.setAttribute("name", "taskName");
  editField.setAttribute("id", "taskName");
  editField.type = "text";
  editField.className = "task__edit_input";
  tasksContainer.append(editField);

  const tasksHTML = tasks.map(
    // TODO Add mark checked button
    ({ taskName, id }) => `
        <div class='task__container' id='task-${id}'>
          <div class='task__body'>
            <p class='task__text_${id}'>${taskName}</p>
            <button id='${id}' class='task__delete_button btn btn-secondary'>
              Delete
            </button>
            <button id='${id}' class='task__edit_button btn btn-secondary'>
                Edit
            </button>
          </div>
        </div>
        `
  );

  tasksContainer.innerHTML += tasksHTML.join("");

  // add event listeners to the delete buttons
  const deleteTaskButtons = document.querySelectorAll(".task__delete_button");

  if (deleteTaskButtons) {
    deleteTaskButtons.forEach((button) => {
      button.addEventListener("click", handleTaskDelete(button.id));
    });
  }
  const editTaskButtons = document.querySelectorAll(".task__edit_button");

  if (editTaskButtons) {
    editTaskButtons.forEach((button) => {
      button.addEventListener("click", handleTaskEdit(button.id));
      console.log(button);
    });
  }

  await addTaskHandler();
};

const handleTaskAdd = async () => {
  const taskAddInput = document.querySelector(".task__add_input");
  const taskName = taskAddInput.value;

  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskName }),
    });

    if (!res.ok) {
      throw res;
    }

    await renderTasks();
  } catch (err) {
    console.error(err);
  }
};

const addTaskHandler = () => {
  const addTaskButton = document.querySelector(".task__add_button");
  addTaskButton.addEventListener("click", handleTaskAdd);
};

document.addEventListener("DOMContentLoaded", async (e) => {
  try {
    await renderTasks();
  } catch (e) {
    console.errors(e);
  }
});
