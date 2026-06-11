// views/auth.js — vues Login et Register

function renderAuthView(mode) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const shell = document.createElement('div');
  shell.className = 'auth-shell';

  // ── HERO (panneau gauche) ──
  const hero = document.createElement('div');
  hero.className = 'auth-hero';
  hero.innerHTML = `
    <span class="auth-hero-blob auth-hero-blob-1"></span>
    <span class="auth-hero-blob auth-hero-blob-2"></span>
    <span class="auth-hero-inner">
      <span class="auth-hero-logo">
        Mamad Social
        <span class="auth-hero-logo-underline"></span>
      </span>
      <span class="auth-hero-content">
        <span class="auth-hero-headline">Connectez-vous au monde, sans le bruit.</span>
        <span class="auth-hero-sub">Rejoignez un écosystème social raffiné, conçu pour la clarté, la croissance professionnelle et des relations significatives.</span>
        <span class="auth-hero-features">
          <span class="auth-hero-feature">
            <span class="auth-hero-feature-icon">📰</span>
            <span class="auth-hero-feature-title">Flux Organisé</span>
            <span class="auth-hero-feature-desc">Découvrez du contenu pertinent pour votre croissance.</span>
          </span>
          <span class="auth-hero-feature">
            <span class="auth-hero-feature-icon">👥</span>
            <span class="auth-hero-feature-title">Groupes Ciblés</span>
            <span class="auth-hero-feature-desc">Des communautés de niche pour des discussions d'experts.</span>
          </span>
        </span>
      </span>
      <span class="auth-hero-footer">
        <span class="auth-hero-avatars">
          <span class="auth-hero-avatar-stack" style="background:#4F46E5">FD</span>
          <span class="auth-hero-avatar-stack" style="background:#0EA5E9">CA</span>
          <span class="auth-hero-avatar-stack" style="background:#10B981">CW</span>
        </span>
        <span class="auth-hero-footer-text">Joined by 10k+ professionals this month</span>
      </span>
    </span>
  `;

  // ── FORM PANEL (panneau droit) ──
  const formPanel = document.createElement('div');
  formPanel.className = 'auth-form-panel';

  if (mode === 'login') {
    formPanel.appendChild(renderLoginForm());
  } else {
    formPanel.appendChild(renderRegisterForm());
  }

  shell.appendChild(hero);
  shell.appendChild(formPanel);
  app.appendChild(shell);
}

