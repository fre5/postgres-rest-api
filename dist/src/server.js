"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var user_1 = __importDefault(require("./handlers/user"));
var products_1 = __importDefault(require("./handlers/products"));
var order_1 = __importDefault(require("./handlers/order"));
var dashboard_1 = __importDefault(require("./handlers/dashboard"));
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
(0, user_1.default)(app);
(0, products_1.default)(app);
(0, order_1.default)(app);
(0, dashboard_1.default)(app);
app.listen(port, function () {
    console.log("Listening to port: " + port);
});
exports.default = app;
