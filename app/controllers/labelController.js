const { Label } = require('../models');

const labelController = {

    list: async (req, res) => {
        try {

            const labels = await Label.findAll();

            res.json(labels);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    create: async (req, res) => {
        try {

            if (!req.body.name) {
                throw new Error('name obligatoire');
            }

            const newLabel = await Label.create({
                name: req.body.name,
                color: req.body.color,
            });

            res.json(newLabel);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    read: async (req, res) => {
        try {

            const id = req.params.id;

            const label = await Label.findByPk(id);

            if (label) {
                res.json(label);
            }

            else {
                res.status(404).json(`Aucun label à l'id ${id}`);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    update: async (req, res) => {
        try {

            const id = req.params.id;

            const label = await Label.findByPk(id);

            if (label) {

                if (req.body.name) {
                    label.name = req.body.name;
                }
                if (req.body.color) {
                    label.color = req.body.color;
                }

                const labelSaved = await label.save();

                res.json(labelSaved);
            }

            else {
                res.status(404).json(`Aucun label à l'id ${id}`);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const label = await Label.findByPk(id);

            if (label) {

                await label.destroy();
                res.json('Label supprimé');
            }

            else {
                res.status(404).json(`Aucun label à l'id ${id}`);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    createOrUpdate: async (req, res) => {
        try {

            let label;
            if (req.params.id) {
                label = await Label.findByPk(req.params.id);
            }

            if (label) {

                await labelController.update(req, res);
            } else {

                await labelController.create(req, res);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).send(error);
        }
    },
};

module.exports = labelController;
