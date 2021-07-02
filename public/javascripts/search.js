const showSearchResults = (taskSet) => {
  const searchDropdown = document.querySelector('.search__section');
  searchDropdown.innerHTML = '';

  let i = 0;
  for(const task of taskSet) {
    if (i < 10) {
      searchDropdown.innerHTML += `
        <p class='search__section-link'>Task: ${task}</p>
      `;
      // <p class='search__section-link'><a href=''>Task: ${task}</a></p>
      i++;
    }
  }

  const searchBar = document.querySelector('.search');
  searchBar.classList.remove('search--hidden');

};

const fetchSearch = async (event) => {
  // get results of tags and display tasks associated
  try {
    const searchString = event.target.value;

    const searchBar = document.querySelector('.search-bar');
    const searchDropdown = document.querySelector('.search');

    if (searchBar.value.length === 0) {
      searchDropdown.classList.add('search--hidden');
      return;
    };
    

    const res = await fetch('/api/tags/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchString }),
    });

    const { tags, tasks } = await res.json();

    const taskSet = new Set();
    tags.forEach((tag) => {
      tag.Tasks.forEach(({id, taskName, taskTypeId, note, dueDate}) => {
        // const task = { id, taskName, note, dueDate, taskTypeId };
        taskSet.add(taskName);
      });
    });

    tasks.forEach(({ taskName }) => {
      taskSet.add(taskName)
    });

    if (taskSet.size === 0) {
      searchDropdown.classList.add('search--hidden');
      return;
    };

    // send tags with tasks to display on the search bar
    showSearchResults(taskSet);

  } catch (err) {
    console.error(err);
  }
};

const addEventSearchBar = () => {
  const searchBarInput = document.querySelector('.search-bar');

  searchBarInput.addEventListener('input', fetchSearch);
};

document.addEventListener('DOMContentLoaded', (event) => {
  try {
    addEventSearchBar();

  } catch (err) {
    console.error(err);
  }
});