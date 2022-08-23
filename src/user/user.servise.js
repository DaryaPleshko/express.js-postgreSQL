const { userCreateDB, getNewsByIdDB, getUsersDB, updateUsersDB, updatePatchUsersDB, deleteUsersDB } = require("./user.repository")

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

const updatePatchUsers = async (id, infoID, obj) => {
    const updatedUsersDB = await updatePatchUsersDB(id, infoID, obj);

    if (!updatedUsersDB.length) throw new Error('Not Found student');
    return updatedUsersDB;
}

const deleteUsers = async (id) => {
    const updatedUsersDB = await deleteUsersDB(id);
    return updatedUsersDB;
}

module.exports = { userCreate, updateUsers, updatePatchUsers, deleteUsers, getNewsById, getAllNews }