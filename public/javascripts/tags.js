import { createSpan } from './utils.js';

const handleTags = async () => {
  const tagContainers = document.querySelectorAll('.task__tag-container');

  if (tagContainers) {

    for (let node of tagContainers) {
      // get the text with node.id
      const textTag = document.querySelector(`.task__text-${node.id}`)

      // get tags from each task
      try {
        const res = await fetch(`/api/tasks/${node.id}`);
        const { task: { Tags: tags } } = await res.json();

        tags.forEach((tag) => {
          // create span tag
          const tagSpan = createSpan(`span-task-${node.id}__tag-${tag.id}`);
          tagSpan.innerHTML = tag.name;
          textTag.append(tagSpan);
        })
      } catch (err) {
        console.error(err);
      }
    }
  } 
};

const addTag = (tagName, taskId, tagId) => {
  const textTag = document.querySelector(`.task__text-${taskId}`)

  // create span tag
  const tagSpan = createSpan(`span-task-${taskId}__tag-${tagId}`);
  tagSpan.innerHTML = tagName;
  textTag.append(tagSpan);
};

const handleTagAdd = (taskId) => {
  return async (event) => {
    try {
      const name = event.target.value;
      const resTag = await fetch(`/api/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!resTag.ok) {
        throw resTag; 
      } else event.target.value = '';
  
      const { tag } = await resTag.json();
      const tagId = tag.id;

      const resTagJoin = await fetch(`api/tag-joins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tagId, taskId }),
      })

      if (!resTagJoin.ok) throw resTag; 

      // add tag to the element
      addTag(name, taskId, tagId)

    } catch (err) {
      console.error(err);
    }
  };
};

export { handleTags, handleTagAdd, addTag };