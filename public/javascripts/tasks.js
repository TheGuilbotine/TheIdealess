import { createInput, createSelectList, createDiv, createSelectTaskType, createHeader } from './utils.js';
import { handleTags, handleTagAdd } from './tags.js';

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

  
  const tasksInputContainer = createDiv("tasks__input-add");
  const tasksContainer = createDiv("tasks__center-display");
  centerDisplay.append(tasksContainer);

  // create header
  const headerTag = createHeader("Tasks", "tasks__header");
  tasksContainer.append(headerTag);
  
  // create inputs for input to add, and edit
  createInput("taskAddName", "task__add-input", tasksInputContainer, "Task Name", "task__input-div");
  
  const addButton = document.createElement("button");
  addButton.className = "task__add-button";
  addButton.innerHTML = "Add task";
  tasksInputContainer.append(addButton);

  
  // Create select element from lists
  try {
    // get the lists
    const resLists = await fetch("/api/lists");
    const { lists } = await resLists.json();
    createSelectList("taskSelectList", "task__select-list", lists, tasksInputContainer, "List", "task__select-div");

    const resTaskTypes = await fetch("/api/task-types");
    const { taskTypes } = await resTaskTypes.json();
    createSelectTaskType("taskTypeSelect", "task__select-task-types", taskTypes, tasksInputContainer, "Task Type", "task__select-div");
  } catch (err) {
    console.error(err);
  }

  // note and due date fields
  createInput("taskNote", "task__note-input", tasksInputContainer, "Note", "task__input-div");
  createInput("taskDueDate", "task__due-date-input", tasksInputContainer, "Due Date", "task__input-div");
  tasksContainer.append(tasksInputContainer);
  

  const tasksHTML = tasks.map(
    // TODO Add mark checked button
    ({ taskName, id }) => `
        <div class='task__container' id='task-${id}'>
          <div class='task__body'>
            <div class='task__text task__text-${id}'>
              ${taskName}
            </div>
            <div class='task__tag-container' id='${id}'>
            <label for='task__add-tag-label'>Add Tag</label>
            <input id='${id}' class='task__add-tag-input'>
            </div>
            <div class='task__btn'>
              <button id='${id}' class='task__delete-button btn btn-secondary'>
                Delete
              </button>
              <button id='${id}' class='task__edit-button btn btn-secondary'>
                  Edit
              </button>
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
    handleTags();
  } catch (e) {
    console.errors(e);
  }
});
