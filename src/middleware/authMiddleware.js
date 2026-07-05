const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {

    try {

        // Read Authorization header
        const authHeader = req.headers.authorization;

        // Check if header exists
        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Authorization header missing"

            });

        }

        // Check Bearer Token format
        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                success: false,

                message: "Invalid Authorization format"

            });

        }

        // Remove "Bearer "
        const token = authHeader.split(" ")[1];

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store logged-in user information
        req.user = decoded;

        // Continue to next middleware/controller
        next();

    } catch (error) {

        return res.status(401).json({

            success: false,

            message: "Invalid or Expired Token"

        });

    }

};

module.exports = authenticate;