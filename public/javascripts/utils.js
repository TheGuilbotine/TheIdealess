const createInput = (tagName, className, container, label = '', type = 'text') => {
  const labelTag = `
    <label for='${tagName}'>${label}</label>
  `;
  container.innerHTML += labelTag;
  const inputTag = `
    <input type='${type}' name='${tagName}' id='${tagName}' class='${className}'>
  `;
  container.innerHTML += inputTag;
};

const createSelectList = (tagName, className, resources, container, label = '') => {
  const labelTag = `
    <label for='${tagName}'>${label}</label>
  `;
  container.innerHTML += labelTag;

  let selectTag = `
    <select name='${tagName}' id='${tagName}' class='${className}'>
  `;

  resources.forEach(({ listName, id }) => {

    const optionTag = `
      <option value='${id}'>${listName}</option>
    `;
    selectTag += optionTag;
  });
  selectTag += '</select>';

  container.innerHTML += selectTag;
};

const createDiv = (className) => {
  const divTag = document.createElement('div');
  divTag.classList.add(`${className}`)

  return divTag;
};

export { createInput, createSelectList, createDiv };