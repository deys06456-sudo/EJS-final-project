
const Category = require('../model/category.model');

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            isDeleted: false
        }).sort({ createdAt: -1 });

        return res.render('category/list', {
            categories
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to get categories');
    }
};

// SHOW CREATE CATEGORY PAGE
const createCategory = (req, res) => {
    return res.render('category/add');
};

// STORE CATEGORY
const storeCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        if (!name || !description) {
            return res.status(400).send('Name and description are required');
        }

        await Category.create({
            name,
            description,
            status: status || 'active'
        });

        return res.redirect('/categories');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to create category');
    }
};

// VIEW SINGLE CATEGORY
const viewCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!category) {
            return res.status(404).send('Category not found');
        }

        return res.render('category/view', {
            category
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to view category');
    }
};

// SHOW EDIT CATEGORY PAGE
const editCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!category) {
            return res.status(404).send('Category not found');
        }

        return res.render('category/edit', {
            category
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to edit category');
    }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        if (!name || !description) {
            return res.status(400).send('Name and description are required');
        }

        const category = await Category.findOneAndUpdate(
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

        if (!category) {
            return res.status(404).send('Category not found');
        }

        return res.redirect('/categories');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to update category');
    }
};

// SOFT DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate(
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

        if (!category) {
            return res.status(404).send('Category not found');
        }

        return res.redirect('/categories');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to delete category');
    }
};

// GET RECYCLE BIN
const recycleBin = async (req, res) => {
    try {
        const categories = await Category.find({
            isDeleted: true
        }).sort({ updatedAt: -1 });

        return res.render('category/recycle-bin', {
            categories
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to load recycle bin');
    }
};

// RESTORE CATEGORY
const restoreCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate(
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

        if (!category) {
            return res.status(404).send('Category not found in recycle bin');
        }

        return res.redirect('/categories/recycle-bin');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to restore category');
    }
};

// PERMANENT DELETE CATEGORY
const permanentDeleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({
            _id: req.params.id,
            isDeleted: true
        });

        if (!category) {
            return res.status(404).send('Category not found in recycle bin');
        }

        return res.redirect('/categories/recycle-bin');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Failed to permanently delete category');
    }
};

module.exports = {
    getCategories,
    createCategory,
    storeCategory,
    viewCategory,
    editCategory,
    updateCategory,
    deleteCategory,
    recycleBin,
    restoreCategory,
    permanentDeleteCategory
};
