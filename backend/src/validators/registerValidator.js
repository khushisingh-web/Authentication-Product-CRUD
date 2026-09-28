const { body } = require("express-validator");

const registerValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

        
        body("confirmPassword")
    .custom((value, { req }) => {
        return value === req.body.password;
    })
    .withMessage("Passwords do not match"),
];

module.exports = registerValidator;