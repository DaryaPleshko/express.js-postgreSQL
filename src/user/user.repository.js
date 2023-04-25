const { pool } = require("../database");

const userCreateDB = async (name, surname, birth, city, age) => {
    const connect = await pool.connect();
    const sqlInfo = `INSERT INTO students_info ( birth, city, age) 
    VALUES ($1, $2, $3) RETURNING students_info.*`;
    const objInfo = (await connect.query(sqlInfo, [birth, city, age])).rows[0];

    const sqlStudents = `INSERT into students (name, surname, info_id)
    VALUES ($1, $2, $3)  RETURNING students.*`;
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
    try {
        await connect.query('BEGIN');

        const sqlInfo = `UPDATE students_info SET birth = $1, city = $2, age = $3 WHERE id = $4`;
        await connect.query(sqlInfo, [birth, city, age, infoID]);

        const sqlStudents = `UPDATE students SET name = $1, surname = $2 WHERE id = $3 RETURNING students.*`;
        const objStudents = (await connect.query(sqlStudents, [name, surname, id])).rows;

        await connect.query('COMMIT');

        if (!objStudents.length > 0) throw new Error('Неккоректные значения');
        return objStudents;
    } catch (error) {
        console.log('EXCEPTION IN updateUsersDB');
        await connect.query('ROLLBACK');
    } finally {
        connect.release();
    }
}

const deleteUsersDB = async (id, infoID) => {
    const connect = await pool.connect();
    try {
        await connect.query('BEGIN');

        const sqlStudents = `
        DELETE FROM students
        WHERE id = $1 RETURNING students.* `;
        await connect.query(sqlStudents, [id]);

        const sqlInfo = `
        DELETE FROM students_info
        WHERE id = $1 RETURNING students_info.* `;
        await connect.query(sqlInfo, [infoID]);

        const sqlResult = `
        SELECT s.id, s.name, s.surname, i.age, i.city, i.birth 
        FROM students as s 
        JOIN students_info as i ON i.id = s.info_id`;
        const result = (await connect.query(sqlResult)).rows;

        await connect.query('COMMIT');
        return result;
    } catch (error) {
        console.log(error.message);
        await connect.query('ROLLBACK');
    } finally {
        connect.release()
    }
}

const patchUsersDB = async (id, infoID, obj) => {
    const connect = await pool.connect();
    try {
        await connect.query('BEGIN');

        const sql = `
        SELECT *
        FROM students as s 
        JOIN students_info as i ON i.id = s.info_id
        WHERE s.id = $1
        `;
        const sqlSelect = (await connect.query(sql, [id])).rows[0];

        const objAll = { ...sqlSelect, ...obj }

        const sqlInfo = `
        UPDATE students_info SET birth = $1, city = $2, age = $3
        WHERE id = $4
        `;
        await connect.query(sqlInfo, [objAll.birth, objAll.city, objAll.age, infoID]);

        const sqlStudents = `UPDATE students SET name = $1, surname = $2 WHERE id = $3 RETURNING students.*`;
        await connect.query(sqlStudents, [objAll.name, objAll.surname, id]);

        const sqlRes = `
        SELECT s.id, s.name, s.surname, i.age, i.city, i.birth 
        FROM students_info as i 
        JOIN students as s ON s.info_id = i.id
        where s.id = $1
        `;
        const result = (await connect.query(sqlRes, [id])).rows;

        await connect.query('COMMIT');

        if (!result.length > 0) throw new Error('RESULT IS EMPTY');
        return result;
    } catch (error) {
        console.log(error.message);
        await connect.query('ROLLBACK');
    } finally {
        connect.release()
    }
}

module.exports = { userCreateDB, getUsersDB, getNewsByIdDB, updateUsersDB, deleteUsersDB, patchUsersDB }