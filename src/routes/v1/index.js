const express = require("express");
/* -------------------------------------------------------------------------- */
/*                                 user route                                 */
/* -------------------------------------------------------------------------- */
const userRoute = require("./user.route");
const router = express.Router();
router.use("/user", userRoute);


module.exports = router;

