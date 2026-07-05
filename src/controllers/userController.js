const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {

    try {

        const user = await prisma.user.findUnique({

            where: {

                id: req.user.id

            },

            select: {

                id: true,
                name: true,
                email: true,
                createdAt: true

            }

        });

        return res.json({

            success: true,

            user

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const updateProfile = async (req, res) => {

    try {

        const { name, password } = req.body;

        const updateData = {};

        if (name) {

            updateData.name = name;

        }

        if (password) {

            updateData.password = await bcrypt.hash(password, 10);

        }

        const updatedUser = await prisma.user.update({

            where: {

                id: req.user.id

            },

            data: updateData,

            select: {

                id: true,
                name: true,
                email: true,
                createdAt: true

            }

        });

        return res.json({

            success: true,

            message: "Profile updated successfully",

            user: updatedUser

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const deleteProfile = async (req, res) => {

    try {

        await prisma.user.delete({

            where: {

                id: req.user.id

            }

        });

        return res.status(200).json({

            success: true,

            message: "User deleted successfully"

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    getProfile,
    updateProfile,
    deleteProfile

};