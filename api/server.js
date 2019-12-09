// Dependencies
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// Server instance
const server = express();

// Library Middleware
server.use(cors(), helmet(), express.json());
const authenticate = require("../middleware/auth-middleware");

// Routers
const usersRouter = require("../controllers/user");
const authRouter = require("../controllers/auth");
const portfoliosRouter = require("../controllers/portfolio");
const symbolsRouter = require("../controllers/symbol");
const symbolsDetailsRouter = require("../controllers/symbol_detail");
const portfoliosSymbolsRouter = require("../controllers/portfolio_symbol");

// Internal middleware
const errorHandler = require("../middleware/errorHandling");

// API endpoints
server.use("/api/users", authenticate, usersRouter);
server.use("/api/auth", authRouter);
server.use("/api/portfolios", authenticate, portfoliosRouter);
server.use("/api/symbols", authenticate, symbolsRouter);
server.use("/api/symbols_details", authenticate, symbolsDetailsRouter);
server.use("/api/portfolios_symbols", authenticate, portfoliosSymbolsRouter);

// sanity check
server.get("/", (req, res) => {
  res.send("Welcome to Returns Calculator Backend API!");
});

// async error handling. must come AFTER API routes or will raise TypeError
server.use(errorHandler);

module.exports = server;
