const { default: mongoose } = require("mongoose");
const ParentCategory = require("../models/Categories");
const Product = require("../models/Product");
const { feedActivity } = require("./activityController");

const ObjectId = require("mongoose").Types.ObjectId;

const adminController = {
  // add parent category
  async addParentCategory(req, res) {
    try {
      const { CategoryName } = req.body;

      // creating parent category
      const newParent = new ParentCategory({
        name: CategoryName,
      });
      newParent.save();

      // feeding activity
      feedActivity(
        req.userId,
        req.userName,
        `Parent category "${CategoryName}" is added to category.`
      );

      return res.json({
        message: "Parent category added successfully",
        newParent,
      });
    } catch (error) {
      return res.status(200).json({
        message: ["Error adding Parent to category"],
        error: error.message,
      });
    }
  },

  // add childByChildren category
  // async addChildCategory(req, res) {
  //   try {
  //     const { childCategoryName, parentId, childId } = req.body;

  //     const parent = await ParentCategory.findById(parentId);

  //     if (!parent) {
  //       return res.json({
  //         message: "Invalid parent category id or category not found",
  //       });
  //     }

  //     if (childId) {
  //       // const childByChildren = await ParentCategory.findOne(
  //       //   { "children._id": new ObjectId(childId) },
  //       //   { "children.$": 1, _id: 0 }
  //       // );

  //       // // return res.json(childByChildren)
  //       // // for creating custom objectId
  //       // const newId = new mongoose.Types.ObjectId();

  //       // // creating sub category
  //       // const grandChild = new Object({
  //       //   _id: newId,
  //       //   childCategoryName: childCategoryName,
  //       //   parentId: childId,
  //       //   isPublished: true,
  //       // });
  //       // childByChildren.children[0].children.push(grandChild);

  //       // childByChildren.save();
  //       // // feeding activity
  //       // feedActivity(
  //       //   req.userId,
  //       //   req.userName,
  //       //   `Sub-category "${childCategoryName}" is added to sub-category ${childByChildren.children[0].childCategoryName}.`
  //       // );

  //       // return res.json({ message: "Sub category added", childByChildren});

  //       const childByChildren = await ParentCategory.findOneAndUpdate(
  //         { "_id": parentId, "children._id": new ObjectId(childId) },
  //         { $push: { "children.$.children": {
  //           _id: new mongoose.Types.ObjectId(),
  //           childCategoryName: childCategoryName,
  //           parentId: childId,
  //           children: [],
  //           isPublished: true,
  //         }}},
  //         { new: true }
  //       );

  //       // feeding activity
  //       feedActivity(
  //         req.userId,
  //         req.userName,
  //         `Sub-category "${childCategoryName}" is added to sub-category ${childByChildren.children[0].childCategoryName}.`
  //       );

  //       return res.json({ message: "Sub category added", childByChildren});

  //     }

  //     // for creating custom objectId
  //     const newId = new mongoose.Types.ObjectId();

  //     // creating sub category
  //     const subCategory = new Object({
  //       _id: newId,
  //       childCategoryName: childCategoryName,
  //       parentId: parentId,
  //       children: [],
  //       isPublished: true,
  //     });

  //     // pushing it to parent and saving
  //     parent.children.push(subCategory);
  //     parent.save();

  //     // feeding activity
  //     feedActivity(
  //       req.userId,
  //       req.userName,
  //       `Child category "${childCategoryName}" is added to parent category ${parent.parentCategoryName}.`
  //     );

  //     return res.json({ message: "Sub category added", parent });
  //   } catch (error) {
  //     return res.status(500).json({
  //       message: ["Error adding childByChildren/grandchild to category"],
  //       error: error.message,
  //     });
  //   }
  // },

  async addChildCategory(req, res) {
    try {
      const { childCategoryName, parentId, childId } = req.body;

      const parent = await ParentCategory.findById(parentId);

      if (!parent) {
        return res.json({
          message: "Invalid parent category id or category not found",
        });
      }

      if (childId) {
        const childByParent = await ParentCategory.findOne({
          "_id": childId
        })
        // return res.json(childByParent)
        if (!childByParent) {
          const childByChildren = await ParentCategory.findOne({
            "children._id": new ObjectId(childId),
          });
        return console.log(childByChildren);

          if(!childByChildren) {
            return res.json({message: "Sub-category not found"})
          }
          
          const subCategory = new ParentCategory({
            name: childCategoryName,
            parent: childId,
            mainParent: childByChildren.children[0].mainParent,
            isPublished: true,
          });
  
          subCategory.save();
  
          // feeding activity
          feedActivity(
            req.userId,
            req.userName,
            `Sub-category "${childCategoryName}" is added to sub-category ${childByChildren.children[0].childCategoryName}.`
          );
  
          return res.json({ message: "Sub category added", subCategory });
        } else {
          const subCategory = new Object({
            _id: new mongoose.Types.ObjectId(),
            name: childCategoryName,
            parent: childId,
            isPublished: true,
            mainParent: childByParent.parent
          });

          childByParent.children.push(subCategory);
          await childByParent.save();

          return res.json({ message: "Sub category added", childByParent });
        } 
      }

      // creating sub category
      const subCategory = new Object({
        _id: new mongoose.Types.ObjectId(),
        name: childCategoryName,
        parent: parentId,
        isPublished: true,
        mainParent: parent._id
      });

      // pushing it to parent and saving
      parent.children.push(subCategory);
      await parent.save();

      // feeding activity
      feedActivity(
        req.userId,
        req.userName,
        `Child category "${childCategoryName}" is added to parent category ${parent.parentCategoryName}.`
      );

      return res.json({ message: "Sub category added", parent });
    } catch (error) {
      return res.status(500).json({
        message: ["Error adding childByChildren/grandchild to category"],
        error: error.message,
      });
    }
  },

  // add product
  async addProduct(req, res) {
    try {
      const { name, price, categoryId, quantity, description } = req.body;

      const product = new Product({
        name,
        price,
        quantity,
        description,
        categoryId,
      });
      const parentCategory = await ParentCategory.findById(categoryId);
      const childCategory = await ChildCategory.findById(categoryId);

      product.save();
      feedActivity(
        req.userId,
        req.userName,
        `Added product "${name}" to category ${
          parentCategory
            ? parentCategory.parentCategoryName
            : childCategory.childCategoryName
        }.`
      );

      return res.json(product);
    } catch (error) {
      return res.status(500).json({
        message: ["Error adding products!"],
        error: error.message,
      });
    }
  },

  // get all parent
  async getAllParent(req, res) {
    try {
      const categories = await ParentCategory.find();

      if (!categories) {
        return res.json({ message: "No categories found!" });
      }

      return res.json(categories);
    } catch (error) {
      return res.status(500).json({
        message: ["Error fetching all category"],
        error: error.message,
      });
    }
  },

  // get parent category
  async getParentCategory(req, res) {
    try {
      const parentId = req.params.parentId;

      const parentCategory = await ParentCategory.findById(parentId, {
        __v: 0,
        children: { __v: 0, parentId: 0 },
      });

      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }

      const products = await Product.find(
        { categoryId: parentId },
        {
          __v: 0,
        }
      );

      if (!products) {
        return res.json({ message: "No products found in this category" });
      }

      return res.json({ subcategories: parentCategory.children[0], products });
    } catch (error) {
      return res.status(500).json({
        message: ["Error fetching parent category"],
        error: error.message,
      });
    }
  },

  // get sub category
  async getSubCategory(req, res) {
    try {
      const parentId = req.params.parentId;
      const { categoryId } = req.body;

      const parentCategory = await ParentCategory.findById(parentId).populate(
        "children"
      );

      const remainingCategory = parentCategory.children.filter(
        (childByChildren) => childByChildren._id.toString() !== categoryId
      );
      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }

      const products = await Product.find(
        { categoryId: categoryId },
        {
          __v: 0,
        }
      );

      if (!products) {
        return res.json({ message: "No products found in this category" });
      }

      return res.json({ subcategories: remainingCategory, products });
    } catch (error) {
      return res.status(500).json({
        message: ["Error fetching parent category"],
        error: error.message,
      });
    }
  },
};

module.exports = adminController;
