// store.js — état global réactif simple

const Store = (() => {
  let state = {
    currentUser: null,
    currentView: null,
    posts: [],
    users: [],
    trends: []
  };

  const listeners = [];

  function getState() { return { ...state }; }

  function setState(partial) {
    state = { ...state, ...partial };
    listeners.forEach(fn => fn(state));
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }

  function hydrate() {
    state.currentUser = DB.getCurrentUser();
    state.posts = DB.getPosts();
    state.users = DB.getUsers();
    state.trends = DB.getTrends();
  }

  return { getState, setState, subscribe, hydrate };
})();

window.Store = Store;
