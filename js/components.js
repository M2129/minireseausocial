


function showToast(message, type = '') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast ' + type;
  setTimeout(() => toast.classList.add('show'), 10);
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

function renderAvatar(user, size = 'md') {
  const el = document.createElement('span');
  el.className = `avatar avatar-${size}`;
  el.style.background = user.avatarColor || '#4F46E5';
  el.textContent = user.avatar || user.name.slice(0,2).toUpperCase();
  return el;
}

function highlightTags(text) {
  return text.replace(/(#\w+)/g, '<span class="post-tag">$1</span>');
}

function renderPost(post, currentUser) {
  const author = DB.getUserById(post.authorId);
  if (!author) return null;

  const card = document.createElement('div');
  card.className = 'post-card';
  card.dataset.postId = post.id;

  const isLiked = post.likes.includes(currentUser.id);
  const likeCount = post.likes.length;
  const commentCount = post.comments.length;

  card.innerHTML = `
    <div class="post-header">
      <span class="post-header-avatar"></span>
      <span class="post-header-info">
        <span class="post-author">${author.name}</span>
        <span class="post-role">${author.role}</span>
        <span class="post-time">${DB.timeAgo(post.createdAt)}</span>
      </span>
      ${post.authorId === currentUser.id ? `<button class="post-menu-btn" data-post-id="${post.id}">⋯</button>` : ''}
    </div>
    <div class="post-body">${highlightTags(post.content)}</div>
    <div class="post-meta">
      <span class="post-reactions">
        <span class="post-reaction-icon">❤️</span>
        <span class="post-reaction-count">${likeCount > 0 ? likeCount + ' j\'aime' : ''}</span>
      </span>
      <span class="post-meta-right" data-comments-toggle="${post.id}">
        ${commentCount > 0 ? commentCount + ' commentaire' + (commentCount > 1 ? 's' : '') : ''}
        ${post.shares > 0 ? ' • ' + post.shares + ' partages' : ''}
      </span>
    </div>
    <div class="post-actions">
      <button class="post-action-btn ${isLiked ? 'liked' : ''}" data-like="${post.id}">
        <span class="post-action-icon">${isLiked ? '❤️' : '🤍'}</span>
        Aimer
      </button>
      <button class="post-action-btn" data-comment-toggle="${post.id}">
        <span class="post-action-icon">💬</span>
        Commentaire
      </button>
      <button class="post-action-btn" data-share="${post.id}">
        <span class="post-action-icon">↗️</span>
        Partager
      </button>
    </div>
    <div class="post-comments" id="comments-${post.id}">
      <div class="comments-list" id="comments-list-${post.id}"></div>
      <div class="comment-compose">
        <span class="comment-compose-avatar"></span>
        <input class="comment-input" type="text" placeholder="Écrire un commentaire..." data-comment-input="${post.id}">
        <button class="comment-send-btn" data-comment-send="${post.id}">➤</button>
      </div>
    </div>
  `;

  
  const avatarSlot = card.querySelector('.post-header-avatar');
  avatarSlot.appendChild(renderAvatar(author, 'md'));

  const composeAvatarSlot = card.querySelector('.comment-compose-avatar');
  composeAvatarSlot.appendChild(renderAvatar(currentUser, 'sm'));

  const commentsList = card.querySelector(`#comments-list-${post.id}`);
  post.comments.forEach(c => {
    const commentEl = renderComment(c);
    if (commentEl) commentsList.appendChild(commentEl);
  });

  card.querySelector(`[data-like="${post.id}"]`).addEventListener('click', () => {
    const liked = DB.toggleLike(post.id, currentUser.id);
    const btn = card.querySelector(`[data-like="${post.id}"]`);
    const reactCount = card.querySelector('.post-reaction-count');
    const updatedPost = DB.getPosts().find(p => p.id === post.id);
    if (!updatedPost) return;
    btn.className = 'post-action-btn ' + (liked ? 'liked' : '');
    btn.innerHTML = `<span class="post-action-icon">${liked ? '❤️' : '🤍'}</span> Aimer`;
    reactCount.textContent = updatedPost.likes.length > 0 ? updatedPost.likes.length + " j'aime" : '';
    btn.addEventListener('click', () => {}, { once: true });
  });

  const toggleFn = () => {
    const commentsEl = card.querySelector(`#comments-${post.id}`);
    commentsEl.classList.toggle('open');
  };
  card.querySelector(`[data-comment-toggle="${post.id}"]`).addEventListener('click', toggleFn);
  const metaToggle = card.querySelector(`[data-comments-toggle="${post.id}"]`);
  if (metaToggle) metaToggle.addEventListener('click', toggleFn);

  const commentInput = card.querySelector(`[data-comment-input="${post.id}"]`);
  const commentSend = card.querySelector(`[data-comment-send="${post.id}"]`);
  const sendComment = () => {
    const text = commentInput.value.trim();
    if (!text) return;
    const newComment = DB.addComment(post.id, currentUser.id, text);
    if (newComment) {
      const commentEl = renderComment(newComment);
      if (commentEl) commentsList.appendChild(commentEl);
      commentInput.value = '';
      const metaRight = card.querySelector('.post-meta-right');
      const updatedPost = DB.getPosts().find(p => p.id === post.id);
      if (updatedPost && metaRight) {
        const cc = updatedPost.comments.length;
        metaRight.textContent = cc + ' commentaire' + (cc > 1 ? 's' : '') + (updatedPost.shares > 0 ? ' • ' + updatedPost.shares + ' partages' : '');
      }
    }
  };
  commentSend.addEventListener('click', sendComment);
  commentInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendComment(); });

  card.querySelector(`[data-share="${post.id}"]`).addEventListener('click', () => {
    showToast('Lien copié dans le presse-papiers !');
  });

  const menuBtn = card.querySelector(`[data-post-id="${post.id}"]`);
  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Supprimer ce post ?')) {
        DB.deletePost(post.id, currentUser.id);
        card.style.opacity = '0';
        card.style.transform = 'scale(0.97)';
        card.style.transition = 'opacity 0.2s, transform 0.2s';
        setTimeout(() => card.remove(), 200);
        showToast('Post supprimé.', 'success');
      }
    });
  }

  return card;
}

function renderComment(comment) {
  const author = DB.getUserById(comment.authorId);
  if (!author) return null;
  const el = document.createElement('div');
  el.className = 'comment-item';
  const avatarSpan = document.createElement('span');
  avatarSpan.appendChild(renderAvatar(author, 'sm'));
  el.appendChild(avatarSpan);
  const bubble = document.createElement('span');
  bubble.className = 'comment-bubble';
  bubble.innerHTML = `<span class="comment-author">${author.name}</span><span class="comment-text">${comment.text}</span>`;
  el.appendChild(bubble);
  return el;
}

window.Components = { showToast, renderAvatar, renderPost, renderComment, highlightTags };
