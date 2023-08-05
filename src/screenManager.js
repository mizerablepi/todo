import { todo, storage } from './todoList';
import listSvg from './icons/playlist-check.svg';
import titleSvg from './icons/chart-donut.svg';
import plusSvg from './icons/plus-white.svg';
import trashSvg from './icons/trash-can.svg';
import removeSvg from './icons/close-thick.svg';

let modal = document.getElementsByClassName('modal')[0];
modal.addEventListener('click', cancelModal);
let taskModal = document.getElementsByClassName('task-modal')[0];
taskModal.addEventListener('click', cancelTaskModal);

let newTitle = document.getElementById('title');
let newDescription = document.getElementById('description');
let newTaskTitle = document.getElementById('task-title');
let newTaskDueDate = document.getElementById('due-date');
let newTaskPriority = document.getElementById('priority');
let lists = document.getElementsByClassName('lists')[0];
let main = document.getElementsByTagName('main')[0];


function toggleModal() {
  modal.classList.toggle('hidden');
}

function createNewList() {
  if (todo.createNewList(newTitle.value, newDescription.value) === null) {
    let formError = document.getElementById('error');
    formError.classList.toggle('hidden');
    return;
  };
  newTitle.value = '';
  newDescription.value = '';
  renderLists();

  toggleModal();
}

function createNewTask() {
  let selectedList = document.getElementsByClassName('selected')[0];
  let selectedListTitle = selectedList.firstChild.nextElementSibling.textContent;

  if (todo.addItemToList(newTaskTitle.value,'', newTaskDueDate.valueAsDate.toDateString(), newTaskPriority.value,selectedListTitle) === null) {
    let taskError = document.getElementById('task-error');
    taskError.classList.toggle('hidden');
    return;
  }
  newTaskTitle.value = '';
  newTaskDueDate.value = '';
  newTaskPriority.value = '';
  
  renderBody();

  toggleTaskModal();
}

function renderLists() {
  lists.replaceChildren();
  let allLists = storage.getAllKeys();
  allLists.forEach((key) => {
    lists.appendChild(createListDiv(key));
  });
}

function createTasksDiv(taskTitle,taskDueDate,taskPriority,taskCompleted,dueToday) {
  let task = document.createElement('div');
  task.classList.add('task');
  
  let checkBox = document.createElement('input');
  checkBox.setAttribute('type', 'checkbox');
  if (taskCompleted) {
    checkBox.setAttribute('checked', taskCompleted);
    checkBox.classList.add('checked');
  } 
  checkBox.classList.add('task-check');
  checkBox.addEventListener('click',changeStatusHandler)
  
  let taskTitleDiv = document.createElement('input');
  taskTitleDiv.value = taskTitle;
  taskTitleDiv.classList.add('task-title');
  taskTitleDiv.addEventListener('blur', changeTitleHandler);

  let taskDueDateDiv = document.createElement('div');
  taskDueDateDiv.classList.add('task-due-date');
  let taskDueDateBtn = document.createElement('button');
  taskDueDateBtn.textContent = (dueToday) ? 'Today' : taskDueDate;
  taskDueDateBtn.addEventListener('click', changeBtnHandler);
  let taskDueDateInput = document.createElement('input');
  taskDueDateInput.setAttribute('type', 'date');
  taskDueDateInput.addEventListener('blur', changeDateHandler);
  taskDueDateInput.classList.add('hidden');
  taskDueDateDiv.append(taskDueDateBtn,taskDueDateInput);

  let taskPriorityDiv = document.createElement('input');
  taskPriorityDiv.setAttribute('type', 'number');
  taskPriorityDiv.setAttribute('value', taskPriority);
  taskPriorityDiv.setAttribute('min', 0);
  taskPriorityDiv.setAttribute('max', 2);
  taskPriorityDiv.addEventListener('input', changePriorityHandler);
  taskPriorityDiv.classList.add('task-priority');

  let taskRemoveDiv = document.createElement('button');
  taskRemoveDiv.classList.add('remove');
  taskRemoveDiv.innerHTML = trashSvg;
  taskRemoveDiv.addEventListener('click', taskRemoveHandler);

  task.dataset.title = taskTitle;
  task.dataset.priority = taskPriorityDiv.value;
  task.append(checkBox, taskTitleDiv, taskDueDateDiv, taskPriorityDiv, taskRemoveDiv);
  return task;
}

