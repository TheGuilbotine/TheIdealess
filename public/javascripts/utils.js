const createDiv = (className = '') => {
  const divTag = document.createElement('div');
  divTag.classList.add(`${className}`)

  return divTag;
};

const createSpan = (className = '') => {
  const spanTag = document.createElement('span');
  spanTag.classList.add(`${className}`);

  return spanTag;
};

const createHeader = (label, className = '') => {
  const hTag = document.createElement('h3');
  hTag.classList.add(`${className}`);
  hTag.innerHTML = label;

  return hTag;
};

const createInput = (tagName, className, container, label = '', parentClass = '', type = 'text') => {
  const divTag = createDiv(parentClass);
  const labelTag = `
    <label for='${tagName}'>${label}</label>
  `;
  divTag.innerHTML += labelTag;
  const inputTag = `
    <input type='${type}' name='${tagName}' id='${tagName}' class='${className}'>
  `;

  divTag.innerHTML += inputTag;
  container.append(divTag);
};

const createSelectList = (tagName, className, resources, container, label = '', parentClass = '') => {
  const divTag = createDiv(parentClass);
  const labelTag = `
    <label for='${tagName}'>${label}</label>
  `;
  divTag.innerHTML += labelTag;

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

  divTag.innerHTML += selectTag;
  container.append(divTag);
};

const createSelectTaskType = (tagName, className, resources, container, label = '', parentClass = '') => {
  const divTag = createDiv(parentClass);
  const labelTag = `
    <label for='${tagName}'>${label}</label>
  `;
  divTag.innerHTML += labelTag;

  let selectTag = `
    <select name='${tagName}' id='${tagName}' class='${className}'>
  `;

  resources.forEach(({ id, taskType }) => {

    const optionTag = `
      <option value='${id}'>${taskType}</option>
    `;
    selectTag += optionTag;
  });
  selectTag += '</select>';

  divTag.innerHTML += selectTag;
  container.append(divTag);
};

export { 
  createInput, 
  createSelectList, 
  createDiv, 
  createSpan, 
  createSelectTaskType, 
  createHeader,
};