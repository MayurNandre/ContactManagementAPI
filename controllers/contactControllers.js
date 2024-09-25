//This will handle error no need to define try catch block
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactsModel");

//@desc get all contacts
//@routes GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

//@desc create new contact
//@routes POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    console.log("Request Body is ", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All feilds are mandatory !");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    });
    res.status(201).json(contact);
});

//@desc get  contact
//@routes GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});
//@desc Update contact
//@routes PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id.tostring() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contact");
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedContact);
});

//@desc Delete contact
//@routes Delete /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.tostring() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to delete other user contacts");
    }
    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact);
});


module.exports = { getContacts, createContact, getContact, updateContact, deleteContact };