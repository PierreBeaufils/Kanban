const mainController = {
    notFound: (req, res) => {
        res.status(404).json('Ce endpoint n\'existe pas');
    },
};

module.exports = mainController;
