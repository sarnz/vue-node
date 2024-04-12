
<template>
  <div class="container mb-5">
    <h1 class="text-center">KNOWLEDGE GRAPH</h1>
    <h3 class="text-center">แสดงรายได้แยกตามประเภทธุรกิจของ 20 บริษัทมหาชนจำกัดในตลาดหลักทรัพย์ไทย</h3>
      <div class="col-12 mb-3">
        <div class="card shadow-lg radius-lg ">
            <div class="card-body d-flex align-items-center justify-content-between gap-3">
    <h5 class="card-title col-2">เลือกประเภทที่ต้องการดู</h5>
    <div class="d-flex flex-wrap gap-3"> <!-- เพิ่ม flex-wrap เพื่อให้ข้อมูล wrap ได้เมื่อมีข้อมูลเกิน -->
        <div class="form-check" v-for="category in categories" :key="category.id">
            <input class="form-check-input" @change="fetchData" type="checkbox" :id="'category_' + category.id" v-model="selectedCategories" :value="category.id">
            <label class="form-check-label" :for="'category_' + category.id">{{ category.type_name }} ({{ category.type_name_th }})</label>
        </div>
        <button class="btn btn-primary btn-sm w-100">ค้นหา</button>
    </div>
</div>

        </div>
      </div>



      <div class="row">
        <div class="col-8">
              <div class="card shadow-lg radius-lg">
                <div class="card-body" style="background-color:#f6f8fc ">
               
 <Suspense>
    <template #default>
      <GraphNode class="graph p-3" :dataType="dataType" :nodeSelectId="nodeSelectId" :selectedCompany="selectedCompany" selectedCategories:selectedCategories />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
        
                </div>
            </div>
        </div>
        <div class="col-4"  v-if="this.$store.state.tabNode == true">
              <div class="card shadow-lg radius-lg h-100" >
                <div class="card-header">
                    <h4 >ข้อมูลบริษัท</h4>
                </div>
                <div class="card-body text-left">
                 
                  <p>ชื่อบริษัท: {{ this.$store.state.company[0].company_name}}<br/>
                  เลขจดทะเบียนนิติบุคคล: {{this.$store.state.company[0].company_number}}<br/>
                  ทุนจดทะเบียน: {{formatCurrency(this.$store.state.company[0].company_amount)}}<br/>
                  ชื่อย่อหลักทรัพย์: {{this.$store.state.company[0].short_name}}</p>
                </div>
            </div>
        </div>

         <div class="col-4"  v-if="this.$store.state.tabEdge == true">
          <div class="card shadow-lg radius-lg h-100" >
                <div class="card-header">
                    <h4>ข้อมูลประเภทธุรกิจ</h4>
                </div>
                <div class="card-body text-left">
                  <p>ประเภทธุรกิจ: {{this.$store.state.type[0].name}}</p>
                  
       <nav>
  <div class="nav text-sm nav-tabs" id="nav-tab" role="tablist">
    <button v-for="(item, index) in this.$store.state.type[0].company" :key="index" class="nav-link" :class="{ 'active': index === 0 }" id="nav-{{item.id}}-tab" data-bs-toggle="tab" :data-bs-target="'#nav-' + item.id" type="button" role="tab" :aria-controls="'nav-' + item.id" :aria-selected="index === 0">
      <i class="fa-regular fa-square"></i> {{ item.company.short_name }}
    </button>

  </div>
</nav>

<div class="tab-content" id="nav-tabContent">
  <div v-for="(item, index) in this.$store.state.type[0].company" :key="index" :id="'nav-' + item.id" class="tab-pane fade" :class="{ 'show active': index === 0 }" role="tabpanel" :aria-labelledby="'nav-' + item.id + '-tab'">
    <h4 class="mt-3">รายได้แต่ละปี</h4>
    <div class="overflow-auto" style="max-height: 300px;">
     <div v-for="(revenue, revenueIndex) in item.company.revenue" :key="revenueIndex">
      <button class="btn w-100 btn-outline-primary d-flex justify-content-between mb-3">
        <h5>{{ revenue.year }}</h5>
        <h5>{{ formatCurrency2(revenue.total_amount) }} ล้านบาท</h5>

      </button>
    </div>
    </div>
  </div>
</div>


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
      categories: [],
      dataType: [],
      nodeSelectId: '',

      company: {}
    }
  },

  mounted(){
    this.getType();
    
  },
  computed: {
    selectedNodes() {
      this.nodeSelectId = this.$store.state.selectedNodes;
    },
    selectedCompany() {
      const company = this.$store.state.company; // เข้าถึงข้อมูลบริษัทที่เลือกผ่าน Vuex store
      // เลือกข้อมูลที่ต้องการแสดงเฉพาะ
      return {
        company: company,
        name: company.company,
        company_id: company.company_id,
        company_name: company.company_name
        
        // เพิ่มข้อมูลอื่นๆ ตามที่ต้องการแสดง
      }
    }
  },
  methods:{
    formatCurrency2(amount) {
    const formattedAmount = (amount / 1000000).toLocaleString(undefined);
    return formattedAmount.replace('.00', ''); // ลบทศนิยม
  },
  formatCurrency(amount) {
    // ใช้ JavaScript methods หรือ library ต่าง ๆ เพื่อจัดรูปแบบเงิน
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  },
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
    async fetchData() {
      try {

        const response = await axios.post('http://company-api.test/api/types', {
          ids: this.selectedCategories  // ส่งค่า selectedCategories ไปยังเซิร์ฟเวอร์เพื่อค้นหาข้อมูล
        });
        this.dataType = response.data
         this.$store.commit('setCategorySelect', response.data);

    

        this.$store.commit('setCategorySelectByClick', this.selectedCategories);
        console.log('setCategorySelectByClick',this.$store.state.selectedCategories); // แสดงข้อมูลที่ได้รับกลับจากเซิร์ฟเวอร์
      
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

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
