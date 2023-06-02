const Io = require("../utils/Io");
const Blogs = new Io("./database/blogs.json");
const Users = new Io("./database/users.json");
const Views = new Io("./database/views.json");
const Blog = require("../models/Blog");
const jwt = require("jsonwebtoken");

const secretkey = "bu@secret%key$jwt%secret";

const create = async (req, res) => {
  const { title, text, author } = req.body;
  try {
    const blogs = await Blogs.read();
    const token = req.headers.authorization.split(" ")[1];
    const { id: user_id } = jwt.verify(token, secretkey);
    const id = (blogs[blogs.length - 1]?.id || 0) + 1;
    const newBlog = new Blog(id, title, text, author, user_id);

    const data = blogs.length ? [...blogs, newBlog] : [newBlog];
    await Blogs.write(data);

    res.status(201).json({ message: "Success" });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const show = async (req, res) => {
  const blogs = await Blogs.read();
  res.status(200).json(blogs);
};

const editBlog = async (req, res) => {
  const { id } = req.params;
  const { title, text, author } = req.body;

  const token = req.headers.authorization.split(" ")[1];
  const { id: user_id } = jwt.verify(token, secretkey);
  const blogs = await Blogs.read();
  const blog = blogs.find((blog) => blog.id == id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  blog.title = title;
  blog.text = text;
  blog.author = author;
  await Blogs.write(blogs);
  res.status(200).json({ message: "Success" });
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization.split(" ")[1];
  const { id: user_id } = jwt.verify(token, secretkey);
  const blogs = await Blogs.read();
  const blog = blogs.find((blog) => blog.id == id && blog.user_id == user_id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  blogs.splice(blogs.indexOf(blog), 1);
  await Blogs.write(blogs);
  res.status(200).json({ message: "Success" });
};

const getData = async (req, res) => {
  const { id: user_id } = jwt.verify(
    req.headers.authorization.split(" ")[1],
    secretkey
  );
  const blogs = await Blogs.read();
  const myBlogs = blogs.filter((blog) => blog.user_id == user_id);
  const users = await Users.read();

  const findUser = users.find((user) => user.id == user_id);
  console.log(findUser);
  const allBlogs = myBlogs.map((bloger) => {
    bloger.user_id = findUser;
    return bloger;
  });

  res.status(200).json({ allBlogs });
};

const CountViews = async (req, res) => {
  const { id: user_id } = jwt.verify(
    req.headers.authorization.split(" ")[1],
    secretkey
  );

  const { id: blog_id } = req.body;
  const blogs = await Blogs.read();
  const blog = blogs.find((blog) => blog.id === +blog_id);
  const views = await Views.read();
  const view = views.find(
    (view) => view.blog_id === +blog_id && view.user_id === +user_id
  );

  if (!view) {
    const id = (views[views.length - 1]?.id || 0) + 1;
    const newView = {
      id,
      blog_id: +blog_id,
      user_id,
    };

    const data = views.length ? [...views, newView] : [newView];
    Views.write(data);
  }

  const count = views.filter((view) => view.blog_id === +blog_id).length;
  blog.count = count;
  res.status(200).json({ blog });
};

module.exports = {
  create,
  show,
  editBlog,
  deleteBlog,
  getData,
  CountViews,
};
