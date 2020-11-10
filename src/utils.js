const utils = {

	baseUrl: 'http://localhost:3000/',

	closeModals: function () {

		const modals = document.querySelectorAll('.modal');
		modals.forEach((modal) => {
			modal.classList.remove('is-active');
		})
	},
};

module.exports = utils;
