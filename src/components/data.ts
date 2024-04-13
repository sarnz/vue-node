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
async function fetchFoodTypesByIds(ids: Array<string>): Promise<FoodType[]> {
  try {
    const response = await axios.post<FoodType[]>('http://company-api.test/api/types', {
      ids: ids  // ส่งค่า selectedCategories ไปยังเซิร์ฟเวอร์เพื่อค้นหาข้อมูล
    });
    // console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching food types:', error);
    return [];
  }
}



// สร้าง async function เพื่อรอการดึงข้อมูลจาก API และสร้างข้อมูล nodes และ edges
async function generateGraphData(ids: Array<string>) {


  let foodTypes: FoodType[]; // ประกาศตัวแปร foodTypes และกำหนดค่าเป็น undefined เพื่อให้มีขอบเขตใช้งานที่กว้างขึ้น


  if (ids && ids.length > 0) {
    foodTypes = await fetchFoodTypesByIds(ids); // ถ้า ids มีค่าและมีความยาวมากกว่า 0 ให้ดึงข้อมูลจาก fetchFoodTypesByIds()
    console.log('foodType', foodTypes);
  } else {
    foodTypes = await fetchFoodTypes(); // ถ้า ids ไม่มีค่าหรือมีความยาวเป็น 0 ให้ดึงข้อมูลจาก fetchFoodTypes()
    console.log('foodType', foodTypes);
  }
  // สร้าง nodes จากข้อมูลประเภทอาหาร
  const nodes: Nodes = {};
  
  foodTypes.forEach((foodType: any, index: number) => {


// ตรวจสอบความยาวของข้อความและแทนที่ด้วย \n เมื่อความยาวเกิน 5 อักขระ
const typeName = foodType.type_name;
const maxChars = 10;
const lineBreakThreshold = 5;

let formattedTypeName = '';
for (let i = 0; i < typeName.length; i++) {
  // เช็คว่าคำถัดไปเริ่มด้วยเว้นวรรคหรือไม่
  if (i < typeName.length - 1 && typeName[i + 1] === ' ') {
    formattedTypeName += typeName[i] + '\n'; // เพิ่ม '\n' ก่อนที่จะเพิ่มคำถัดไป
  } else {
    formattedTypeName += typeName[i];
  }
}




    const nodeName = `node${foodType.id}`;
    nodes[nodeName] = { name: formattedTypeName, color: "#c98fc1", id: foodType.id, company:foodType.items  };
  
    
    // เพิ่ม nodes สำหรับ items ด้วยสีส้ม
    foodType.items.forEach((item: any, itemIndex: number) => {
      const itemNodeName = `itemNode${item.company.id}`;
      nodes[itemNodeName] = { 
        name: item.company.short_name, 
        color: "#f79668", 
        company_id: item.company.id, 
        company_name: item.company.company_name,
        short_name: item.company.short_name, 
        company_number: item.company.company_number,
        company_amount: item.company.company_amount,

      };
    });
  });
 


  // สร้าง edges โดยให้เชื่อมต่อ foodType.items.type_id กับ foodTypes.id
  const edges: Edges = {};
  foodTypes.forEach((foodType: any, index: number) => {
    if (foodType.items.length > 0) {
      foodType.items.forEach((item: any) => {
        const edgeName = `edge${item.id}-to-${foodType.id}`;
        const sourceNode = `itemNode${item.company.id}`;
        const targetNode = `node${foodType.id}`;
        edges[edgeName] = { source: sourceNode, target: targetNode,  label: "sale revenue from" };
      });
    }
  });
  
  return { nodes, edges };
}

// สร้างโมดูลที่สามารถนำไปใช้งานได้
export default generateGraphData;
