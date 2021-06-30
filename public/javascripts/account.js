const handleListDelete = (listId) => {
  return async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/lists/${listId}`, {
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

const fetchLists = async () => {

  // GET lists
  const res = await fetch('http://localhost:8080/api/lists');

  if (res.status === 401) {
    window.location.href = '/login';
    return;
  }

  const { lists } = await res.json();
  const listsContainer = document.querySelector('.center-display');
  console.log(lists);

  const listsHTML = lists.map(
    ({ listName, id }) => `
    <div class='list__container' id='list-${id}'>
      <div class='list__body'>
        <p class='list__text'>${listName}</p>
        <button id='${id}' class='list__delete_button btn btn-secondary'>
          Delete
        </button>
      </div>
    </div>
    `
  );

  listsContainer.innerHTML += listsHTML.join('');

  // add event listeners to the delete buttons
  const deleteButtons = document.querySelectorAll('.list__delete_button');
  console.log(deleteButtons);
  if (deleteButtons) {
    deleteButtons.forEach((button) => {
      button.addEventListener('click', handleListDelete(button.id));
    });
  }
};

const handleListAdd = () => {
  return async () => {

    const listAddInput = document.querySelector('.list__add_input');
    console.log(listAddInput.value);
    const listName = listAddInput.value;

    try {
      const res = await fetch('http://localhost:8080/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listName }),
      });

      if (!res.ok) {
        throw res;
      }

      fetchLists();
    } catch (err) {
      console.error(err);
    }
  }
};

const addListHandler = () => {
  const addListButton = document.querySelector('.list__add_button');
  console.log(addListButton);
  addListButton.addEventListener('click', handleListAdd());
};

document.addEventListener('DOMContentLoaded', async (event) => {

  try {
    addListHandler();
    fetchLists();
  } catch (e) {
    console.error(e);
  }

});
