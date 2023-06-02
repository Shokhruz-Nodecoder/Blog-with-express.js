const Io = require("../utils/Io");
const Users = new Io("./database/users.json");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, password } = req.body;

  const users = await Users.read();

  const findUser = users.find((user) => username === user.username);

  if (findUser)
    return res.status(409).json({ message: "User already registered" });

  const id = (users[users.length - 1]?.id || 0) + 1;
  const newUser = new User(id, username, password);

  const data = users.length ? [...users, newUser] : [newUser];

  await Users.write(data);

  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ id: newUser.id }, secretKey);
  res.status(200).json({ message: "Success", token });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const users = await Users.read();

  const findUser = users.find(
    (user) => username === user.username && password === user.password
  );

  if (!findUser)
    return res.status(401).json({ message: "Invalid username or password" });

  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ id: findUser.id }, secretKey);
  res.status(200).json({ message: "Success", token });
};

const blogview = async (req, res) => {

 






}


module.exports = {
  register,
  login,
};
