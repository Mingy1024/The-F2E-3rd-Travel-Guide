// 選擇器設定
const foodCategory = {};
const cityCategory = {};
const categorySelect = document.querySelector('.categorySelect');
const citySelect = document.querySelector('.citySelect');
// API認證
function getAuthorizationHeader() {
    const parameter = {
      grant_type: "client_credentials",
      client_id: "b10711038-4718ef17-bb2b-4453",
      client_secret: "0c320cb7-dd00-4c31-b6ed-56cb88d143ec"
    };
    let auth_url =
      "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
    axios({
      method: "post",
      url: auth_url,
      dataType: "JSON",
      data: parameter,
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    })
      .then((res) => {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.access_token}`;
      })
      .catch((err) => {
        console.log(err);
      });
}

function getAllFood(){
    axios.get("https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24format=JSON",{
        headers: getAuthorizationHeader()
    })
    .then((res)=>{
        const thisData = res.data;
        thisData.forEach((item) =>{
            if(item.Class == undefined){
                return;
            }
            else if(foodCategory[item.Class] == undefined){
                foodCategory[item.Class] = 1;
            }
            else{
                foodCategory[item.Class] += 1;
            }
        })
        renderCategory();
    })
} 

function getAllCity(){
    axios.get("https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24format=JSON",{
        headers: getAuthorizationHeader()
    })
    .then((res) =>{
        const thisData = res.data;
        thisData.forEach((item) =>{
            if(item.City == undefined){
                return;
            }
            else if(cityCategory[item.City] == undefined){
                cityCategory[item.City] = 1;
            }
            else{
                cityCategory[item.City] += 1; 
            }
        })
        renderCity();
    })
} 

function renderCity(){
    const cityCategoryAry = Object.keys(cityCategory);
    let str = `<option selected class="d-none">找縣市</option>`;
    cityCategoryAry.forEach((item) =>{
        str += `<option value="${item}">${item}</option>`;
    })
    citySelect.innerHTML = str;
}

function renderCategory(){
    const foodCategoryAry = Object.keys(foodCategory);
    let str =`<option selected class="d-none" value="">找分類</option>`;
    foodCategoryAry.forEach((item) =>{
        str += `<option value="${item}">${item}</option>`;
    })
    categorySelect.innerHTML = str;
} 

function init(){
    getAllFood();
    getAllCity();
}
init();