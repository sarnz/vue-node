import { createStore, StoreOptions } from 'vuex';

interface State {
  // กำหนด properties ใน state ที่ต้องการ
  count: number;
  nodeSelected: string;
  edgeSelected: string;
  nodeList: Array<string>;
  company: object;
  type: object;
  tabNode: boolean;
  tabEdge: boolean;
  dataType: Array<string>;
  selectedCategories: object;

}

const store: StoreOptions<State> = {
  state: {
    count: 0,
    nodeSelected: '',
    edgeSelected: '',
    tabNode: false,
    tabEdge: false,
    nodeList: [],
    company: {},
    type: {},
    dataType: [],
    selectedCategories: {}

  },
  getters: {

  },
  mutations: {
    // กำหนด mutations ตามที่ต้องการ
    setNodeSelected(state, payload: string) {
      if(payload && typeof payload === 'string') {
          if(payload.startsWith("item")){
            state.tabEdge = false
              state.nodeSelected = payload
              let nodeSelected = state.nodeSelected;
              console.log(nodeSelected)
              const filteredNodesData = Object.entries(state.nodeList)
              .filter(([key, value]) => key === nodeSelected);
                const jsonFilteredNodesData = filteredNodesData.map(([key, value]) => {
                  return JSON.parse(JSON.stringify(value));
              });
              state.company = jsonFilteredNodesData;
              state.tabNode = true
              console.log(state.company)
          }else{
            console.log('no data select')
            state.tabNode = false

          }
          if(payload.startsWith("node")){
            state.tabNode = false
            state.edgeSelected = payload
            let edgeSelected = state.edgeSelected;
            // console.log(edgeSelected)
            const filteredNodesData = Object.entries(state.nodeList)
            .filter(([key, value]) => key === edgeSelected);
              const jsonFilteredNodesData = filteredNodesData.map(([key, value]) => {
                return JSON.parse(JSON.stringify(value));
            });
            state.type = jsonFilteredNodesData;
            // console.log(jsonFilteredNodesData)
            state.tabEdge = true
            console.log(state.type)
          }else{
            console.log('no data select')
            state.tabEdge = false

          }
        } else {
          console.log('no data select');
          state.tabNode = false;
          state.tabEdge = false;
      }
    },
    setEdgeSelected(state, payload: string) {
      state.edgeSelected = payload
      let edgeSelected = state.edgeSelected;
      // console.log(edgeSelected)
      const filteredNodesData = Object.entries(state.nodeList)
      .filter(([key, value]) => key === edgeSelected);
        const jsonFilteredNodesData = filteredNodesData.map(([key, value]) => {
          return JSON.parse(JSON.stringify(value));
      });
      state.type = jsonFilteredNodesData;
      // console.log(jsonFilteredNodesData)
      state.tabEdge = true

    },

    setNodeList(state, payload: Array<string>) {
      state.nodeList = payload
      console.log(state.nodeList)
    },
    setCategorySelect(state, payload: Array<string>) {
      state.dataType = payload
    },
    setCategorySelectByClick(state, payload: object) {
      state.selectedCategories = payload
    },
  },
  actions: {
    setCompanyData({ commit }, companyData) {
      commit('setCompany', companyData);
    },
  },
  modules: {
    // หากมี modules สามารถกำหนดได้ตามต้องการ
  }
};

export default createStore(store);
