const request = require("supertest");
const app = require("../src/app");

const prisma = require("../src/config/prisma");
const bcrypt = require("bcrypt");

const testUser = require("./fixtures/userFixture");

jest.mock("../src/config/prisma");

describe("Authentication APIs", () => {

    beforeEach(() => {

        jest.clearAllMocks();

    });

    describe("POST /register", () => {

        test("should register a new user successfully", async () => {

            /*
             * Arrange
             */

            prisma.user.findUnique.mockResolvedValue(null);

            prisma.user.create.mockResolvedValue({

                id: 1,

                name: testUser.name,

                email: testUser.email,

                password: testUser.password

            });

            /*
             * Act
             */

            const response = await request(app)

                .post("/register")

                .send({

                    name: testUser.name,

                    email: testUser.email,

                    password: "12345678"

                });

            /*
             * Assert
             */

            expect(response.statusCode).toBe(201);

            expect(response.body.success).toBe(true);

            expect(response.body.message).toBe("User registered successfully");

            expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);

            expect(prisma.user.create).toHaveBeenCalledTimes(1);

        });

    });

});