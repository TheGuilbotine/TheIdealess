import { createInput, createSelectList, createDiv } from './utils.js';

const createSelectTaskType = (tagName, className, resources, container, label = '') => {
  const labelTag = `
    <label for='${tagName}'>${label}</label>
  `;
  container.innerHTML += labelTag;

  let selectTag = `
    <select name='${tagName}' id='${tagName}' class='${className}'>
  `;

  resources.forEach(({ id, taskType }) => {

    const optionTag = `
      <option value='${id}'>${taskType}</option>
    `;
    selectTag += optionTag;
  });
  selectTag += '</select>';

  container.innerHTML += selectTag;
};

const getTaskInputs = () => {
  const taskAddInput = document.querySelector(".task__add-input");
  const taskName = taskAddInput.value;
  const listId = document.querySelector(".task__select-list").value;
  const taskTypeId = document.querySelector(".task__select-task-types").value;
  const isCompleted = false;
  const noteValue = document.querySelector(".task__note-input").value;
  const note = noteValue === '' ? null : noteValue;
  const dueDateValue = document.querySelector(".task__due-date-input").value;
  const dueDate = dueDateValue === '' ? null : dueDateValue;

  return {
    taskName,
    note,
    dueDate,
    isCompleted,
    listId,
    taskTypeId,
  };

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
    const { taskName, note, dueDate, isCompleted, listId, taskTypeId } = getTaskInputs();

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskName, note, dueDate, isCompleted, listId, taskTypeId }),
      });

      if (!res.ok) throw res;

      document.querySelector(`.task__text-${taskId}`).innerHTML = taskName;
    } catch (err) {
      console.error(err);
    }
  };
};

const handleTagAdd = (taskId) => {
  return async (event) => {
    try {
      const name = event.target.value;
      const resTag = await fetch(`/api/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!resTag.ok) {
        throw resTag; 
      } else {
        event.target.value = '';
      }

      const tag = await resTag.json();
      const tagId = tag.id;
      const resTagJoin = await fetch(`api/tag-joins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagId, taskId }),
      })

      if (!resTagJoin.ok) throw resTag; 

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
  const centerDisplay = document.querySelector(".center-display");
  // reset container
  centerDisplay.innerHTML = "";
  
  const tasksContainer = createDiv("tasks__center-display");
  centerDisplay.append(tasksContainer);
  
  // create inputs for input to add, and edit
  createInput("taskAddName", "task__add-input", tasksContainer);
  
  const addButton = document.createElement("button");
  addButton.className = "task__add-button";
  addButton.innerHTML = "Add task";
  tasksContainer.append(addButton);

  
  // Create select element from lists
  try {
    // get the lists
    const resLists = await fetch("/api/lists");
    const { lists } = await resLists.json();
    createSelectList("taskSelectList", "task__select-list", lists, tasksContainer, "List");

    const resTaskTypes = await fetch("/api/task-types");
    const { taskTypes } = await resTaskTypes.json();
    createSelectTaskType("taskTypeSelect", "task__select-task-types", taskTypes, tasksContainer, "Task Type");
  } catch (err) {
    console.error(err);
  }

  // note and due date fields
  createInput("taskNote", "task__note-input", tasksContainer, "Note");
  createInput("taskDueDate", "task__due-date-input", tasksContainer, "Due Date", "date");
  

  const tasksHTML = tasks.map(
    // TODO Add mark checked button
    ({ taskName, id }) => `
        <div class='task__container' id='task-${id}'>
          <div class='task__body'>
            <p class='task__text-${id}'>${taskName}</p>
            <button id='${id}' class='task__delete-button btn btn-secondary'>
              Delete
            </button>
            <button id='${id}' class='task__edit-button btn btn-secondary'>
                Edit
            </button>
            <div class='task__tag-container'>
              <label for='task__add-tag-label'>Add Tag</label>
              <input id='${id}' class='task__add-tag-input'>
            </div>
          </div>
        </div>
        `
  );

  tasksContainer.innerHTML += tasksHTML.join("");

  // add event listeners to the delete buttons
  const deleteTaskButtons = document.querySelectorAll(".task__delete-button");
  if (deleteTaskButtons) {
    deleteTaskButtons.forEach((button) => {
      button.addEventListener("click", handleTaskDelete(button.id));
    });
  }
  const editTaskButtons = document.querySelectorAll(".task__edit-button");
  if (editTaskButtons) {
    editTaskButtons.forEach((button) => {
      button.addEventListener("click", handleTaskEdit(button.id));
    });
  }

  const tagInputTags = document.querySelectorAll(".task__add-tag-input");
  if (tagInputTags) {
    tagInputTags.forEach((input) => {
      input.addEventListener("change", handleTagAdd(input.id));
    });
  }

  await addTaskHandler();
};

const handleTaskAdd = async () => {
  const { taskName, note, dueDate, isCompleted, listId, taskTypeId } = getTaskInputs();

  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskName, note, dueDate, isCompleted, listId, taskTypeId }),
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
  const addTaskButton = document.querySelector(".task__add-button");
  addTaskButton.addEventListener("click", handleTaskAdd);
};

document.addEventListener("DOMContentLoaded", async (e) => {
  try {
    await renderTasks();
  } catch (e) {
    console.errors(e);
  }
});
