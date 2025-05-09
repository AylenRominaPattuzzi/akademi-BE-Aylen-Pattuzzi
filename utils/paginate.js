const paginatedResponse = async (req, res, objects, filter = {}) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await objects.countDocuments(filter);
    objects = await objects.find(filter).skip(skip).limit(limit);

    res.json({ total, page, limit, objects });
}

exports.paginatedResponse = paginatedResponse