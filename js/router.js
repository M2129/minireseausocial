// router.js — routeur SPA hash-based

const Router = (() => {
  const routes = {};

  function on(hash, handler) {
    routes[hash] = handler;
  }

  function navigate(hash) {
    window.location.hash = hash;
  }

  function getCurrentRoute() {
    return window.location.hash || '#/login';
  }

  function resolve() {
    let hash = getCurrentRoute();
    // guard : si non connecté et pas sur auth, rediriger
    const publicRoutes = ['#/login', '#/register'];
    const user = DB.getCurrentUser();
    if (!user && !publicRoutes.includes(hash)) {
      hash = '#/login';
      window.location.hash = hash;
    }
    if (user && publicRoutes.includes(hash)) {
      hash = '#/feed';
      window.location.hash = hash;
    }
    const handler = routes[hash];
    if (handler) {
      handler();
    } else {
      // fallback
      if (user) { routes['#/feed']?.(); }
      else { routes['#/login']?.(); }
    }
  }

  function init() {
    window.addEventListener('hashchange', resolve);
    resolve();
  }

  return { on, navigate, init, resolve, getCurrentRoute };
})();

window.Router = Router;
