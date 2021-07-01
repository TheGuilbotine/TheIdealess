const createInput = (tagName, className, container, label = '', type = 'text') => {
  const labelTag = `
    <label for='${tagName}'>${label}</label>
  `;
  container.innerHTML += labelTag;
  const inputTag = `
    <input type='${type}' name='${tagName}' id='${tagName}' class='${className}'>
  `;
  container.innerHTML += inputTag;
};

const createSelect = (tagName, className, resources, container, label = '') => {
  const labelTag = `
    <label for='${tagName}'>${label}</label>
  `;
  container.innerHTML += labelTag;

  let selectTag = `
    <select name='${tagName}' id='${tagName}' class='${className}'>
  `;
  
  resources.forEach(({ listName, id }) => {

    const optionTag = `
      <option value='${id}'>${listName}</option>
    `;
    selectTag += optionTag;
  });
  selectTag += '</select>';

  container.innerHTML += selectTag;
};

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
    const taskEditName = taskEditInput.value;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskName: taskEditName }),
      });

      if (!res.ok) {
        throw res;
      }

      document.querySelector(`.task__text_${taskId}`).innerHTML = taskEditName;
    } catch (err) {
      console.error(err);
    }
  };
};

const renderTasks = async () => {
  // GET tasks
  const res = await fetch("/api/tasks");

  if (res.status === 401) {
    window.location.href = "/login";
    return;
  }

  const { tasks } = await res.json();
  const tasksContainer = document.querySelector(".right-panel");
  
  tasksContainer.innerHTML = "";
  
  createInput("taskAddName", "task__add_input", tasksContainer);
  
  const addButton = document.createElement("button");
  addButton.className = "task__add_button";
  addButton.innerHTML = "Add task";
  tasksContainer.append(addButton);
  
  createInput("taskEditName", "task__edit_input", tasksContainer);
  
  // get the lists
  const resLists = await fetch("/api/lists");
  const { lists } = await resLists.json();

  createSelect("taskSelectList", "task__select_list", lists, tasksContainer);

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
      body: JSON.stringify({ taskName: taskAddName }),
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
