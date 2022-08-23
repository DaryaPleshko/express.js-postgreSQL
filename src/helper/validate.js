const validateStudent = (req, res, next) => {
    const { id, infoID } = req.params;
    if (!id && infoID) throw new Error('ID AND INFO_ID NOT FOUND IN URL')
    if (!Object.keys(req.body).length) throw new Error('BODY IS EMPTY')
    next()
}

module.exports = { validateStudent }