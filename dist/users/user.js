"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const undici_1 = require("undici");
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, undici_1.fetch)("https://dummyjson.com/users?limit=1000");
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const data = yield response.json();
        const departments = data.users.map((res) => res.company.department);
        const groupedByDepartment = data.users.reduce((acc, user) => {
            let department_name = user.company.department;
            department_name = department_name.replace(/ /g, "_");
            if (!acc[department_name]) {
                acc[department_name] = {
                    male: 0,
                    female: 0,
                    ageRange: '',
                    hair: {},
                    addressUser: {}
                };
            }
            if (user.gender === 'male') {
                acc[department_name].male += 1;
            }
            else if (user.gender === 'female') {
                acc[department_name].female += 1;
            }
            if (user.age) {
                const department = acc[department_name];
                if (department.ageRange === '') {
                    department.ageRange = `${user.age} - ${user.age}`;
                }
                else {
                    const [minAge, maxAge] = department.ageRange.split(' - ').map(Number);
                    const newMinAge = Math.min(minAge, user.age);
                    const newMaxAge = Math.max(maxAge, user.age);
                    department.ageRange = `${newMinAge} - ${newMaxAge}`;
                }
            }
            if (user.hair && user.hair.color) {
                const hairColor = user.hair.color;
                if (!acc[department_name].hair[hairColor]) {
                    acc[department_name].hair[hairColor] = 1;
                }
                else {
                    acc[department_name].hair[hairColor] += 1;
                }
            }
            if (user.address && user.address.postalCode) {
                const postal_code = user.address.postalCode;
                let full_name = `${user.firstName}_${user.lastName}`;
                acc[department_name].addressUser[full_name] = postal_code;
            }
            return acc;
        }, {});
        const result = Object.entries(groupedByDepartment).map(([department, data]) => {
            return { department, data };
        });
        return result;
    }
    catch (err) {
        throw new Error("Error fetching users: " + err.message);
    }
});
exports.getUsers = getUsers;
