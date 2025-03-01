// const { Admin, Category, Product, order } = require("../models");
const Admin = require("../models/admin");
const Category = require("../models/category");
const Product = require("../models/product");
const Order = require("../models/order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OrderItem = require("../models/OrderItem");
const { Sequelize } = require("sequelize");

// Admin Login
exports.adminAuth = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            // Register new admin
            const hashedPassword = await bcrypt.hash(password, 10);
            admin = await Admin.create({ name, email, password: hashedPassword });

            // Generate JWT token
            const token = jwt.sign({ id: admin.id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "7d" });

            return res.status(201).json({ message: "Admin Registered Successfully", admin, token });
        }

        // Login existing admin
        if (!(await bcrypt.compare(password, admin.password))) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin.id,isAdmin: true}, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ message: "Login Successful", admin, token });

    } catch (error) {
        res.status(500).json({ message: "Error in authentication", error });
    }
};

// Category Management
exports.addCategory = async (req, res) => {
    const {name} = req.body;
    const Category1 = await Category.findOne({name:name});
    if(Category1) return res.status(409).json({ message: "Category already exists" });
    const category = await Category.create(req.body);
    res.json(category);
};

exports.updateCategory = async (req, res) => {
    await Category.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Category Updated" });
};

exports.deleteCategory = async (req, res) => {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ message: "Category Deleted" });
};

exports.listCategories = async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
};

// Product Management
exports.addProduct = async (req, res) => {
    const { name, price, description, categoryId } = req.body;
    const product1 = await Product.findOne({ where: { name: name, categoryId: categoryId } });
    if(product1) return res.status(409).json({ message: "Product already exists in this category" });
    const product = await Product.create(req.body);
    res.json(product);
};

exports.updateProduct = async (req, res) => {
    await Product.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Product Updated" });
};

exports.deleteProduct = async (req, res) => {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: "Product Deleted" });
};

exports.listProducts = async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
};

// Order Management
exports.getOrders = async (req, res) => {
    const orders = await Order.findAll();
    res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
    await Order.update({ status: req.body.status }, { where: { id: req.params.id } });
    res.json({ message: "Order Status Updated" },Order);
};

exports.topSellingProducts = async (req, res) => {
    try {
        const topProducts = await OrderItem.findAll({
            attributes: [
                "productId",
                [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSold"]
            ],
            include: [
                {
                    model: Product,
                    attributes: ["name", "price"]
                }
            ],
            group: ["productId", "Product.id"],
            order: [[Sequelize.literal("totalSold"), "DESC"]],
            limit: 10 
        });

        res.json({ message: "Top Selling Products", data: topProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
