import { createStore } from 'vuex';

interface State {
  selectedNodes: string[];
}

export default createStore<State>({
  state: {
    selectedNodes: [],
  },
  mutations: {
    setSelectedNodes(state, nodes: string[]) {
      state.selectedNodes = nodes;
    },
  },
  actions: {
    updateSelectedNodes({ commit }, nodes: string[]) {
      commit('setSelectedNodes', nodes);
    },
  },
  modules: {},
});
