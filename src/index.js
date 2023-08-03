import './style.css';
import { toggleModal,createNewList, renderLists } from './screenManager';
import projectSvg from './icons/format-list-checkbox.svg';
import plusSvg from './icons/plus.svg';

let projectIcon = document.getElementById('project-logo');
projectIcon.innerHTML = projectSvg;

let plusIcon = document.getElementById('new');
plusIcon.innerHTML = plusSvg;

let newBtn = document.querySelector('.new-list button');
newBtn.addEventListener('click', toggleModal);

let createBtn = document.getElementById('create-list');
createBtn.addEventListener('click', createNewList);


renderLists();