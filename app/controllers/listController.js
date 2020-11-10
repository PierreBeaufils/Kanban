const { List, Card } = require('../models');

const listController = {

    list: async (req, res) => {
        try {
            const lists = await List.findAll({
                include: {
                    association: 'cards',
                    include: 'labels',
                },
                // https://sequelize.org/master/manual/model-querying-basics.html#ordering
                order: [
                    ['position', 'ASC'],
                    ['cards', 'position', 'ASC']
                ],
            });

            res.json(lists);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    create: async (req, res) => {
        try {
            if (!req.body.listName) {
                throw new Error('Il faut passer en POST un paramètre listName');
            }
            const newList = await List.create({
                name: req.body.listName,
                position: req.body.position,
            });

            res.json(newList);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    read: async (req, res) => {
        try {
            const id = req.params.id;

            const list = await List.findByPk(id, {
                include: {
                    association: 'cards',
                    include: 'labels',
                }
            });

            if (list) {
                res.json(list);
            }

            else {
                res.status(404).json(`Aucune liste à l'id ${id}`);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    update: async (req, res) => {
        try {
            const id = req.params.id;

            const list = await List.findByPk(id);

            if (list) {

                if (req.body.listName) {
                    list.name = req.body.listName;
                }

                if (req.body.position) {

                    list.position = req.body.position;
                }

                const listSaved = await list.save();

                res.json(listSaved);
            }

            else {
                res.status(404).json(`Aucune liste à l'id ${id}`);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const list = await List.findByPk(id);

            if (list) {
                await list.destroy();
                res.json('Liste supprimée');
            }

            else {
                res.status(404).json(`Aucune liste à l'id ${id}`);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    readCards: async (req, res) => {
        try {

            const id = req.params.id;

            const cards = await Card.findAll({
                where: {
                    list_id: id,
                },
                include: 'labels'
            });

            res.json(cards);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    createOrUpdate: async (req, res) => {
        try {

            let list;
            if (req.params.id) {
                list = await List.findByPk(req.params.id);
            }

            if (list) {

                await listController.update(req, res);
            } else {

                await listController.create(req, res);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).send(error);
        }
    },
};

module.exports = listController;
