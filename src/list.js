const Sortable = require('sortablejs');
const utils = require('./utils');
const card = require('./card');

const list = {
  init: function () {

    list.modalElement = document.getElementById('addListModal');

    list.addFormElement = document.getElementById('addListForm');

    const listContainer = document.getElementById('listContainer');
    new Sortable(listContainer, {
      animation: 150,
      filter: '.filter',
      // Sortable nous permet de définir des fonctions qui seront appelées au moment opportun, ici quand une liste a fini d'être déplacée
      onEnd: function () {

        const lists = document.querySelectorAll('.listItem');

        let position = 0;
        for (const listItem of lists) {

          const id = listItem.getAttribute('data-list-id');

          const data = new FormData();
          data.append('position', position);

          fetch(`${utils.baseUrl}lists/${id}`, {
            method: 'PATCH',
            body: data,
          });

          position++;
        }
      }
    });
  },

  getListsFromAPI: async function () {

    try {
      const response = await fetch(`${utils.baseUrl}lists`);

      const status = response.status;

      const listsOrError = await response.json();

      if (status === 200) {

        for (const listItem of listsOrError) {
          list.makeInDOM(listItem.name, listItem.id);

          for (const cardItem of listItem.cards) {
            card.makeInDOM(cardItem);
          }
        }
      }
      else {
        throw new Error(listsOrError);
      }
    } catch (error) {
      alert('Une erreur s\'est produite lors de la récupération des listes');
      console.error(error);
    }
  },

  handleAddFormSubmit: async function (event) {
    event.preventDefault();

    try {
      const addListFormData = new FormData(list.addFormElement);

      const response = await fetch(`${utils.baseUrl}lists`, {
        method: 'POST',
        body: addListFormData,
      });

      const listOrError = await response.json();

      if (response.status === 200) {

        list.makeInDOM(listOrError.name, listOrError.id);

        event.target.querySelector('input[name="listName"]').value = '';

        utils.closeModals();
      }
      else {
        throw new Error(listOrError);
      }
    } catch (error) {
      alert('Une erreur a eu lieu lors de la sauvegarde la liste');
      console.error(error);
    }
  },

  makeInDOM: function (listName, listId) {
    // clone the template
    const listTemplate = document.getElementById('listTemplate');
    const listClone = listTemplate.content.cloneNode(true);

    // configure the clone
    listClone.querySelector('h2').textContent = listName;
    listClone.querySelector('.panel').setAttribute('data-list-id', listId);
    listClone.querySelector('input[name="list-id"]').setAttribute('value', listId);
    listClone.querySelector('.panel-heading a').addEventListener('click', card.openModal);
    listClone.querySelector('h2').addEventListener('dblclick', list.showEditForm);
    listClone.querySelector('form').addEventListener('submit', list.handleEditFormSubmit);

    document.querySelector('#addColumn').before(listClone);

    // on doit attendre que les listes soient dans le dom pour instancier nos Sortable
    // ici on cible tous les panel block qui n'ont pas la classe sortable init
    const sortableElements = document.querySelectorAll('.panel-block:not(.sortable-init)');
    for (const sortableElement of sortableElements) {

      // instanciate sortable with 2 arguments, parent element and option object
      new Sortable(sortableElement, {
        animation: 150,
        group: 'lists', // join lists
        onEnd: function (event) {
          // get all cards from origin list and destination list
          const cardsFrom = event.from.querySelectorAll('.box');
          const cardsTo = event.to.querySelectorAll('.box');
          // transform in array with Array.from
          const cardsFromArray = Array.from(cardsFrom);
          const cardsToArray = Array.from(cardsTo);

          const allCards = cardsFromArray.concat(cardsToArray);

          let position = 0;
          for (const cardItem of allCards) {

            const id = cardItem.getAttribute('data-card-id');
            const listParent = cardItem.closest('.listItem');

            const data = new FormData();
            data.append('position', position);
            data.append('list_id', listParent.getAttribute('data-list-id'));
            fetch(`${utils.baseUrl}cards/${id}`, {
              method: 'PATCH',
              body: data,
            });

            position++;
          }
        }
      });
      sortableElement.classList.add('sortable-init');
    }
  },

  showEditForm: function (event) {
    // display edit form
    // aim h2 and set class is-hidden
    const titleElement = event.target;
    titleElement.classList.add('is-hidden');
    // aim form next to it and remove the class is-hidden
    const formElement = titleElement.nextElementSibling;
    formElement.classList.remove('is-hidden');
    // pre fill the field with the list name
    formElement.querySelector('.input').value = titleElement.textContent;
  },

  handleEditFormSubmit: async function (event) {
    event.preventDefault();

    const formElement = event.target;
    const titleElement = formElement.previousElementSibling;

    try {
      const formData = new FormData(event.target);
      const listId = formData.get('list-id');

      const response = await fetch(`${utils.baseUrl}lists/${listId}`, {
        method: 'PATCH',
        body: formData
      });
      const listModifiedOrError = await response.json();

      if (response.status === 200) {
        titleElement.textContent = listModifiedOrError.name;
        titleElement.classList.remove('is-hidden');
        formElement.classList.add('is-hidden');
      }
      else {
        throw new Error(listModifiedOrError);
      }
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la sauvegarde');
      formElement.classList.add('is-hidden');
      titleElement.classList.remove('is-hidden');
    }
  },

  openModal: function () {
    list.modalElement.classList.add('is-active');
  },
};

module.exports = list;
