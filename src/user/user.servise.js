const { userCreateDB, getNewsByIdDB, getUsersDB, updateUsersDB, deleteUsersDB, patchUsersDB } = require("./user.repository")

const userCreate = async (name, surname, birth, city, age) => {
    const userCreatedDB = await userCreateDB(name, surname, birth, city, age);
    return userCreatedDB;
}

const getAllNews = async () => {
    const data = await getUsersDB();
    return data;
}

const getNewsById = async (id) => {
    const userCreatedDB = await getNewsByIdDB(id);
    return userCreatedDB;
}

const updateUsers = async (id, infoID, name, surname, birth, city, age) => {
    const updatedUsersDB = await updateUsersDB(id, infoID, name, surname, birth, city, age);
    return updatedUsersDB;
}

const deleteUsers = async (id, infoID) => {
    const updatedUsersDB = await deleteUsersDB(id, infoID);
    return updatedUsersDB;
}

const patchUsers = async (id, infoID, obj) => {
    const updatedUsersDB = await patchUsersDB(id, infoID, obj);
    return updatedUsersDB;
}

module.exports = { userCreate, updateUsers, deleteUsers, getNewsById, getAllNews, patchUsers }