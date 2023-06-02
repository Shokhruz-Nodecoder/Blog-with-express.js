class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.created = new Date();
  }
}

module.exports = User;
