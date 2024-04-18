
<script lang="ts">
import { defineComponent,onMounted, PropType  } from 'vue';
import * as vNG from 'v-network-graph';
import { ForceLayout, ForceNodeDatum, ForceEdgeDatum } from 'v-network-graph/lib/force-layout';
import generateGraphData from './data';
import { reactive, ref, watch } from "vue";
import { useStore } from 'vuex';
import { watchEffect } from 'vue';


export default defineComponent({
   props: {
    dataType: Array,
    nodeSelectId: String
   

  },
  setup(props) {

  let nodeSelectId = ref(props.nodeSelectId);



  const categories = ref(props.dataType);
  // const graphData = ref<any>(null);

  const selectedNodes = ref<string[]>([])
    // ประกาศฟังก์ชัน setup() เป็น async

   

    const setup = async () => {

    const store = useStore();
      

       let loadData = await generateGraphData([]);

         let graphData = ref(loadData);
        console.log('graphData',graphData)
        store.commit('setNodeList', graphData.value.nodes);



watchEffect(() => {
  
  if(store.state.selectedCategories.length == 0){
    // window.location.reload()

  // Animates the movement of an element.
  graph.value?.transitionWhile(() => {
   // layout(direction)
  })

  }
   generateGraphData(store.state.selectedCategories).then((data) => {
   graphData.value = data
    store.commit('setNodeList', graphData.value.nodes);       
    console.log('click',graphData)
  }).catch((error) => {
    console.error('Error generating graph data:', error);
  });
});


      const nodeSize = 60;
      const initialConfigs =  vNG.defineConfigs({
         view: {
             minZoomLevel: 0.51,
    maxZoomLevel: 16,
    autoPanAndZoomOnLoad: "fit-content",
    scalingObjects: true,
    layoutHandler: new ForceLayout({
      positionFixedByDrag: false,
      positionFixedByClickWithAltKey: false,

    //  noAutoRestartSimulation: true, // If the line is deleted or set to false,
      // d3-force recalculation will be performed when nodes are dragged or
      // the network changes.

      createSimulation: (d3, nodes, edges) => {
        const forceLink = d3
          .forceLink<ForceNodeDatum, ForceEdgeDatum>(edges)
          .id((d: ForceNodeDatum) => d.id);
        // Specify your own d3-force parameters
        return d3
          .forceSimulation(nodes)
          .force("edge", forceLink.distance(60).strength(1))
          .force("charge", d3.forceManyBody().strength(-2000))
          .force("x", d3.forceX())
          .force("y", d3.forceY())
          .stop() // tick manually
          .tick(100);
      },
    }),
          },
        node: {
          normal: { radius: nodeSize / 2, color: (node: any) => node.color },
          label: { direction: 'center', color: '#fff', fontSize: 10, class: 'node-label' },

    
        },
        edge: {
          normal: { color: 'black' },
          label: { color: 'black', fontSize: 5 },
          
          marker: {
            source: {
              type: 'none',
              width: 4,
              height: 4,
              margin: -1,
              offset: 0,
              units: 'strokeWidth',
              color: null,
            },
            target: {
              type: 'arrow',
              width: 4,
              height: 4,
              margin: -1,
              offset: 0,
              units: 'strokeWidth',
              color: 'black',
            },            
          },
        },
      });
const configs = reactive(initialConfigs)
const eventHandlers: vNG.EventHandlers = {
  "node:select": (event) => {
        store.commit('setNodeSelected', event[0]);
        // console.log('setNodeSelected')  
  }
};

      configs.node.selectable = true
      const limit = ref(-1)
      watch(limit, v => {
        selectedNodes.value = [] // reset
        switch (v) {
          case 0: // disabled
            configs.node.selectable = false
            break
          case 1: // limit
          case 2:
            configs.node.selectable = v
            break
          case -1: // unlimited
          default:
            configs.node.selectable = true
            break
        }
      })
      // console.log(selectedNodes.value)
      const graph = ref<vNG.Instance>()
      
       const zoomLevel = ref(1)
       
      return { graphData, configs, selectedNodes, eventHandlers, nodeSelectId, graph, zoomLevel };
      
    };
    
    return setup(); // เรียกใช้งาน setup() เพื่อส่งค่าที่ได้รับกลับ
  },
  
});





</script>


<template>
    <div class="demo-control-panel">
      <button class="btn btn-secondary mx-3" @click="graph?.zoomIn()">Zoom In</button>
      <button class="btn btn-secondary" @click="graph?.zoomOut()">Zoom Out</button>
      <el-slider-custom-zoom v-model="zoomLevel" />
  </div>

  <v-network-graph style="height:500px"

    v-if="graphData"
    ref="graph"
v-model:zoom-level="zoomLevel"
      :zoom-level="10"
    :nodes="graphData.nodes"
    :edges="graphData.edges"
    :configs="configs"
    :directed="true"
     v-model:selected-nodes="selectedNodes"
     :event-handlers="eventHandlers"
      :layouts="graphData.layouts"
  >
     <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps" />
    </template>
  </v-network-graph>


</template>
<style scoped>
.node-label {
  white-space: normal;
  word-wrap: break-word; /* หรือ word-break: break-all; */
}

</style>
