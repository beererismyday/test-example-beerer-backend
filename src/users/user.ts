import { Http2ServerResponse } from "http2";
import { fetch } from 'undici';

interface Department {
    male: number;
    female: number;
    ageRange: string;
    hair: {
        [key: string]: number;
    };
    addressUser: {
        [key: string]: string;
    };
}

export const getUsers: any = async () => {
    try {
        const response = await fetch("https://dummyjson.com/users?limit=1000");
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const data: any = await response.json();
        const departments = data.users.map((res: any) => res.company.department)
        const groupedByDepartment = data.users.reduce((acc: { [key: string]: Department }, user: any) => {
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
            } else if (user.gender === 'female') {
                acc[department_name].female += 1;
            }

            if (user.age) {
                const department = acc[department_name];
                if (department.ageRange === '') {
                    department.ageRange = `${user.age} - ${user.age}`;
                } else {
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
                } else {
                    acc[department_name].hair[hairColor] += 1;
                }
            }

            if (user.address && user.address.postalCode) {
                const postal_code = user.address.postalCode;
                let full_name = `${user.firstName}_${user.lastName}`
                acc[department_name].addressUser[full_name] = postal_code;
            }
            return acc;
        }, {});

        const result = Object.entries(groupedByDepartment).map(([department, data]) => {
            return { department, data };
        });

        return result;
    } catch (err: any) {
        throw new Error("Error fetching users: " + err.message);
    }
};
