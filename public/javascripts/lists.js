
import { createInput, createDiv, createHeader } from './utils.js';

// import { createInput, createDiv } from './utils.js';
import { renderTasks } from './tasks.js';

const handleListDelete = (listId) => {
  return async () => {
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw res;
      }

      document.querySelector(`#list-${listId}`).remove();
    } catch (err) {
      console.error(err);
    }
  };
};

const handleListEdit = (listId) => {
  return async () => {
      const listEditInput = document.querySelector('.list__add-input')

      const listName = listEditInput.value
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({listName})
      });

      if (!res.ok) {
        throw res;
      }

      document.querySelector(`.list__text-${listId}`).innerHTML = listName
    } catch (err) {
      console.error(err);
    }
  };
};

const renderLists = async () => {

  // GET lists
  const res = await fetch('/api/lists');

  if (res.status === 401) {
    window.location.href = '/login';
    return;
  }

  const { lists } = await res.json();
  const leftPanel = document.querySelector('.left-panel');
  leftPanel.innerHTML = '';
  const listsContainer = createDiv("lists__left-panel");
  leftPanel.append(listsContainer);
  const headerTag = createHeader("Lists", "lists__header");
  listsContainer.append(headerTag);

  // create inputs for input to add, and edit
  createInput("listName", "list__add-input", listsContainer, "List Name", "list__input-div");

  const addButton = document.createElement('button');
  addButton.className = 'list__add-button';
  addButton.innerHTML = 'Add List';
  listsContainer.append(addButton);

  const listsHTML = lists.map(
    ({ listName, id }) => `
    <div class='list__container' id='list-${id}'>
      <div class='list__body'>
        <p class='list__text-${id}'>${listName}</p>
        <button id='${id}' class='list__delete-button btn btn-secondary'>
          Delete
        </button>
        <button id='${id}' class='list__edit-button btn btn-secondary'>
          Edit
        </button>
      </div>
    </div>
    `
  );

  listsContainer.innerHTML += listsHTML.join('');


  // add event listeners to the delete buttons
  const deleteButtons = document.querySelectorAll('.list__delete-button');

  if (deleteButtons) {
    deleteButtons.forEach((button) => {
      button.addEventListener('click', handleListDelete(button.id));
    });
  }

  const editButtons = document.querySelectorAll('.list__edit-button')

  if(editButtons){
    editButtons.forEach((button) => {
        button.addEventListener('click', handleListEdit(button.id));
      });
  }

  await addListHandler();

};

const handleListAdd = async () => {

  try {
    const listAddInput = document.querySelector('.list__add-input');
    const listName = listAddInput.value;

    const res = await fetch('/api/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listName }),
    });

    if (!res.ok) {
      throw res;
    } else listAddInput.value = '';

    const { list } = await res.json();

    // append lists to left panel and add listener
    const listsContainer = document.querySelector('.lists__left-panel');

    listsContainer.innerHTML += `
      <div class='list__container' id='list-${list.id}'>
        <div class='list__body'>
          <p class='list__text-${list.id}'>${list.listName}</p>
          <button id='${list.id}' class='list__delete-button btn btn-secondary'>
            Delete
          </button>
          <button id='${list.id}' class='list__edit-button btn btn-secondary'>
            Edit
          </button>
        </div>
      </div>
    `;

    // add listener to edit and add
    const editButton = document.querySelector(`#list-${list.id} .list__edit-button`);
    if (editButton) editButton.addEventListener('click', handleListEdit(editButton.id));

    const deleteButton = document.querySelector(`#list-${list.id} .list__delete-button`);
    if (deleteButton) deleteButton.addEventListener('click', handleListDelete(deleteButton.id));

  } catch (err) {
    console.error(err);
  }
};

const addListHandler = async () => {
  const addListButton = document.querySelector('.list__add-button');
  const addListInput = document.querySelector('.list__add-input');

  addListButton.addEventListener('click', handleListAdd);
  addListInput.addEventListener('change', handleListAdd);
};

const handleTaskShow = (listId) => {
  return async () => {
    try {
      const res = await fetch(`/api/lists/${listId}`);

      if (!res.ok) {
        throw res;
      }

      // get all the tasks from this list
      const { list: { Tasks: tasks } } = await res.json();

      renderTasks(tasks, listId);
      
    } catch (err) {
      console.error(err);
    }
  };
};


const showTasks = async () => {
  
  // add event listeners to the delete buttons
  const listContainers = document.querySelectorAll(".list__container");
  if (listContainers) {
    listContainers.forEach((list) => {
      list.addEventListener("click", handleTaskShow(list.id.split('-')[1]));
    });
  }
};

document.addEventListener('DOMContentLoaded', async (event) => {

  try {
    await renderLists();
    await showTasks();
  } catch (e) {
    console.error(e);
  }

});
