// app.js — bootstrap, lie tout ensemble

(async function init() {
  // 1. Seed les données si localStorage vide
  await DB.seedIfEmpty();

  // 2. Hydrater le store
  Store.hydrate();

  // 3. Enregistrer les routes
  Router.on('#/login',    () => AuthView.renderAuthView('login'));
  Router.on('#/register', () => AuthView.renderAuthView('register'));
  Router.on('#/feed',     () => FeedView.renderFeedView());

  // 4. Lancer le routeur
  Router.init();
})();
