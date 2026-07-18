"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const authUtils_1 = require("../lib/authUtils");
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or malformed Authorization header" });
    }
    const token = header.slice("Bearer ".length);
    try {
        const payload = (0, authUtils_1.verifyToken)(token);
        req.vendorId = payload.vendorId;
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
