const Brand = require('../model/brand.model');

// GET ALL BRANDS
const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find({
            isDeleted: false
        }).sort({ createdAt: -1 });

        return res.render('brand/list', {
            brands
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to get brands');
    }
};

// SHOW CREATE BRAND PAGE
const createBrand = (req, res) => {
    return res.render('brand/add');
};

// STORE BRAND
const storeBrand = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        if (!name || !description) {
            return res.status(400).send('Name and description are required');
        }

        await Brand.create({
            name,
            description,
            status: status || 'active'
        });

        return res.redirect('/brands');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to create brand');
    }
};

// VIEW SINGLE BRAND
const viewBrand = async (req, res) => {
    try {
        const brand = await Brand.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!brand) {
            return res.status(404).send('Brand not found');
        }

        return res.render('brand/view', {
            brand
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to view brand');
    }
};

// SHOW EDIT BRAND PAGE
const editBrand = async (req, res) => {
    try {
        const brand = await Brand.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!brand) {
            return res.status(404).send('Brand not found');
        }

        return res.render('brand/edit', {
            brand
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to edit brand');
    }
};

// UPDATE BRAND
const updateBrand = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        if (!name || !description) {
            return res.status(400).send('Name and description are required');
        }

        const brand = await Brand.findOneAndUpdate(
            {
                _id: req.params.id,
                isDeleted: false
            },
            {
                name,
                description,
                status: status || 'active'
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!brand) {
            return res.status(404).send('Brand not found');
        }

        return res.redirect('/brands');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to update brand');
    }
};

// SOFT DELETE BRAND
const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findOneAndUpdate(
            {
                _id: req.params.id,
                isDeleted: false
            },
            {
                isDeleted: true
            },
            {
                new: true
            }
        );

        if (!brand) {
            return res.status(404).send('Brand not found');
        }

        return res.redirect('/brands');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to delete brand');
    }
};

// GET RECYCLE BIN
const recycleBin = async (req, res) => {
    try {
        const brands = await Brand.find({
            isDeleted: true
        }).sort({ updatedAt: -1 });

        return res.render('brand/recycle-bin', {
            brands
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to load recycle bin');
    }
};

// RESTORE BRAND
const restoreBrand = async (req, res) => {
    try {
        const brand = await Brand.findOneAndUpdate(
            {
                _id: req.params.id,
                isDeleted: true
            },
            {
                isDeleted: false
            },
            {
                new: true
            }
        );

        if (!brand) {
            return res.status(404).send('Brand not found in recycle bin');
        }

        return res.redirect('/brands/recycle-bin');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to restore brand');
    }
};

// PERMANENT DELETE BRAND
const permanentDeleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findOneAndDelete({
            _id: req.params.id,
            isDeleted: true
        });

        if (!brand) {
            return res.status(404).send('Brand not found in recycle bin');
        }

        return res.redirect('/brands/recycle-bin');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to permanently delete brand');
    }
};

module.exports = {
    getBrands,
    createBrand,
    storeBrand,
    viewBrand,
    editBrand,
    updateBrand,
    deleteBrand,
    recycleBin,
    restoreBrand,
    permanentDeleteBrand
};
