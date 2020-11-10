const list = require('./list');
const card = require('./card');
const utils = require('./utils');

const app = {

  init: function () {

    list.getListsFromAPI();
    list.init();
    card.init();
    app.addListenerToActions();
  },

  addListenerToActions: function () {

    const buttonElement = document.getElementById('addListButton');
    buttonElement.addEventListener('click', list.openModal);

    const closeElements = document.querySelectorAll('.close');

    closeElements.forEach((closeElement) => {
      closeElement.addEventListener('click', utils.closeModals);
    });

    list.addFormElement.addEventListener('submit', list.handleAddFormSubmit);
    card.addFormElement.addEventListener('submit', card.handleAddFormSubmit);

    // + for adding cards
    const cardButtonElements = document.querySelectorAll('.panel-heading a');
    cardButtonElements.forEach((button) => {
      button.addEventListener('click', card.openModal);
    });
  },

};

document.addEventListener('DOMContentLoaded', app.init);