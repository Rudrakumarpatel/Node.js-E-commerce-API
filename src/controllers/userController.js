const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/product");
const Order = require("../models/order");
const sequelize = require("../config/db");
const OrderItem = require("../models/OrderItem");

// User Registration
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const user1 = await User.findOne({ email: email });
    if (user1) return res.status(400).json({ message: "User already exists" });
    else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "User Registered Successfully", user, token });
    }
};

// User Login
exports.userLogin = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
};

// View All Products
exports.viewProducts = async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
};

// View Single Product
exports.viewProduct = async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product Not Found" });
    res.json(product);
};

// Place Order
exports.placeOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { items } = req.body;

        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Invalid items provided" });
        }

        // Fetch all products in one query
        const productIds = items.map(item => item.productId);
        const products = await Product.findAll({ where: { id: productIds } });

        if (products.length !== items.length) {
            return res.status(400).json({ message: "One or more products not found" });
        }

        let calculatedTotal = 0;
        let orderItems = [];

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                return res.status(400).json({ message: `Product not found: ${item.productId}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.id}` });
            }

            // Calculate total price
            calculatedTotal += product.price * item.quantity;

            // Prepare order items array
            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price // Ensure price is included
            });

            // Reduce product stock
            await product.update({ stock: product.stock - item.quantity }, { transaction });
        }

        // Create order
        const order = await Order.create(
            { userId: req.user.id, totalAmount: calculatedTotal },
            { transaction }
        );

        // Insert order items
        await OrderItem.bulkCreate(
            orderItems.map(item => ({ ...item, orderId: order.id })),
            { transaction }
        );

        await transaction.commit();

        // Fetch order with order items
        const createdOrder = await Order.findOne({
            where: { id: order.id },
            include: [{ model: OrderItem, attributes: ["productId", "quantity"] }]
        });

        res.status(201).json({ message: "Order Placed Successfully", order: createdOrder });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// View Order History
exports.viewOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{ model: OrderItem, attributes: ["productId", "quantity"] }]
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
