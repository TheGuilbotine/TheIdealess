const showSearchResults = (taskSet) => {
  taskSet.forEach((task) => {
    
    
  });
};

const fetchSearch = async (event) => {
  // get results of tags and display tasks associated
  try {
    const searchString = event.target.value;
    if (!searchString) return;

    const res = await fetch('/api/tags/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchString }),
    });

    const { tags } = await res.json();

    const taskSet = new Set();
    tags.forEach((tag) => {
      tag.Tasks.forEach(({id, taskName, taskTypeId, note, dueDate}) => {
        const task = { id, taskName, note, dueDate, taskTypeId };
        taskSet.add(task);
      });
    });

    // console.log(taskSet);

    // send tags with tasks to display on the search bar
    showSearchResults(taskSet);
  } catch (err) {
    console.error(err);
  }
};

const addEventSearchBar = () => {
  const searchBarInput = document.querySelector('.search-bar');

  searchBarInput.addEventListener('keyup', fetchSearch);
};

document.addEventListener('DOMContentLoaded', (event) => {
  try {
    addEventSearchBar();

  } catch (err) {
    console.error(err);
  }
});