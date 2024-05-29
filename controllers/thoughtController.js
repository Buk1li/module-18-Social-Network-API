const { Thought, User } = require('../models');

const thoughtController = {
    getThoughts(req, res) {
        Thought.find()
            .select('-__v')
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .select('-__v')
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: 'No thought found with this id!' });
                }
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    },

    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'Thought created but no user with this id!' });
                }
                res.json({ message: 'Thought successfully created!' });
            })
            .catch((err) => res.status(500).json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: 'No thought found with this id!' });
                }
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: 'No thought found with this id!' });
                }
                return User.findOneAndUpdate(
                    { thoughts: params.id },
                    { $pull: { thoughts: params.id } },
                    { new: true }
                );
            })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'Thought deleted but no user with this id!' });
                }
                res.json({ message: 'Thought successfully deleted!' });
            })
            .catch((err) => res.status(500).json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true }
        )
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: 'No thought found with this id!' });
                }
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    },

    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: 'No thought found with this id!' });
                }
                res.json(thought);
            })
            .catch((err) => res.status(500).json(err));
    }
};

module.exports = thoughtController;