
<script lang="ts">
import { defineComponent,onMounted } from 'vue';
import * as vNG from 'v-network-graph';
import { ForceLayout, ForceNodeDatum, ForceEdgeDatum } from 'v-network-graph/lib/force-layout';
import generateGraphData from './data';
import { reactive, ref, watch } from "vue"
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
  const selectedNodes = ref<string[]>([])
    // ประกาศฟังก์ชัน setup() เป็น async
    const setup = async () => {
      // เรียกใช้ generateGraphData() โดยใช้ await
      const graphData = await generateGraphData();
      console.log(graphData.nodes);
       console.log(graphData.edges);

      const nodeSize = 60;
      const configs = vNG.defineConfigs({
        view: {
          autoPanAndZoomOnLoad: 'fit-content',
          minZoomLevel: 0.1,
          maxZoomLevel: 16,
          layoutHandler: new ForceLayout({
            positionFixedByDrag: false,
            positionFixedByClickWithAltKey: false,
            noAutoRestartSimulation: true,
            createSimulation: (d3, nodes, edges) => {
              const forceLink = d3
                .forceLink<ForceNodeDatum, ForceEdgeDatum>(edges)
                .id((d: ForceNodeDatum) => d.id);
              return d3
                .forceSimulation(nodes)
                 .force("edge", forceLink.distance(300).strength(0.5))
                .force('charge', d3.forceManyBody().strength(-2000))
                .force('x', d3.forceX())
                .force('y', d3.forceY())
                .stop()
                .tick(100);
            },
          }),
        },
        node: {
          normal: { radius: nodeSize / 2, color: (node: any) => node.color },
          label: { direction: 'center', color: '#fff', size: '10' },
             selectable: true,
        },
        edge: {
          normal: { color: 'black' },
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
      console.log(selectedNodes)
      return { graphData, configs,selectedNodes };
      
    };
    
    return setup(); // เรียกใช้งาน setup() เพื่อส่งค่าที่ได้รับกลับ
  },
  
});



</script>


<template>

  <v-network-graph
    v-if="graphData"
    :nodes="graphData.nodes"
    :edges="graphData.edges"
    :configs="configs"
    :directed="true"
     v-model:selected-nodes="selectedNodes"
  />
</template>
