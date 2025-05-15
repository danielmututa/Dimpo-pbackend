"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const authController = __importStar(require("../controllers/auth/controller"));
const auth_1 = require("../middlewares/auth");
exports.default = async (app) => {
    app.post('/register', authController.register);
    app.post('/login', authController.login);
    // Protected routes
    app.post('/change-password', { preHandler: [auth_1.authenticate] }, authController.changePassword); // Authorization Bearer
    app.post('/forgot-password', authController.forgotPassword);
    app.post('/reset-password', authController.resetPassword);
    // New route for getting a user by username or email
    app.get('/user', authController.getUser);
    // http://localhost:3000/api/auth/user?username=testuser
    app.get('/users', { preHandler: [auth_1.authenticate] }, authController.getAllUsers); // Get all users (protected)
    // app.get('/users', authController.getAllUsers);
    app.delete('/users/:id', { preHandler: [auth_1.authenticate] }, authController.deleteUser); // Delete user by ID (protected)
    // Example URLs:
    // Get user by username: http://localhost:3000/api/auth/user?username=testuser
    // Get user by email: http://localhost:3000/api/auth/user?email=test@example.com
    // Get all users: http://localhost:3000/api/auth/users
    // Delete user: http://localhost:3000/api/auth/users/123 (DELETE)
};
//# sourceMappingURL=auth.js.map