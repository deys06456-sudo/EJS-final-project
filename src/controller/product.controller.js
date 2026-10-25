const Product = require("../model/product.model");
const Category = require("../model/category.model");
const Brand = require("../model/brand.model");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

// Upload image buffer to Cloudinary
const uploadCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "product-management"
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        Readable.from(fileBuffer).pipe(stream);
    });
};

// Delete image from Cloudinary
const deleteCloudinaryImage = async (publicId) => {
    if (publicId) {
        return cloudinary.uploader.destroy(publicId);
    }
};

// Convert comma-separated query values into an array
const getArray = (value) => {
    if (!value) {
        return [];
    }

    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
};

class ProductController {

    // PRODUCT LIST + SEARCH + FILTER + SORT
    async getProducts(req, res) {
        try {
            const {
                search,
                color,
                size,
                category,
                brand,
                minPrice,
                maxPrice,
                sort
            } = req.query;

            // Show only active products
            const filter = {
                isDeleted: false
            };

            // Search by product name
            if (search && search.trim()) {
                filter.name = {
                    $regex: search.trim(),
                    $options: "i"
                };
            }

            // Filter by colors
            const colors = getArray(color);

            if (colors.length > 0) {
                filter.colors = {
                    $in: colors
                };
            }

            // Filter by sizes
            const sizes = getArray(size);

            if (sizes.length > 0) {
                filter.sizes = {
                    $in: sizes
                };
            }

            // Filter by category ID
            if (category) {
                filter.category = category;
            }

            // Filter by brand ID
            if (brand) {
                filter.brand = brand;
            }

            // Filter by minimum and maximum price
            if (minPrice || maxPrice) {
                filter.price = {};

                if (
                    minPrice !== undefined &&
                    minPrice !== "" &&
                    Number.isFinite(Number(minPrice))
                ) {
                    filter.price.$gte = Number(minPrice);
                }

                if (
                    maxPrice !== undefined &&
                    maxPrice !== "" &&
                    Number.isFinite(Number(maxPrice))
                ) {
                    filter.price.$lte = Number(maxPrice);
                }

                if (Object.keys(filter.price).length === 0) {
                    delete filter.price;
                }
            }

            // Sorting options
            let sortOption = {
                createdAt: -1
            };

            switch (sort) {
                case "price_low":
                    sortOption = { price: 1 };
                    break;

                case "price_high":
                    sortOption = { price: -1 };
                    break;

                case "newest":
                    sortOption = { createdAt: -1 };
                    break;

                case "oldest":
                    sortOption = { createdAt: 1 };
                    break;

                case "name_asc":
                    sortOption = { name: 1 };
                    break;

                case "name_desc":
                    sortOption = { name: -1 };
                    break;
            }

            const products = await Product.find(filter)
                .populate("category")
                .populate("brand")
                .sort(sortOption);

            const categories = await Category.find({
                isDeleted: false
            });

            const brands = await Brand.find({
                isDeleted: false
            });

            return res.render("products/list", {
                title: "Product Listing Page",
                products,
                categories,
                brands,
                query: req.query
            });

        } catch (error) {
            console.log(error);
            return res.redirect("/products");
        }
    }


    // CREATE PRODUCT PAGE
    async createProduct(req, res) {
        try {
            const categories = await Category.find({
                isDeleted: false
            });

            const brands = await Brand.find({
                isDeleted: false
            });

            return res.render("products/add", {
                title: "Add Product",
                categories,
                brands
            });

        } catch (error) {
            console.log(error);
            return res.redirect("/products");
        }
    }



    // STORE PRODUCT
    async storeProduct(req, res) {
        try {
            const {
                name,
                description,
                price,
                discountPrice,
                category,
                brand,
                sizes,
                colors,
                stock,
                status
            } = req.body;

            if (
                !name ||
                !description ||
                price === undefined ||
                price === "" ||
                !category ||
                !brand
            ) {
                return res.redirect("/products/create");
            }


            // Upload multiple images
            const images = [];

            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const result = await uploadCloudinary(
                        file.buffer
                    );

                    images.push({
                        url: result.secure_url,
                        public_id: result.public_id,
                        alt: name
                    });
                }
            }

            const product = new Product({
                name,
                description,
                price,
                discountPrice:
                    discountPrice === "" ||
                        discountPrice === undefined
                        ? undefined
                        : discountPrice,
                category,
                brand,
                sizes: Array.isArray(sizes)
                    ? sizes
                    : sizes
                        ? [sizes]
                        : [],
                colors: Array.isArray(colors)
                    ? colors
                    : colors
                        ? [colors]
                        : [],
                stock,
                images,
                status: status || "Active",
                isDeleted: false,
                deletedAt: null
            });

