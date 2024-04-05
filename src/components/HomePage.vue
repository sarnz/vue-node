<template>
  <div class="container mb-5">
    <h1 class="text-left">KNOWLAGE GRAPH</h1>
    <h3>20 ตลาดหลักทรัพย์</h3>
      <div class="col-12 mb-3">
        <div class="card shadow-lg radius-lg ">
            <div class="card-body d-flex gap-3">

<h5 class="card-title">เลือกประเภทอาหาร</h5>
        <div class="form-check" v-for="category in categories" :key="category.id">
          <input class="form-check-input" type="checkbox" :id="'category_' + category.id" v-model="selectedCategories"  :value="category.id">
          <label class="form-check-label" :for="'category_' + category.id">{{ category.type_name }}</label>
        </div>

            </div>
        </div>
      </div>

      <div class="row">
        <div class="col-8">
              <div class="card shadow-lg radius-lg">
                <div class="card-body">
               
 <Suspense>
    <template #default>
      <GraphNode class="graph p-3" />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
                  <!-- <v-network-graph
                    class="graph p-3"
                    :nodes="nodes"
                    :edges="edges"
                    :directed="true"
                  /> -->
                </div>
            </div>
        </div>
        <div class="col-4">
              <div class="card shadow-lg radius-lg h-100">
                <div class="card-header">
                    <h4>ข้อมูลบริษัท</h4>
                </div>
                <div class="card-body">
                  {{info}}
                </div>
            </div>
        </div>
    </div>
  </div>

</template>

<script>
import { defineComponent, Suspense } from 'vue';
import GraphNode from './GraphNode.vue';
import generateGraphData from './data';
import axios from "axios";
import { computed } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'HomePage',
    components: {
    GraphNode
  },
  data() {
    return {
       selectedCategories: [],
       info: '', 
      categories: [
      ],
    }
  },
  mounted(){
    this.getType();
  },
  computed: {
    selectedNodes() {
      this.info = this.$store.state.selectedNodes;
    },
  },
  methods:{
    
    async getType() {
      try {
        const response = await axios.get("http://company-api.test/api/type/all");
        console.log(response.data);
        this.categories = response.data
        return response.data;
      } catch (error) {
        console.error('Error fetching food types:', error);
        return [];
      }
    },

  }
  
});
</script>

<style scoped>
.graph {
  width: 100%;
  height: 500px;
  /* border: 1px solid #000; */
}
</style>
