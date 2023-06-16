const router = require("express").Router();

const isAuthenticatedMiddleware = require("../common/middleware/IsAuthenticatedMiddleware");
const CheckPermissionMiddleware = require("../common/middleware/CheckPermissionMiddleware");
const { roles } = require("../config");

// Controller Imports
const UserController = require("./controllers/UserController");

router.get("/",[isAuthenticatedMiddleware.check, CheckPermissionMiddleware.has(roles.ADMIN)],UserController.getAllUsers);

module.exports = router;
