

(async function init() {
  await DB.seedIfEmpty();

  Store.hydrate();

  Router.on('#/login',    () => AuthView.renderAuthView('login'));
  Router.on('#/register', () => AuthView.renderAuthView('register'));
  Router.on('#/feed',     () => FeedView.renderFeedView());

  Router.init();
})();
