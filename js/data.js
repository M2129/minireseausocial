

const DATA_KEY = 'mamad_data';
const SESSION_KEY = 'mamad_session';

async function seedIfEmpty() {
  if (localStorage.getItem(DATA_KEY)) return;
  try {
    const res = await fetch('./data/data.json');
    const json = await res.json();
    localStorage.setItem(DATA_KEY, JSON.stringify(json));
  } catch (e) {
    // fallback minimal
    const fallback = { users: [], posts: [], trends: [] };
    localStorage.setItem(DATA_KEY, JSON.stringify(fallback));
  }
}

function getData() {
  return JSON.parse(localStorage.getItem(DATA_KEY) || '{"users":[],"posts":[],"trends":[]}');
}

function setData(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function getUsers() { return getData().users; }

function getUserById(id) { return getUsers().find(u => u.id === id) || null; }

function createUser(name, email, password) {
  const data = getData();
  if (data.users.find(u => u.email === email)) return null; // déjà existant
  const colors = ['#4F46E5','#0EA5E9','#10B981','#F59E0B','#EC4899','#8B5CF6'];
  const newUser = {
    id: 'u' + Date.now(),
    name,
    email,
    password,
    role: 'Membre',
    avatar: name.slice(0,2).toUpperCase(),
    avatarColor: colors[Math.floor(Math.random() * colors.length)]
  };
  data.users.push(newUser);
  setData(data);
  return newUser;
}

function loginUser(email, password) {
  return getUsers().find(u => u.email === email && u.password === password) || null;
}

function getSession() {
  const s = localStorage.getItem(SESSION_KEY);
  return s ? JSON.parse(s) : null;
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return getUserById(session.userId);
}

function getPosts() {
  return getData().posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function createPost(authorId, content) {
  const data = getData();
  const post = {
    id: 'p' + Date.now(),
    authorId,
    content,
    image: null,
    likes: [],
    comments: [],
    shares: 0,
    createdAt: new Date().toISOString()
  };
  data.posts.unshift(post);
  setData(data);
  return post;
}

function toggleLike(postId, userId) {
  const data = getData();
  const post = data.posts.find(p => p.id === postId);
  if (!post) return false;
  const idx = post.likes.indexOf(userId);
  if (idx === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(idx, 1);
  }
  setData(data);
  return idx === -1;
}

function addComment(postId, authorId, text) {
  const data = getData();
  const post = data.posts.find(p => p.id === postId);
  if (!post) return null;
  const comment = {
    id: 'c' + Date.now(),
    authorId,
    text,
    createdAt: new Date().toISOString()
  };
  post.comments.push(comment);
  setData(data);
  return comment;
}

function deletePost(postId, userId) {
  const data = getData();
  const idx = data.posts.findIndex(p => p.id === postId && p.authorId === userId);
  if (idx === -1) return false;
  data.posts.splice(idx, 1);
  setData(data);
  return true;
}

function getTrends() { return getData().trends || []; }

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}j ago`;
}

window.DB = {
  seedIfEmpty, getData, getUsers, getUserById, createUser, loginUser,
  getSession, setSession, clearSession, getCurrentUser,
  getPosts, createPost, toggleLike, addComment, deletePost,
  getTrends, timeAgo
};
