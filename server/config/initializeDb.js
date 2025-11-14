import Role from "../models/Role.js"
import Department from "../models/Department.js"
import Course from "../models/Course.js"
import "dotenv/config.js"

export async function initializeDb() {
    console.log("Running DB initialization...");

    const roleValues = process.env.ROLES.split(",");
    const departmentvalues = process.env.DEPARTMENTS.split(",");
    const courseCategoryValues = process.env.COURSE_CATEGORIES.split(",");

    const roleCount = await Role.countDocuments();
    const departmentCount = await Department.countDocuments();
    const courseCount = await Course.countDocuments();

    if (roleCount !== roleValues.length) {
        roleValues.forEach(element => {
            Role.create({ name: element })
        });
    } else {
        console.log("Initialization skipped for Role; data already exists.");
    }

    if (departmentCount !== departmentvalues.length) {
        departmentvalues.forEach(element => {
            Department.create({ name: element })
        });
    } else {
        console.log("Initialization skipped for Department; data already exists.");
    }

    if (courseCount !== courseCategoryValues.length) {
        courseCategoryValues.forEach(element => {
            Course.create({ name: element })
        });
    } else {
        console.log("Initialization skipped for Course Category; data already exists.");
    }
}