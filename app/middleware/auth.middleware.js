function checkUserIsEnabled(req, res, next) {
    // TODO: Placeholder logic for now, update later when we have account status
    if (!req.identity['id'] || req.identity.id === undefined) {
        res.status(401).json({ message: 'User account is disabled or does not exist' });
    }

    next();
}

export default { checkUserIsEnabled }