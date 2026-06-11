

function renderFeedView() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const user = DB.getCurrentUser();
  if (!user) { Router.navigate('#/login'); return; }

  Store.hydrate();
  const state = Store.getState();

  const shell = document.createElement('div');
  shell.className = 'feed-shell';

  const topnav = buildTopNav(user);
  shell.appendChild(topnav);

  const body = document.createElement('div');
  body.className = 'feed-body';

  body.appendChild(buildSidebarLeft());
  body.appendChild(buildFeedCenter(user, state));
  body.appendChild(buildSidebarRight(state));

  shell.appendChild(body);

  const footer = document.createElement('div');
  footer.className = 'app-footer';
  footer.innerHTML = `
    <span>
      <span class="footer-brand">Mamad Social</span>
      <span class="footer-copy">© 2024 Indigo Social. All rights reserved.</span>
    </span>
    <span class="footer-links">
      <span class="footer-link">Politique de confidentialité</span>
      <span class="footer-link">Conditions d'utilisation</span>
      <span class="footer-link">Politique de Cookies</span>
      <span class="footer-link">Centre d'aide</span>
    </span>
  `;
  shell.appendChild(footer);

  app.appendChild(shell);
}

function buildTopNav(user) {
  const nav = document.createElement('div');
  nav.className = 'topnav';

  nav.innerHTML = `
    <span class="topnav-brand">Mamad Social</span>
    <span class="topnav-search-wrap">
      <span class="topnav-search-icon">🔍</span>
      <input class="topnav-search" type="text" id="search-input" placeholder="Recherche Mamad">
    </span>
    <span class="topnav-actions">
      <button class="topnav-action-btn active" id="nav-home">
        <span class="topnav-action-icon">🏠</span> Home
      </button>
      <button class="topnav-action-btn" id="nav-messages">
        <span class="topnav-action-icon">✉️</span> Messages
      </button>
      <button class="topnav-action-btn topnav-badge-wrap" id="nav-alerts">
        <span class="topnav-action-icon">🔔</span> Alertes
        <span class="badge topnav-badge">5</span>
      </button>
      <button class="topnav-avatar-btn" id="user-menu-btn">
        <span class="topnav-user-avatar"></span>
      </button>
    </span>
  `;

  const avatarSlot = nav.querySelector('.topnav-user-avatar');
  avatarSlot.appendChild(Components.renderAvatar(user, 'sm'));

  const dropdown = buildUserDropdown(user);
  nav.appendChild(dropdown);

  nav.querySelector('#user-menu-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => dropdown.classList.remove('open'), { once: false });
  dropdown.addEventListener('click', e => e.stopPropagation());


  nav.querySelector('#nav-messages').addEventListener('click', () => {
    Components.showToast('Messages — bientôt disponible !');
  });
  nav.querySelector('#nav-alerts').addEventListener('click', () => {
    Components.showToast('Aucune nouvelle alerte.');
  });

  nav.querySelector('#search-input').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    filterPosts(q);
  });

  return nav;
}

function buildUserDropdown(user) {
  const dropdown = document.createElement('div');
  dropdown.className = 'user-dropdown';
  dropdown.innerHTML = `
    <span class="dropdown-user-info">
      <span class="dropdown-avatar"></span>
      <span>
        <span class="dropdown-user-name">${user.name}</span>
        <span class="dropdown-user-email">${user.email}</span>
      </span>
    </span>
    <button class="dropdown-item">👤 Mon profil</button>
    <button class="dropdown-item">⚙️ Paramètres</button>
    <button class="dropdown-item danger" id="logout-btn">🚪 Se déconnecter</button>
  `;
  dropdown.querySelector('.dropdown-avatar').appendChild(Components.renderAvatar(user, 'md'));
  dropdown.querySelector('#logout-btn').addEventListener('click', () => {
    DB.clearSession();
    Store.setState({ currentUser: null });
    Components.showToast('Déconnexion réussie.');
    setTimeout(() => Router.navigate('#/login'), 300);
  });
  return dropdown;
}

