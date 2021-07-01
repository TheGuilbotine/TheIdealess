import { createInput, createDiv } from './utils.js';

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
      const listEditInput = document.querySelector('.list__add_input')

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

      document.querySelector(`.list__text_${listId}`).innerHTML = listName
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
  const listsContainer = createDiv("lists__left_panel");
  leftPanel.append(listsContainer);
  

  // create inputs for input to add, and edit
  createInput("listName", "list__add_input", listsContainer);

  const addButton = document.createElement('button');
  addButton.className = 'list__add_button';
  addButton.innerHTML = 'Add List';
  listsContainer.append(addButton);

  const listsHTML = lists.map(
    ({ listName, id }) => `
    <div class='list__container' id='list-${id}'>
      <div class='list__body'>
        <p class='list__text_${id}'>${listName}</p>
        <button id='${id}' class='list__delete_button btn btn-secondary'>
          Delete
        </button>
        <button id='${id}' class='list__edit_button btn btn-secondary'>
          Edit
        </button>
      </div>
    </div>
    `
  );

  listsContainer.innerHTML += listsHTML.join('');


  // add event listeners to the delete buttons
  const deleteButtons = document.querySelectorAll('.list__delete_button');

  if (deleteButtons) {
    deleteButtons.forEach((button) => {
      button.addEventListener('click', handleListDelete(button.id));
    });
  }

  const editButtons = document.querySelectorAll('.list__edit_button')

  if(editButtons){
    editButtons.forEach((button) => {
        button.addEventListener('click', handleListEdit(button.id));
      });
  }

  await addListHandler();

};

const handleListAdd = async () => {

  try {
    const listAddInput = document.querySelector('.list__add_input');
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
  const addListButton = document.querySelector('.list__add_button');

  addListButton.addEventListener('click', handleListAdd);
};


document.addEventListener('DOMContentLoaded', async (event) => {

  try {
    await renderLists();
  } catch (e) {
    console.error(e);
  }

});
