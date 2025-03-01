const app = require("./src/app");
const sequelize = require("./src/config/db");

const startServer = async () => {
    try {
        await sequelize.sync({ force: false });
        await sequelize.authenticate();
        console.log("Database connected.");
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to database:", err);
    }
};

startServer();
