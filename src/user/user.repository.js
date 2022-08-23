const { pool } = require("../database");

const userCreateDB = async (name, surname, birth, city, age) => {
    const connect = await pool.connect();
    const sqlInfo = `INSERT INTO students_info ( birth, city, age) 
    VALUES ($1, $2, $3) RETURNING students_info.*`;
    const objInfo = (await connect.query(sqlInfo, [birth, city, age])).rows[0];

    const sqlStudents = `INSERT into students (name, surname, info_id)
    VALUES ($1, $2, $3)  RETURNING students.*`
    const objStudents = (await connect.query(sqlStudents, [name, surname, objInfo.id])).rows;
    return objStudents;
}

const getNewsByIdDB = async (id) => {
    const connect = await pool.connect();
    const sql = `        
    SELECT s.id, s.name, s.surname, i.age, i.city, i.birth 
    FROM students as s 
    JOIN students_info as i ON i.id = s.id 
    where s.id = $1`;
    const obj = (await connect.query(sql, [id])).rows;
    console.log(obj)
    return obj;
}

const getUsersDB = async () => {
    const connect = await pool.connect();
    const sql = `
    SELECT s.id, s.name, s.surname, i.age, i.city, i.birth 
    FROM students as s 
    JOIN students_info as i ON i.id = s.id  
    `;
    const result = (await connect.query(sql)).rows;
    return result;
}

const updateUsersDB = async (id, infoID, name, surname, birth, city, age) => {
    const connect = await pool.connect();

    const sqlInfo = `UPDATE students_info SET birth = $1, city = $2, age = $3
    WHERE id = $4`;
    await connect.query(sqlInfo, [birth, city, age, infoID]);

    const sqlStudents = `UPDATE students SET name = $1, surname = $2
    WHERE id = $3 RETURNING students.*`;
    const objStudents = (await connect.query(sqlStudents, [name, surname, id])).rows;
    return objStudents;
}

const updatePatchUsersDB = async (id, infoID, obj) => {
    const connect = await pool.connect();

    const sqlSelectInfo = `
        SELECT s.name, s.surname, s.id, i.birth, i.city, i.age, i.id as info_id
        FROM students_info as i
        JOIN students as s ON s.info_id = i.id 
        WHERE s.id = $1
    `;
    const select = (await connect.query(sqlSelectInfo, [id])).rows;

    if (!select.length) throw new Error('Not Found object of student in student_info and students TABLE in DATABASE')

    const infodbobj = { ...select, ...obj }

    const sqlInfo = `
        UPDATE students_info SET birth = $1, city = $2, age = $3
        WHERE id = $4
    `;
    await connect.query(sqlInfo, [infodbobj.birth, infodbobj.city, infodbobj.age, infodbobj.info_id]);

    const sqlStudents = `
        UPDATE students SET name = $1, surname = $2
        WHERE id = $3
    `;
    await connect.query(sqlStudents, [infodbobj.name, infodbobj.surname, infodbobj.id])

    const sqlResult = `
        SELECT s.id, s.name, s.surname, i.age, i.city, i.birth 
        FROM students as s 
        JOIN students_info as i ON i.id = s.id 
        where s.id = $1
    `;
    const result = (await connect.query(sqlResult, [id])).rows;

    return result;
}


const deleteUsersDB = async (id) => {
    const connect = await pool.connect();

    const sqlInfo = `
    DELETE FROM students_info
    WHERE id = $1 RETURNING students_info.*
    `;
    await connect.query(sqlInfo, [id]);

    const sqlStudents = `
    DELETE FROM students
    WHERE id = $1 RETURNING students.*
    `;
    await connect.query(sqlStudents, [id]);

    const sqlResult = `
    SELECT s.id, s.name, s.surname, i.age, i.city, i.birth 
    FROM students as s 
    JOIN students_info as i ON i.id = s.id 
    WHERE s.id = $1
    `;

    const result = (await connect.query(sqlResult, [id])).rows;
    return result;
}

module.exports = { userCreateDB, getUsersDB, getNewsByIdDB, updateUsersDB, updatePatchUsersDB, deleteUsersDB }