// ── Sidebar gauche ──
function buildSidebarLeft() {
  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar-left';
  sidebar.innerHTML = `
    <span class="sidebar-section-label">Navigation</span>
    <span style="font-size:var(--text-xs);color:var(--color-gray-400);padding:0 var(--sp-3)">Gérer ta vie sociale</span>
    <button class="sidebar-nav-item active"><span class="sidebar-nav-icon">📰</span> Fil d'actualité</button>
    <button class="sidebar-nav-item"><span class="sidebar-nav-icon">👥</span> Amis</button>
    <button class="sidebar-nav-item"><span class="sidebar-nav-icon">🧩</span> Groupes</button>
    <button class="sidebar-nav-item"><span class="sidebar-nav-icon">⚙️</span> Paramètres</button>
    <span class="sidebar-divider"></span>
    <span class="sidebar-section-label">Accès rapide</span>
    <button class="sidebar-nav-item"><span class="sidebar-nav-icon">🔖</span> Messages enregistrés</button>
    <button class="sidebar-nav-item"><span class="sidebar-nav-icon">📅</span> Événements</button>
  `;

  sidebar.querySelectorAll('.sidebar-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      sidebar.querySelectorAll('.sidebar-nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const label = btn.textContent.trim();
      if (!label.includes("Fil d'actualité")) {
        Components.showToast(`${label} — bientôt disponible !`);
      }
    });
  });

  return sidebar;
}

// ── Centre (composer + posts) ──
function buildFeedCenter(user, state) {
  const center = document.createElement('div');
  center.className = 'feed-center';
  center.id = 'feed-center';

  center.appendChild(buildComposer(user));

  // Liste des posts
  const postsList = document.createElement('div');
  postsList.id = 'posts-list';
  postsList.style.display = 'flex';
  postsList.style.flexDirection = 'column';
  postsList.style.gap = 'var(--sp-4)';

  if (state.posts.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state card';
    empty.innerHTML = `
      <span class="empty-icon">📭</span>
      <span class="empty-title">Aucun post pour l'instant</span>
      <span class="empty-desc">Soyez le premier à partager quelque chose !</span>
    `;
    postsList.appendChild(empty);
  } else {
    state.posts.forEach((post, i) => {
      const el = Components.renderPost(post, user);
      if (el) {
        el.style.animationDelay = `${i * 60}ms`;
        postsList.appendChild(el);
      }
    });
  }

  center.appendChild(postsList);
  return center;
}

function buildComposer(user) {
  const composer = document.createElement('div');
  composer.className = 'composer';

  const top = document.createElement('div');
  top.className = 'composer-top';
  top.appendChild(Components.renderAvatar(user, 'md'));

  const textarea = document.createElement('textarea');
  textarea.className = 'composer-textarea';
  textarea.id = 'composer-textarea';
  textarea.placeholder = 'Quoi de neuf aujourd\'hui ?';
  top.appendChild(textarea);
  composer.appendChild(top);

  const actions = document.createElement('div');
  actions.className = 'composer-actions';
  actions.innerHTML = `
    <span class="composer-tools">
      <button class="composer-tool-btn"><span class="composer-tool-icon">🖼️</span> Photo</button>
      <button class="composer-tool-btn"><span class="composer-tool-icon">🎥</span> Vidéo</button>
      <button class="composer-tool-btn"><span class="composer-tool-icon">😀</span> Emojis</button>
    </span>
    <button class="composer-submit" id="composer-btn" disabled>Publier</button>
  `;
  composer.appendChild(actions);

  const submitBtn = composer.querySelector('#composer-btn');
  textarea.addEventListener('input', () => {
    submitBtn.disabled = textarea.value.trim().length === 0;
  });

  submitBtn.addEventListener('click', () => {
    const content = textarea.value.trim();
    if (!content) return;
    const post = DB.createPost(user.id, content);
    textarea.value = '';
    submitBtn.disabled = true;

    const postsList = document.getElementById('posts-list');
    // Retirer empty state si présent
    const empty = postsList.querySelector('.empty-state');
    if (empty) empty.remove();

    const el = Components.renderPost(post, user);
    if (el) {
      el.style.animationDelay = '0ms';
      postsList.insertBefore(el, postsList.firstChild);
    }
    Components.showToast('Post publié ! 🎉', 'success');
  });

  return composer;
}

