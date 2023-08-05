function todoList(title, description='') {
  let todoItems = []
  return { title, description, todoItems };
}

function todoItem(title, notes = '', dueDate = 'none', priority = 0) {
  let complete = false;
  let dueToday = (dueDate == new Date().toDateString());
  return { title, notes, dueDate, priority, complete, dueToday };
}

const todo = (function () {
  function createNewList(title, description) {
    if (storage.get(title.toLowerCase()) == null) {
      storage.set(title.toLowerCase(),todoList(title, description));      
    } else {
      return null;
    }
  }
  function removeList(listTitle) {
    storage.remove(listTitle);
  }
  function addItemToList(itemTitle, itemNotes = '', itemDueDate = 'none', itemPriority = 0, listTitle) {
    if (findItemIndex(itemTitle, listTitle) != null) return null;
    let listObject = storage.get(listTitle.toLowerCase());
    listObject.todoItems.push(todoItem(itemTitle, itemNotes, itemDueDate, itemPriority));
    updateStorage(listTitle, listObject);
  }
  function removeItemFromList(itemTitle, listTitle) {
    let itemIndex = findItemIndex(itemTitle,listTitle);
    if (itemIndex == null) return;
    let listObject = storage.get(listTitle);
    listObject.todoItems.splice(itemIndex, 1);
    updateStorage(listTitle, listObject);
  }
  function changeItemPriorityFromList(itemTitle,listTitle,newPriority) {
    let itemIndex = findItemIndex(itemTitle,listTitle);
    if (itemIndex == null) return;
    let listObject = storage.get(listTitle);
        
    listObject.todoItems[itemIndex].priority = newPriority;
    updateStorage(listTitle, listObject);
  }
  function changeItemStatusFromList(itemTitle, listTitle) {
    let itemIndex = findItemIndex(itemTitle,listTitle);
    if (itemIndex == null) return;
    let listObject = storage.get(listTitle);

    listObject.todoItems[itemIndex].complete = listObject.todoItems[itemIndex].complete ? false : true;
    updateStorage(listTitle, listObject);
  }
  function changeItemTitleFromList(itemTitle, listTitle, newTitle) {
    let itemIndex = findItemIndex(itemTitle, listTitle);
    if (itemIndex == null) return;
    let listObject = storage.get(listTitle);

    listObject.todoItems[itemIndex].title = newTitle;
    updateStorage(listTitle, listObject);
  }
  function changeItemDueDateFromList(itemTitle, listTitle, newDate) {
    let itemIndex = findItemIndex(itemTitle, listTitle);
    if (itemIndex == null) return;
    let listObject = storage.get(listTitle);

    listObject.todoItems[itemIndex].dueDate = newDate;
    listObject.todoItems[itemIndex].dueToday = (newDate == new Date().toDateString()) ? true : false;
    updateStorage(listTitle, listObject);
  }
  function getItemsFromList(listTitle) {
    let listObject = storage.get(listTitle);
    if (listObject == null) return [];
    
    return listObject.todoItems;
  }
  function getListDescription(listTitle) {
    return storage.get(listTitle).description;
  }

  function updateStorage(title, listObject) {
    storage.set(title, listObject);
  }

  function findItemIndex(itemTitle, listTitle) {
    let listObject = storage.get(listTitle.toLowerCase());
    if (listObject == null) return null;
    for (let i = 0; i < listObject.todoItems.length; i++){
      if (listObject.todoItems[i].title == itemTitle) {
        return i;
      }
    }
    return null;
  }

  return { createNewList, removeList, addItemToList, removeItemFromList, changeItemPriorityFromList, changeItemStatusFromList, getItemsFromList, getListDescription, changeItemTitleFromList,changeItemDueDateFromList };
})();

const storage = (function () {
  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function get(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  function remove(key) {
    localStorage.removeItem(key);
  }
  function getAllItems() {
    let collection = [];
    for (let i = 0; i < localStorage.length; i++){
      let key = localStorage.key(i);
      collection.push(localStorage.getItem(key));
    }
    return collection;
  }
  function getAllKeys() {
    let collection = [];
    for (let i = 0; i < localStorage.length; i++){
      let key = localStorage.key(i);
      collection.push(key);
    }
    return collection;
  }

  return {set,get,remove,getAllKeys, getAllItems}
})();

export {todo,storage};