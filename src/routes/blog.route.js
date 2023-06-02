const { Router } = require("express");
const {
  create,
  show,
  editBlog,
  deleteBlog,
  getData,
  CountViews,
} = require("../controllers/blog.controller");
const router = Router();

router.post("/blog", create);
router.get("/show", show);
router.post("/edit/:id", editBlog);
router.put("/delete/:id", deleteBlog);
router.get("/getOne", getData);
router.get("/CountView", CountViews);
module.exports = router;
