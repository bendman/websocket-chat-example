const msgRouter = new EventTarget();

const connectModal = document.getElementById('connect_modal');
const connectForm = document.getElementById('connect_form');
const userList = document.getElementById('users');
const postForm = document.getElementById('post_form');
const postList = document.getElementById('messages');

class User extends ClientSocket {
  constructor(url) {
    super(url);

    this.handleUserListUpdate = this.handleUserListUpdate.bind(this);
    this.handleReceivePost = this.handleReceivePost.bind(this);
    this.handleRecentPosts = this.handleRecentPosts.bind(this);
    this.addPost = this.addPost.bind(this);

    // this.on('UserList', this.handleUserListUpdate);
    this.on('NewPost', this.handleReceivePost);
    this.on('RecentPosts', this.handleRecentPosts);
  }

  setName(name) {
    this.send('SetName', { name });
  }

  sendPost(message) {
    this.send('NewPost', { message });
  }

  handleUserListUpdate({ users }) {
    userList.innerHTML = users.map(user => (
      `<li data-id="${user.id}">${user.name}</li>`
    )).join('');
  }

  handleReceivePost({ author, message }) {
    this.addPost({ author, message });
    postList.scrollTo({
      top: postList.scrollHeight,
      behavior: 'smooth',
    });
  }

  handleRecentPosts({ posts }) {
    posts.forEach(this.addPost);
    postList.scrollTo({
      top: postList.scrollHeight,
      behavior: 'smooth',
    });
  }

  addPost({ author, message}) {
    const post = document.createElement('blockquote');
    if (author.id === this.id) {
      post.classList.add('message--self');
    }
    post.innerHTML = `<header>${author.name}</header><p>${message}</p>`;
    postList.appendChild(post);
  }
}

const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const user = new User(`${wsProtocol}//${window.location.host}`);

connectForm.addEventListener('submit', event => {
  event.preventDefault();

  if (connectForm.reportValidity()) {
    const name = connectForm.username.value;
    user.setName(name);
    connectModal.style.display = 'none';
  }
});

postForm.addEventListener('submit', event => {
  event.preventDefault();

  if (postForm.reportValidity()) {
    const message = postForm.message.value;
    user.sendPost(message);
    postForm.message.value = '';
    postForm.message.focus();
  }
});
