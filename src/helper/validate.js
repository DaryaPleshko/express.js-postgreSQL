const validateStudent = (req, res, next) => {
    const { id, infoID } = req.params;
    if (!id && infoID) throw new Error('ID AND INFO_ID NOT FOUND IN URL');
    if (!Object.keys(req.body).length) throw new Error('BODY IS EMPTY');
    next();
}

const validatePatch = (req, res, next) => {
    const { birth } = req.body;
    if (!/^[\d{4}\-\d{2}\-\d{2}]/g.test(birth)) throw new Error('Некорректный ввод');
    next();
}

module.exports = { validateStudent, validatePatch }