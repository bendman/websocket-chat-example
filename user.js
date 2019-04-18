const ServerSocket = require('./server-socket');

const serverPostHistory = {
  list: [],
  add(post) {
    this.list.push(post);
    this.list = this.list.slice(-5);
  },
}

class User extends ServerSocket {
  // Get a list of all users with assigned names
  static getNamedUsers() {
    return ServerSocket.getAll().filter(client => !!client.name);
  }

  constructor(socket) {
    super(socket);

    this.name = null;

    this.handleSetName = this.handleSetName.bind(this);
    this.handleNewPost = this.handleNewPost.bind(this);

    this.on('SetName', this.handleSetName);
    this.on('NewPost', this.handleNewPost);
  }

  getSanitized() {
    return { id: this.id, name: this.name };
  }

  // Handle when a user requests to set their name
  handleSetName({ name }) {
    this.name = name;

    // Send an updated user list to all users
    const users = User.getNamedUsers().map(user => user.getSanitized());
    ServerSocket.broadcast('UserList', { users });
    this.send('RecentPosts', { posts: serverPostHistory.list });
  }

  handleNewPost({ message }) {
    const author = this.getSanitized();

    const post = { message, author };
    serverPostHistory.add(post)
    ServerSocket.broadcast('NewPost', post);
  }
}

module.exports = User;
