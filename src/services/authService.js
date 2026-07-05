const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const registerUser = async (userData) => {

    const { name, email, password } = userData;

    // Validation

    if (!name || !email || !password) {

        throw new Error("All fields are required");

    }

    // Check email already exists

    const existingUser = await prisma.user.findUnique({

        where: {

            email: email

        }

    });

    if (existingUser) {

        throw new Error("Email already registered");

    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user

    const user = await prisma.user.create({

        data: {

            name,

            email,

            password: hashedPassword

        }

    });

    return {

        success: true,

        message: "User registered successfully",

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        }

    };

};




const loginUser = async (loginData) => {

    const { email, password } = loginData;

    if (!email || !password) {

        throw new Error("Email and password are required");

    }

    const user = await prisma.user.findUnique({

        where: {

            email

        }

    });

    if (!user) {

        throw new Error("Invalid email or password");

    }

    const passwordMatched = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatched) {

        throw new Error("Invalid email or password");

    }

    const token = generateToken(user);

    return {

        success: true,

        message: "Login successful",

        token,

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        }

    };

};

module.exports = {

    registerUser,
    loginUser

};