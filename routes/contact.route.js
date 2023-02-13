const express = require('express');
const auth = require('../middlewares/auth');
const { Contact, validateContact } = require('../models/contact.model');
const contactRouter = express.Router();

// get contacts
contactRouter.get("/allcontacts", auth, async (req, res) => {
    try {
        const allContacts = await Contact.find({ postedBy: req.user._id }).select({
            postedBy: 0
        });

        return res.status(200).json({ contacts: allContacts });
    } catch (error) {
        res.status(500).json({
            message: "There was a server side Error!"
        });
    }
})

// Add new contact
contactRouter.post('/contact', auth, async (req, res) => {
    const { error } = validateContact(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { name, phone, address, email } = req.body;

    try {
        const setNew = new Contact({
            name, phone, address, email, postedBy: req.user._id,
        });
        const newContact = await setNew.save();

        // By this we create a [many to one relation] in between contact and user collection.
        // await User.updateOne({
        //     _id: req.user._id
        // }, {
        //     $push: {
        //         contacts: newContact._id,
        //     }
        // });
        if (!newContact) {
            res.status(404).json({ message: "Contact not found" });
        }
        else {
            res.status(200).json({ message: "A new contact was saved", newContact });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "There was a server side Error!"
        });
    }
});

// Update contact
contactRouter.put('/contact/:id', async (req, res) => {
    const { error } = validateContact(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { name, email, address, phone } = req.body;
    try {
        const { id } = req.params;
        const query = { _id: id };
        const contact = await Contact.findById(query);
        if (contact) {
            const update = await Contact.findOneAndUpdate(query, { $set: { name: name, phone: phone, address: address, email: email } });
            res.status(201).json({
                data: update,
                message: "Update successful!"
            });
        }
        // const update = await Contact.findOneAndUpdate(query, { $set: { name: name, phone: phone, address: address } });
        // if (!update) {
        //     res.status(400).json({
        //         message: "Can't update!"
        //     });
        // }
        else {
            res.status(404).json({
                message: "Contact not found!"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "There is a server side error!"
        })
    }
});

// Delete contact
contactRouter.delete('/contact/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);

        if (contact) {
            // removing contact from contact collection
            const removed = await Contact.findOneAndDelete({ _id: id });

            //updating User collection as there was a contact removed here.
            // const updateUser = await User.findOneAndUpdate({ _id: removed.user }, { $pull: { contacts: removed._id } });
            // if (removed && updateUser)

            if (removed) {
                res.status(200).json({
                    data: removed,
                    message: "remove successful!"
                });
            }
            else {
                res.status(500).json({
                    message: "There is an error inside query!"
                })
            }
        }
        else {
            res.status(404).json({
                message: "Contact not found!"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "There is a server side error!"
        })
    }
});

module.exports = contactRouter;