            await product.save();

            return res.redirect("/products");

        } catch (error) {
            console.log(error);
            return res.redirect("/products/create");
        }
    }


    
    // VIEW SINGLE PRODUCT
    async viewProduct(req, res) {
        try {
            const product = await Product.findOne({
                _id: req.params.id,
                isDeleted: false
            })
                .populate("category")
                .populate("brand");

            if (!product) {
                return res.redirect("/products");
            }

            return res.render("products/view", {
                title: "Product Details",
                product
            });

        } catch (error) {
            console.log(error);
            return res.redirect("/products");
        }
    }


    // EDIT PRODUCT PAGE
    async editProduct(req, res) {
        try {
            const product = await Product.findOne({
                _id: req.params.id,
                isDeleted: false
            });

            if (!product) {
                return res.redirect("/products");
            }

            const categories = await Category.find({
                isDeleted: false
            });

            const brands = await Brand.find({
                isDeleted: false
            });

            return res.render("products/edit", {
                title: "Edit Product",
                product,
                categories,
                brands
            });

        } catch (error) {
            console.log(error);
            return res.redirect("/products");
        }
    }


    // UPDATE PRODUCT
    async updateProduct(req, res) {
        try {
            const id = req.params.id;

            const product = await Product.findOne({
                _id: id,
                isDeleted: false
            });

            if (!product) {
                return res.redirect("/products");
            }

            const {
                name,
                description,
                price,
                discountPrice,
                category,
                brand,
                sizes,
                colors,
                stock,
                status
            } = req.body;

            const updateData = {
                name,
                description,
                price,
                discountPrice:
                    discountPrice === ""
                        ? undefined
                        : discountPrice,
                category,
                brand,
                sizes: Array.isArray(sizes)
                    ? sizes
                    : sizes
                        ? [sizes]
                        : [],
                colors: Array.isArray(colors)
                    ? colors
                    : colors
                        ? [colors]
                        : [],
                stock,
                status
            };

            // Keep old images and add new images
            const images = [...(product.images || [])];

            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const result = await uploadCloudinary(
                        file.buffer
                    );

                    images.push({
                        url: result.secure_url,
                        public_id: result.public_id,
                        alt: name || product.name
                    });
                }
            }

            updateData.images = images;

            await Product.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            );

            return res.redirect("/products");

        } catch (error) {
            console.log(error);
            return res.redirect("/products");
        }
    }


    // SOFT DELETE PRODUCT
    async deleteProduct(req, res) {
        try {
            await Product.findOneAndUpdate(
                {
                    _id: req.params.id,
                    isDeleted: false
                },
                {
                    isDeleted: true,
                    deletedAt: new Date()
                },
                {
                    new: true
                }
            );

            return res.redirect("/products");

        } catch (error) {
            console.log(error);
            return res.redirect("/products");
        }
    }


    // RECYCLE BIN
    async recycleBin(req, res) {
        try {
            const products = await Product.find({
                isDeleted: true
            })
                .populate("category")
                .populate("brand")
                .sort({
                    deletedAt: -1
                });

            return res.render("products/recycle-bin", {
                title: "Product Recycle Bin",
                products
            });

        } catch (error) {
            console.log(error);
            return res.redirect("/products");
        }
    }


    // RESTORE PRODUCT
    async restoreProduct(req, res) {
        try {
            await Product.findOneAndUpdate(
                {
                    _id: req.params.id,
                    isDeleted: true
                },
                {
                    isDeleted: false,
                    deletedAt: null
                },
                {
                    new: true
                }
            );

            return res.redirect("/products/recycle-bin");

        } catch (error) {
            console.log(error);
            return res.redirect("/products/recycle-bin");
        }
    }


    // PERMANENT DELETE PRODUCT
    async permanentDeleteProduct(req, res) {
        try {
            const product = await Product.findOne({
                _id: req.params.id,
                isDeleted: true
            });

            if (!product) {
                return res.redirect("/products/recycle-bin");
            }

            // Delete uploaded images from Cloudinary
            for (const image of product.images || []) {
                if (image.public_id) {
                    await deleteCloudinaryImage(image.public_id);
                }
            }

            await Product.findByIdAndDelete(product._id);

            return res.redirect("/products/recycle-bin");

        } catch (error) {
            console.log(error);
            return res.redirect("/products/recycle-bin");
        }
    }

}

module.exports = new ProductController();
