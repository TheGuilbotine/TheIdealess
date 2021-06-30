

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
        <h4>${listName}</h4>
      </div>
    </div>
    `
  );

  listsContainer.innerHTML = listsHTML.join('');

};

document.addEventListener('DOMContentLoaded', async (event) => {


  try {
    fetchLists();
  } catch (e) {
    console.error(e);
  }

});