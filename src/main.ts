import { createApp } from 'vue'
import App from './App.vue'
import VNetworkGraph from "v-network-graph"
import store from './store'
import "v-network-graph/lib/style.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App);
app.use(VNetworkGraph).use(store);
app.mount('#app');
