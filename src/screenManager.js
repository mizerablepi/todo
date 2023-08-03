import { todo, storage } from './todoList';
import listSvg from './icons/playlist-check.svg';
import titleSvg from './icons/chart-donut.svg';
import plusSvg from './icons/plus-white.svg';

let modal = document.getElementsByClassName('modal')[0];
modal.addEventListener('click', cancelModal);
let newTitle = document.getElementById('title');
let newDescription = document.getElementById('description');
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

function renderLists() {
  lists.innerHTML = '';
  let allLists = storage.getAllKeys();
  allLists.forEach((key) => {
    lists.appendChild(createListDiv(key));
  });
}

function renderBody() {
  main.replaceChildren();
  let selectedList = document.getElementsByClassName('selected')[0];

  let selectedListTitle = selectedList.lastChild.textContent;

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


  let newItemBtn = document.createElement('button');
  newItemBtn.addEventListener('click', newTaskHandler);
  newItemBtn.id = 'new-item';
  let newItemIcon = document.createElement('div');
  newItemIcon.innerHTML = plusSvg;
  newItemBtn.append(newItemIcon);
  
  main.append(mainTitle,mainDescription,newItemBtn);
}

function newTaskHandler() {
  
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

  list.append(listIcon,listTitle);
  return list;
}

function cancelModal(event) {
  if (event.target.className == 'modal') {
    toggleModal();
  }
}


export { toggleModal, createNewList,renderLists };