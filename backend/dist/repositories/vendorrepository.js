"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRepository = void 0;
const prisma_1 = require("../lib/prisma");
class VendorRepository {
    async findByPhone(phone) {
        return prisma_1.prisma.vendor.findUnique({ where: { phone } });
    }
    async findById(id) {
        return prisma_1.prisma.vendor.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma_1.prisma.vendor.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.vendor.update({ where: { id }, data });
    }
}
exports.vendorRepository = new VendorRepository();