function changeBtnHandler(event) {
  event.currentTarget.classList.toggle('hidden');
  event.currentTarget.nextElementSibling.classList.toggle('hidden');
}
function changeDateHandler(event) {
  let itemTitle = event.currentTarget.parentElement.parentElement.dataset.title
  let selectedList = document.getElementsByClassName('selected')[0];
  let selectedListTitle = selectedList.firstChild.nextElementSibling.textContent;

  if (event.currentTarget.valueAsDate == null) return;
  let newDate = event.currentTarget.valueAsDate.toDateString();

  todo.changeItemDueDateFromList(itemTitle, selectedListTitle, newDate);
  renderBody();
}

function changeStatusHandler(event){
  let itemTitle = event.currentTarget.parentElement.dataset.title
  let selectedList = document.getElementsByClassName('selected')[0];
  let selectedListTitle = selectedList.firstChild.nextElementSibling.textContent;

  todo.changeItemStatusFromList(itemTitle, selectedListTitle);
}

function changeTitleHandler(event) {
  let itemTitle = event.currentTarget.parentElement.dataset.title;
  let selectedList = document.getElementsByClassName('selected')[0];
  let selectedListTitle = selectedList.firstChild.nextElementSibling.textContent;

  todo.changeItemTitleFromList(itemTitle, selectedListTitle, event.currentTarget.value);
  renderBody();
}

function changePriorityHandler(event) {
  let itemTitle = event.currentTarget.parentElement.dataset.title;
  let selectedList = document.getElementsByClassName('selected')[0];
  let selectedListTitle = selectedList.firstChild.nextElementSibling.textContent;

  todo.changeItemPriorityFromList(itemTitle, selectedListTitle, event.currentTarget.value);
}
function taskRemoveHandler(event) {
  let itemTitle = event.currentTarget.parentElement.dataset.title;
  let selectedList = document.getElementsByClassName('selected')[0];
  let selectedListTitle = selectedList.firstChild.nextElementSibling.textContent;

  todo.removeItemFromList(itemTitle, selectedListTitle);
  renderBody();
}

function renderBody() {
  main.replaceChildren();
  let selectedList = document.getElementsByClassName('selected')[0];

  let selectedListTitle = selectedList.firstChild.nextElementSibling.textContent;

  let mainTitle = document.createElement('div');
  mainTitle.classList.add('main-title');
  let mainTitleIcon = document.createElement('div');
  mainTitleIcon.classList.add('title-icon');
  mainTitleIcon.innerHTML = titleSvg;
  let mainTitleText = document.createElement('span');
  mainTitleText.textContent = selectedListTitle;
  mainTitle.append(mainTitleIcon, mainTitleText);

  let mainDescription = document.createElement('div');
  mainDescription.classList.add('main-description');
  mainDescription.textContent = todo.getListDescription(selectedListTitle);

  let tasks = todo.getItemsFromList(selectedListTitle);
  let tasksDiv = document.createElement('div');
  tasksDiv.classList.add('tasks');
  tasks.forEach((task) => {
    tasksDiv.appendChild(createTasksDiv(task.title, task.dueDate, task.priority, task.complete, task.dueToday));
  })

  let newItemBtn = document.createElement('button');
  newItemBtn.addEventListener('click', toggleTaskModal);
  newItemBtn.id = 'new-item';
  let newItemIcon = document.createElement('div');
  newItemIcon.innerHTML = plusSvg;
  newItemBtn.append(newItemIcon);
  
  main.append(mainTitle,mainDescription,tasksDiv,newItemBtn);
}

function toggleTaskModal() {
  taskModal.classList.toggle('hidden');
}

function selectedListHandler(event) {
  let selectedList = document.getElementsByClassName('selected')[0];
  if (selectedList != undefined) {
    selectedList.classList.toggle('selected');
  }
  event.currentTarget.classList.toggle('selected');
  renderBody();
}

function createListDiv(title) {
  let list = document.createElement('button');
  list.classList.add('list');
  list.addEventListener('click', selectedListHandler);

  let listIcon = document.createElement('span');
  listIcon.classList.add('icon')
  listIcon.innerHTML = listSvg;
  let listTitle = document.createElement('span');
  listTitle.textContent = title;
  let listRemove = document.createElement('button');
  listRemove.innerHTML = removeSvg;
  listRemove.classList.add('list-remove','icon');
  listRemove.addEventListener('click', removeListHandler);

  list.append(listIcon,listTitle,listRemove);
  return list;
}

function removeListHandler(event) {
  let listTitle = event.currentTarget.previousElementSibling.textContent;
  todo.removeList(listTitle);
  renderLists();
  event.stopPropagation();
}

function cancelModal(event) {
  if (event.target.className == 'modal') {
    toggleModal();
  }
}

function cancelTaskModal(event) {
  if (event.target.className == 'task-modal') {
    toggleTaskModal();
  }
}

export { toggleModal, createNewList,renderLists,createNewTask };