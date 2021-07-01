import { createInput, createDiv, createHeader } from './utils.js';

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
    }

    await renderLists();
  } catch (err) {
    console.error(err);
  }
};

const addListHandler = async () => {
  const addListButton = document.querySelector('.list__add-button');

  addListButton.addEventListener('click', handleListAdd);
};


document.addEventListener('DOMContentLoaded', async (event) => {

  try {
    await renderLists();
  } catch (e) {
    console.error(e);
  }

});
