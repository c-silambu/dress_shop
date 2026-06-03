const router = require("express").Router();
const controller = require("../controllers/productController");
const upload = require("../middleware/upload");
const { adminProtect } = require("../middleware/auth");

router.route("/").post(adminProtect, upload.array("images", 5), controller.createProduct).get(controller.getProducts);
router.post("/bulk", adminProtect, controller.bulkCreateProducts);
router.get("/category/:category", controller.byCategory);
router.route("/:id").get(controller.getProduct).put(adminProtect, upload.array("images", 5), controller.updateProduct).delete(adminProtect, controller.deleteProduct);

module.exports = router;
