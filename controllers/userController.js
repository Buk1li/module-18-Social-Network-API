const { User } = require('../models');

const userController = {
    getUsers(req, res) {
        User.find()
            .select('-__v')
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate('thoughts')
            .populate('friends')
            .select('-__v')
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                res.json(user);
            })
            .catch((err) => res.status(500).json(err));
    },

    createUser({ body }, res) {
        User.create(body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                res.json(user);
            })
            .catch((err) => res.status(500).json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                res.json({ message: 'User deleted' });
            })
            .catch((err) => res.status(500).json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true }
        )
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                res.json(user);
            })
            .catch((err) => res.status(500).json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'No user found with this id!' });
                }
                res.json(user);
            })
            .catch((err) => res.status(500).json(err));
    }
};

module.exports = userController;