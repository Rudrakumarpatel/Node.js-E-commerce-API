const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const OrderItem = require("./OrderItem");

const Order = sequelize.define("Order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: { 
        type: DataTypes.ENUM("pending", "confirmed", "shipped", "delivered", "cancelled"),
        defaultValue: "pending" 
    },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false }
});

// Relationships
Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

module.exports = Order;
