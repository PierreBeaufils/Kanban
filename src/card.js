const utils = require('./utils');

const card = {
  init: function () {
    card.modalElement = document.getElementById('addCardModal');
    card.addFormElement = document.getElementById('addCardForm');
  },

  handleAddFormSubmit: async function (event) {
    event.preventDefault();

    const addCardFormData = new FormData(card.addFormElement);

    const response = await fetch(`${utils.baseUrl}cards`, {
      method: 'POST',
      body: addCardFormData
    });
    const newCardOrError = await response.json();
    card.makeInDOM(newCardOrError);
    // empty the field
    event.target.querySelector('input[name="title"]').value = '';

    utils.closeModals();
  },

  /**
   * 
   * @param {
   *  title: string,
   *  id: number,
   *  list_id: number
   *  color?: string,
   * } cardInfo 
   */

  makeInDOM: function (cardInfo) {
    // clone the template
    const cardTemplate = document.getElementById('cardTemplate');
    const cardClone = cardTemplate.content.cloneNode(true);

    // configure
    cardClone.querySelector('.card-name').textContent = cardInfo.title;

    const box = cardClone.querySelector('.box');
    box.setAttribute('data-card-id', cardInfo.id);
    box.style.borderBottomColor = cardInfo.color;

    // on cible la liste possédant le bon id en fonction de l'attribut data-list-id
    // on mettra la card dans son enfant .panel-block
    const cardsList = document.querySelector(`div[data-list-id="${cardInfo.list_id}"] .panel-block`);

    const editBtn = cardClone.querySelector('.editBtn');
    editBtn.addEventListener('click', card.showEditForm);
    const formElement = cardClone.querySelector('form');
    formElement.addEventListener('submit', card.handleEditSubmit);

    // listen click on the trash to delete
    const deleteBtn = cardClone.querySelector('.deleteBtn');
    deleteBtn.addEventListener('click', card.deleteCard);

    cardsList.appendChild(cardClone);
  },

  deleteCard: async function (event) {
    event.preventDefault();

    if (confirm('Etes vous sur ?')) {
      const clickedElement = event.target;
      const cardElement = clickedElement.closest('.box');
      const id = cardElement.getAttribute('data-card-id');

      const response = await fetch(`${utils.baseUrl}cards/${id}`, {
        method: 'DELETE',
      });

      if (response.status === 200) {
        cardElement.remove();
      }
      else {
        alert('Impossible de supprimer la carte')
      }
    }
  },

  handleEditSubmit: async function (event) {
    event.preventDefault();
    const formElement = event.target;
    // je traverse le dom pour trouver le plus proche parent .box
    const cardElement = formElement.closest('.box');
    const id = cardElement.getAttribute('data-card-id');

    const formData = new FormData(formElement);

    const response = await fetch(`${utils.baseUrl}cards/${id}`, {
      method: 'PATCH',
      body: formData,
    });

    if (response.status === 200) {
      const modifiedCard = await response.json();

      formElement.classList.add('is-hidden');

      const titleElement = formElement.previousElementSibling;

      titleElement.textContent = modifiedCard.title;
      titleElement.classList.remove('is-hidden');
    }
    else {
      alert('Problème lors de l\'enregistrement');
    }
  },

  showEditForm: function (event) {
    const btnElement = event.target;
    // à partir de là on peut traverser le DOM pour remonter jusqu'au parent voulu avec closest
    const cardElement = btnElement.closest('.box');
    const formElement = cardElement.querySelector('form');
    formElement.classList.remove('is-hidden');

    const titleElement = cardElement.querySelector('.card-name');

    titleElement.classList.add('is-hidden');

    const inputElement = formElement.querySelector('.input');

    inputElement.value = titleElement.textContent;
  },

  openModal: function (event) {

    card.modalElement.classList.add('is-active');

    const input = card.modalElement.querySelector('input[name="list_id"]');

    const list = event.target.closest('.panel');

    input.value = list.getAttribute('data-list-id');
  },
};

module.exports = card;
