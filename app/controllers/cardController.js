const { Card, Label } = require('../models');

const cardController = {
    list: async (req, res) => {
        try {
            const cards = await Card.findAll({
                include: 'labels',
                order: [
                    ['position', 'ASC'],
                ],
            });
            res.json(cards);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    create: async (req, res) => {
        try {
            if (!req.body.title) {
                throw new Error('title obligatoire');
            }
            if (!req.body.list_id) {
                throw new Error('list_id obligatoire');
            }
            const newCard = await Card.create({
                title: req.body.title,
                color: req.body.color,
                position: req.body.position,
                list_id: req.body.list_id,
            });
            res.json(newCard);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    read: async (req, res) => {
        try {
            const id = req.params.id;
            const card = await Card.findByPk(id, {
                include: 'labels',
                order: [
                    ['position', 'ASC']
                ],
            });
            if (card) {
                res.json(card);
            }
            else {
                res.status(404).json(`Aucune carte à l'id ${id}`);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    update: async (req, res) => {
        try {
            const id = req.params.id;
            const card = await Card.findByPk(id);

            if (card) {
                if (req.body.title) {
                    card.title = req.body.title;
                }
                if (req.body.color) {
                    card.color = req.body.color;
                }
                if (req.body.position) {
                    card.position = req.body.position;
                }
                if (req.body.list_id) {
                    card.list_id = req.body.list_id;
                }

                const cardSaved = await card.save();

                res.json(cardSaved);
            }
            else {
                res.status(404).json(`Aucune carte à l'id ${id}`);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const card = await Card.findByPk(id);

            if (card) {
                await card.destroy();
                res.json('Carte supprimée');
            }
            else {
                res.status(404).json(`Aucune carte à l'id ${id}`);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    addLabelToCard: async (req, res) => {
        try {
            const cardId = req.params.card_id;
            const labelId = req.params.label_id;

            const card = await Card.findByPk(cardId, {
                include: 'labels'
            });
            if (!card) {
                return res.status(404).json('Carte non trouvée');
            }

            const label = await Label.findByPk(labelId);
            if (!label) {
                return res.status(404).json('Label non trouvé');
            }

            await card.addLabel(label);
            // reload to see modification
            await card.reload();

            res.json(card);
        } catch (error) {
            console.trace(error);
            res.status(500).send(error);
        }
    },

    removeLabelFromCard: async (req, res) => {
        try {

            const cardId = req.params.card_id;
            const labelId = req.params.label_id;

            const card = await Card.findByPk(cardId, {
                include: 'labels'
            });
            if (!card) {
                return res.status(404).json('Carte non trouvée');
            }

            const label = await Label.findByPk(labelId);
            if (!label) {
                return res.status(404).json('Label non trouvé');
            }

            await card.removeLabel(label);
            await card.reload();

            res.json(card);
        } catch (error) {
            console.trace(error);
            res.status(500).send(error);
        }
    },

    createOrUpdate: async (req, res) => {
        try {
            let card;
            if (req.params.id) {
                card = await Card.findByPk(req.params.id);
            }

            if (card) {
                await cardController.update(req, res);
            } else {

                await cardController.create(req, res);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).send(error);
        }
    },
};

module.exports = cardController;
