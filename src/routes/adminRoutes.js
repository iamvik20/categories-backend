const express = require("express");
const adminController = require("../controllers/adminController");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.use(adminMiddleware);

// Add parent category
router.post(
  "/categories",
  adminController.addParentCategory
);

// Add sub category
router.post(
  "/categories/add-child",
  adminController.addChildCategory
);

// Add products
router.post(
  "/products",
  adminController.addProduct
);

// Get all parent category
router.get(
  "/categories",
  adminController.getAllParent
);

// Get specific parent category
router.get(
  "/categories/:parentId",
  adminController.getParentCategory
);

// Get specific parent sub categories
router.get(
  "/categories/:parentId/fetch-subcategory",
  adminController.getSubCategory
);


module.exports = router;