// ── Sidebar droite ──
function buildSidebarRight(state) {
  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar-right';

  // Tendances
  const trendCard = document.createElement('div');
  trendCard.className = 'sidebar-card';
  trendCard.innerHTML = `<span class="sidebar-card-header">Tendance pour toi</span>`;

  state.trends.forEach(t => {
    const item = document.createElement('div');
    item.className = 'trend-item';
    item.innerHTML = `
      <span class="trend-category">${t.category}</span>
      <span class="trend-tag">${t.tag}</span>
      <span class="trend-count">${t.posts}</span>
    `;
    item.addEventListener('click', () => {
      const textarea = document.getElementById('composer-textarea');
      if (textarea) {
        textarea.value = t.tag + ' ';
        textarea.focus();
        document.getElementById('composer-btn').disabled = false;
      }
    });
    trendCard.appendChild(item);
  });

  const showMore = document.createElement('button');
  showMore.className = 'sidebar-show-more';
  showMore.textContent = 'Afficher plus';
  showMore.addEventListener('click', () => Components.showToast('Plus de tendances — bientôt !'));
  trendCard.appendChild(showMore);
  sidebar.appendChild(trendCard);

  // Suggestions
  const suggestCard = document.createElement('div');
  suggestCard.className = 'sidebar-card';
  suggestCard.innerHTML = `<span class="sidebar-card-header">Qui suivre</span>`;

  const currentUser = DB.getCurrentUser();
  const suggestions = state.users.filter(u => u.id !== currentUser.id).slice(0, 3);

  suggestions.forEach(u => {
    const item = document.createElement('div');
    item.className = 'suggest-item';
    item.appendChild(Components.renderAvatar(u, 'md'));
    const info = document.createElement('span');
    info.className = 'suggest-info';
    info.innerHTML = `<span class="suggest-name">${u.name}</span><span class="suggest-role">${u.role}</span>`;
    const btn = document.createElement('button');
    btn.className = 'suggest-follow-btn';
    btn.textContent = 'Suivre';
    btn.addEventListener('click', () => {
      if (btn.classList.contains('following')) {
        btn.classList.remove('following');
        btn.textContent = 'Suivre';
        Components.showToast(`Vous ne suivez plus ${u.name}.`);
      } else {
        btn.classList.add('following');
        btn.textContent = 'Suivi ✓';
        Components.showToast(`Vous suivez maintenant ${u.name} !`, 'success');
      }
    });
    item.appendChild(info);
    item.appendChild(btn);
    suggestCard.appendChild(item);
  });

  const seeAll = document.createElement('button');
  seeAll.className = 'sidebar-show-more';
  seeAll.textContent = 'Voir toutes les suggestions';
  seeAll.addEventListener('click', () => Components.showToast('Plus de suggestions — bientôt !'));
  suggestCard.appendChild(seeAll);
  sidebar.appendChild(suggestCard);

  return sidebar;
}

// ── Filtre de recherche ──
function filterPosts(query) {
  const postsList = document.getElementById('posts-list');
  if (!postsList) return;
  const cards = postsList.querySelectorAll('.post-card');
  cards.forEach(card => {
    const body = card.querySelector('.post-body');
    const text = body ? body.textContent.toLowerCase() : '';
    card.style.display = (!query || text.includes(query)) ? '' : 'none';
  });
}

window.FeedView = { renderFeedView };