// ── Login Form ──
function renderLoginForm() {
  const inner = document.createElement('div');
  inner.className = 'auth-form-inner';

  // Logo card (visible sur mobile)
  const logoCard = document.createElement('div');
  logoCard.className = 'auth-login-card';
  logoCard.innerHTML = `
    <span class="auth-login-logo-box">🌐</span>
    <span class="auth-login-brand">Mamad Social</span>
    <span class="auth-login-tagline">Rejoignez une communauté axée sur la clarté, l'efficacité et des liens significatifs</span>
  `;

  // Tabs
  const tabs = document.createElement('div');
  tabs.className = 'auth-tabs';
  tabs.innerHTML = `
    <button class="auth-tab active" id="tab-login">Se connecter</button>
    <button class="auth-tab" id="tab-register">Créer un compte</button>
  `;
  tabs.querySelector('#tab-register').addEventListener('click', () => Router.navigate('#/register'));

  // Titre
  const title = document.createElement('span');
  title.className = 'auth-form-title';
  title.textContent = 'Content de te revoir';

  const sub = document.createElement('span');
  sub.className = 'auth-form-subtitle';
  sub.textContent = 'Veuillez saisir vos informations pour vous connecter.';

  // Fields
  const fields = document.createElement('div');
  fields.className = 'auth-form-fields';

  // Email
  const emailGroup = document.createElement('div');
  emailGroup.className = 'input-group';
  emailGroup.innerHTML = `
    <span class="input-label">Adresse email</span>
    <span class="input-wrap">
      <input class="input-field" type="email" id="login-email" placeholder="nom@entreprise.com" autocomplete="email">
    </span>
    <span class="input-error-msg" id="login-email-err">Email invalide</span>
  `;

  // Password
  const pwGroup = document.createElement('div');
  pwGroup.className = 'input-group';
  pwGroup.innerHTML = `
    <span class="input-wrap" style="justify-content:space-between; align-items:center; margin-bottom:6px;">
      <span class="input-label">Mot de passe</span>
      <span class="auth-forgot" style="cursor:pointer">Mot de passe oublié ?</span>
    </span>
    <span class="input-wrap input-icon-right-wrap" style="position:relative;">
      <input class="input-field" type="password" id="login-pw" placeholder="••••••••" autocomplete="current-password">
      <button class="input-icon-right" id="toggle-pw-login" type="button">👁</button>
    </span>
    <span class="input-error-msg" id="login-pw-err">Mot de passe incorrect</span>
  `;

  fields.appendChild(emailGroup);
  fields.appendChild(pwGroup);

  // Bouton
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-primary';
  submitBtn.id = 'login-submit';
  submitBtn.textContent = 'Se connecter';

  // Divider
  const div = document.createElement('span');
  div.className = 'divider';
  div.textContent = 'OU CONTINUEZ AVEC';

  // Social
  const social = document.createElement('span');
  social.className = 'auth-social-row';
  social.innerHTML = `
    <button class="auth-social-btn"><span class="auth-social-icon">🔵</span> Google</button>
    <button class="auth-social-btn"><span class="auth-social-icon">🔷</span> Facebook</button>
  `;

  const legal = document.createElement('span');
  legal.className = 'auth-legal';
  legal.innerHTML = `By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.`;

  inner.appendChild(logoCard);
  inner.appendChild(tabs);
  inner.appendChild(title);
  inner.appendChild(sub);
  inner.appendChild(fields);
  inner.appendChild(submitBtn);
  inner.appendChild(div);
  inner.appendChild(social);
  inner.appendChild(legal);

  // Events
  submitBtn.addEventListener('click', handleLogin);

  inner.querySelector('#login-email').addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
  inner.querySelector('#login-pw').addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });

  inner.querySelector('#toggle-pw-login').addEventListener('click', () => {
    const inp = inner.querySelector('#login-pw');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  function handleLogin() {
    const email = inner.querySelector('#login-email').value.trim();
    const pw = inner.querySelector('#login-pw').value;
    const emailErr = inner.querySelector('#login-email-err');
    const pwErr = inner.querySelector('#login-pw-err');
    emailErr.classList.remove('visible');
    pwErr.classList.remove('visible');

    let valid = true;
    if (!email || !email.includes('@')) {
      emailErr.textContent = 'Veuillez saisir un email valide.';
      emailErr.classList.add('visible');
      inner.querySelector('#login-email').classList.add('error');
      valid = false;
    }
    if (!pw) {
      pwErr.textContent = 'Veuillez saisir votre mot de passe.';
      pwErr.classList.add('visible');
      valid = false;
    }
    if (!valid) return;

    const user = DB.loginUser(email, pw);
    if (!user) {
      pwErr.textContent = 'Email ou mot de passe incorrect.';
      pwErr.classList.add('visible');
      return;
    }
    DB.setSession(user);
    Store.setState({ currentUser: user });
    Components.showToast(`Bienvenue, ${user.name} ! 👋`, 'success');
    setTimeout(() => Router.navigate('#/feed'), 400);
  }

  return inner;
}

// ── Register Form ──
function renderRegisterForm() {
  const inner = document.createElement('div');
  inner.className = 'auth-form-inner';

  // Titre
  const title = document.createElement('span');
  title.className = 'auth-form-title';
  title.textContent = 'Créer un compte';

  const sub = document.createElement('span');
  sub.className = 'auth-form-subtitle';
  sub.textContent = 'Entrez dans une expérience sociale plus propre et meilleure.';

  // Social
  const social = document.createElement('span');
  social.className = 'auth-social-row';
  social.innerHTML = `
    <button class="auth-social-btn"><span class="auth-social-icon">🔵</span> Google</button>
    <button class="auth-social-btn"><span class="auth-social-icon">🔷</span> Facebook</button>
  `;

  const div = document.createElement('span');
  div.className = 'divider';
  div.textContent = 'OU CONTINUEZ AVEC';

  // Fields
  const fields = document.createElement('div');
  fields.className = 'auth-form-fields';

  fields.innerHTML = `
    <div class="input-group">
      <span class="input-label">Nom et Prénom</span>
      <span class="input-wrap input-icon-left">
        <span class="input-icon">👤</span>
        <input class="input-field" type="text" id="reg-name" placeholder="John Doe" autocomplete="name">
      </span>
      <span class="input-error-msg" id="reg-name-err">Nom requis</span>
    </div>
    <div class="input-group">
      <span class="input-label">Adresse email</span>
      <span class="input-wrap input-icon-left">
        <span class="input-icon">✉️</span>
        <input class="input-field" type="email" id="reg-email" placeholder="nom@entreprise.com" autocomplete="email">
      </span>
      <span class="input-error-msg" id="reg-email-err">Email invalide</span>
    </div>
    <div class="input-group">
      <span class="input-label">Mot de passe</span>
      <span class="input-wrap" style="position:relative;">
        <span class="input-icon" style="position:absolute;left:12px;pointer-events:none;">🔒</span>
        <input class="input-field" type="password" id="reg-pw" placeholder="••••••••" autocomplete="new-password" style="padding-left:40px;">
        <button class="input-icon-right" id="toggle-pw-reg" type="button">👁</button>
      </span>
      <span class="input-hint">Doit comporter au moins 8 caractères.</span>
      <span class="input-error-msg" id="reg-pw-err">Mot de passe trop court</span>
    </div>
  `;

  // CGU
  const cgu = document.createElement('span');
  cgu.className = 'checkbox-wrap';
  cgu.innerHTML = `
    <input type="checkbox" id="reg-cgu">
    <span class="checkbox-label">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
  `;

  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-primary';
  submitBtn.id = 'reg-submit';
  submitBtn.textContent = 'Créer un compte';

  const switchLine = document.createElement('span');
  switchLine.className = 'auth-switch';
  switchLine.innerHTML = `Vous avez déjà un compte ? <span class="auth-switch-link" id="go-login">Se connecter</span>`;

  inner.appendChild(title);
  inner.appendChild(sub);
  inner.appendChild(social);
  inner.appendChild(div);
  inner.appendChild(fields);
  inner.appendChild(cgu);
  inner.appendChild(submitBtn);
  inner.appendChild(switchLine);

  // Events
  inner.querySelector('#go-login').addEventListener('click', () => Router.navigate('#/login'));
  inner.querySelector('#toggle-pw-reg').addEventListener('click', () => {
    const inp = inner.querySelector('#reg-pw');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  submitBtn.addEventListener('click', handleRegister);

  function handleRegister() {
    const name = inner.querySelector('#reg-name').value.trim();
    const email = inner.querySelector('#reg-email').value.trim();
    const pw = inner.querySelector('#reg-pw').value;
    const cguChecked = inner.querySelector('#reg-cgu').checked;

    const nameErr = inner.querySelector('#reg-name-err');
    const emailErr = inner.querySelector('#reg-email-err');
    const pwErr = inner.querySelector('#reg-pw-err');

    [nameErr, emailErr, pwErr].forEach(e => e.classList.remove('visible'));

    let valid = true;
    if (!name) { nameErr.textContent = 'Nom requis.'; nameErr.classList.add('visible'); valid = false; }
    if (!email || !email.includes('@')) { emailErr.textContent = 'Email invalide.'; emailErr.classList.add('visible'); valid = false; }
    if (pw.length < 8) { pwErr.textContent = 'Au moins 8 caractères.'; pwErr.classList.add('visible'); valid = false; }
    if (!cguChecked) { Components.showToast('Veuillez accepter les CGU.', 'error'); valid = false; }
    if (!valid) return;

    const user = DB.createUser(name, email, pw);
    if (!user) {
      emailErr.textContent = 'Cet email est déjà utilisé.';
      emailErr.classList.add('visible');
      return;
    }
    DB.setSession(user);
    Store.setState({ currentUser: user });
    Components.showToast(`Compte créé ! Bienvenue ${user.name} 🎉`, 'success');
    setTimeout(() => Router.navigate('#/feed'), 400);
  }

  return inner;
}

window.AuthView = { renderAuthView };
