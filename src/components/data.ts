import { Nodes, Edges } from "v-network-graph";
import axios from "axios";


// สร้าง interface สำหรับข้อมูลประเภทอาหาร
interface FoodType {
  id: number;
  type_name: string;
  items: any[]; // ปรับตามโครงสร้างของ items จริงๆ
}

// สร้างฟังก์ชันสำหรับดึงข้อมูลประเภทอาหารจาก API
async function fetchFoodTypes(): Promise<FoodType[]> {
  try {
    const response = await axios.get<FoodType[]>("http://company-api.test/api/type/all");
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching food types:', error);
    return [];
  }
}

// สร้าง async function เพื่อรอการดึงข้อมูลจาก API และสร้างข้อมูล nodes และ edges
async function generateGraphData() {
  // ดึงข้อมูลประเภทอาหาร
  const foodTypes = await fetchFoodTypes();

  // สร้าง nodes จากข้อมูลประเภทอาหาร
  const nodes: Nodes = {};
  
  foodTypes.forEach((foodType, index) => {
    const nodeName = `node${foodType.id}`;
    nodes[nodeName] = { name: foodType.type_name, color: "#4466cc" };
    
    // เพิ่ม nodes สำหรับ items ด้วยสีส้ม
    foodType.items.forEach((item, itemIndex) => {
      const itemNodeName = `itemNode${item.company.id}`;
      nodes[itemNodeName] = { name: item.company.short_name, color: "orange" };
    });
  });

  // สร้าง edges โดยให้เชื่อมต่อ foodType.items.type_id กับ foodTypes.id
  const edges: Edges = {};
  foodTypes.forEach((foodType, index) => {
    if (foodType.items.length > 0) {
      foodType.items.forEach((item) => {
        const edgeName = `edge${item.id}-to-${foodType.id}`;
        const sourceNode = `itemNode${item.company.id}`;
        const targetNode = `node${foodType.id}`;
        edges[edgeName] = { source: sourceNode, target: targetNode };
      });
    }
  });
  return { nodes, edges };
}

// สร้างโมดูลที่สามารถนำไปใช้งานได้
export default generateGraphData;
