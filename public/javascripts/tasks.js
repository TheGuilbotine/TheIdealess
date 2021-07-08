import { createInput, createSelectList, createDiv, createSelectTaskType, createHeader } from './utils.js';
import { handleTags, handleTagAdd, addAllTags } from './tags.js';

const getTaskInputs = () => {
  const taskAddInput = document.querySelector(".task__add-input");
  const taskName = taskAddInput.value;
  const listId = document.querySelector(".tasks__list").id;
  if (!listId) throw new Error('listId is undefined.');
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
      addAllTags(taskId);
    } catch (err) {
      console.error(err);
    }
  };
};

const addTaskListeners = () => {
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
};

const renderTasks = (tasks, listId) => {

  const tasksContainer = document.querySelector('.tasks__list');
  tasksContainer.id = listId;
  tasksContainer.innerHTML = "";

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
              <i id='${id}' class='fas fa-edit task__edit-button'></i>
              <i class='far fa-trash-alt task__delete-button' id='${id}'></i>
            </div>
          </div>
        </div>
        `
  );

  tasksContainer.innerHTML += tasksHTML.join("");

  tasks.forEach((task) => {
    addAllTags(task.id);
  });

  addTaskListeners();
};

const renderTaskInputs = async () => {

  const centerDisplay = document.querySelector(".center-display");
  // reset container
  centerDisplay.innerHTML = "";

  
  const tasksInputContainer = createDiv("tasks__input-add");
  const tasksContainer = createDiv("tasks__center-display");
  centerDisplay.append(tasksContainer);

  // create header
  const headerTag = createHeader("Tasks", "tasks__header");
  tasksContainer.append(headerTag);
  tasksContainer.append(tasksInputContainer);
  // add div container for tasksList
  const tasksListContainer = createDiv("tasks__list");
  tasksContainer.append(tasksListContainer);

  
  // create inputs for input to add, and edit
  createInput("taskAddName", "task__add-input", tasksInputContainer, "Task Name", "task__input-div");
  
  const addButton = document.createElement("button");
  addButton.className = "task__add-button";
  addButton.innerHTML = "Add task";
  tasksInputContainer.append(addButton);

  
  // Create select element from lists
  try {

    const resTaskTypes = await fetch("/api/task-types");
    const { taskTypes } = await resTaskTypes.json();
    createSelectTaskType("taskTypeSelect", "task__select-task-types", taskTypes, tasksInputContainer, "Task Type", "task__select-div");
  } catch (err) {
    console.error(err);
  }

  // note and due date fields
  createInput("taskNote", "task__note-input", tasksInputContainer, "Note", "task__input-div");
  createInput("taskDueDate", "task__due-date-input", tasksInputContainer, "Due Date", "task__input-div", "date");

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
    } else document.querySelector(".task__add-input").value = "";

    const { task } = await res.json();

    // add task
    const taskCenterDisplay = document.querySelector('.tasks__list');

    taskCenterDisplay.innerHTML += `
      <div class='task__container' id='task-${task.id}'>
        <div class='task__body'>
          <div class='task__text task__text-${task.id}'>
            ${task.taskName}
          </div>
          <div class='task__tag-container' id='${task.id}'>
            <label for='task__add-tag-label'>Add Tag</label>
            <input id='${task.id}' class='task__add-tag-input'>
          </div>
          <div class='task__btn'>
            <i id='${task.id}' class='fas fa-edit task__edit-button'></i>
            <i class='far fa-trash-alt task__delete-button' id='${task.id}'></i>
          </div>
        </div>
      </div>
    `;

    addTaskListeners();

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
    await renderTaskInputs();
    handleTags();
  } catch (e) {
    console.errors(e);
  }
});

export {
  renderTasks,
};