import { createInput, createDiv, createHeader } from './utils.js';
import { renderTasks } from './tasks.js';

const handleListDelete = (listId) => {

  return async (event) => {
    event.stopPropagation();

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
  return async (event) => {
    event.stopPropagation();

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

      document.querySelector(`.list__text-${listId}`).innerHTML = listName;
    } catch (err) {
      console.error(err);
    }
  };
};

const addEvents = async () => {
  await addTaskEvents();
  await addListHandler();

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
        <div class='list__btn'>
          <i id='${id}' class='fas fa-edit list__edit-button'></i>
          <i id='${id}' class='far fa-trash-alt list__delete-button'></i>
        </div>
      </div>
    </div>
    `
  );

  listsContainer.innerHTML += listsHTML.join('');
  
  
  await addEvents();
};

const handleListAdd = async (event) => {

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
          <div class='list__btn'>
            <i id='${list.id}' class='fas fa-edit list__edit-button'></i>
            <i class='far fa-trash-alt list__delete-button' id='${list.id}'></i>
          </div>
        </div>
      </div>
    `;

    await addEvents();
    
  } catch (err) {
    console.error(err);
  }
};

const addListHandler = async () => {
  const addListButton = document.querySelector('.list__add-button');
  const addListInput = document.querySelector('.list__add-input');

  addListButton.addEventListener('click', handleListAdd);
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

const addTaskEvents = () => {
  
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
    
  } catch (e) {
    console.error(e);
  }

});
