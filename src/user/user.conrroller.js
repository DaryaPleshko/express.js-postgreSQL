const express = require("express");
const { userCreate, getNewsById, updateUsers, deleteUsers, getAllNews, patchUsers } = require("./user.servise")
const { validateStudent, validatePatch } = require("../helper/validate")

const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const { name, surname, birth, city, age } = req.body;
        const postedUser = await userCreate(name, surname, birth, city, age);
        res.status(200).send(postedUser);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.get("/", async (req, res) => {
    try {
        const allNews = await getAllNews();
        res.status(200).send(allNews);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const gotNews = await getNewsById(id);
        res.status(200).send(gotNews);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.put("/:id/:infoID", validateStudent, async (req, res) => {
    try {
        const { id, infoID } = req.params;
        const { name, surname, birth, city, age } = req.body;
        const updatedUsers = await updateUsers(id, infoID, name, surname, birth, city, age);
        res.status(200).send(updatedUsers);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.delete("/:id/:infoID", async (req, res) => {
    try {
        const { id, infoID } = req.params;
        const deletedUsers = await deleteUsers(id, infoID);
        res.status(200).send(deletedUsers);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.patch("/:id/:infoID", validatePatch, async (req, res) => {
    try {
        const { id, infoID } = req.params;
        const updatedUsers = await patchUsers(id, infoID, req.body);
        res.status(200).send(updatedUsers);
    } catch (error) {
        res.status(404).send(error.message);
    }
})

module.exports = router