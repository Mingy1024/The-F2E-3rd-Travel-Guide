
// ------ 初始化
function init() {
  getAllTour();
  getApiResponse();
}


// 選擇器設定
const citySelect = document.querySelector('.citySelect');
const categorySelect = document.querySelector('.categorySelect');
const txt = document.querySelector('.txt');
const send = document.querySelector('.send');
const moreData = document.querySelector('.moreData');
const scenicList =document.querySelector('.scenicList');
const tourCategory = {};
let dataNum = 30;

init();

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

// 呼叫 API 服務取得欲顯示在初始畫面的資料並進行渲染
function getApiResponse() {
  axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24top=${dataNum}&%24format=JSON`,{
      headers: getAuthorizationHeader()
    })
    .then((res) => {
      const tourismData = res.data;
        let str ="";
        tourismData.forEach(function(item){
          if (item.ScenicSpotName == '花瓶岩' || item.ScenicSpotName == '白沙觀光港') {
            return;
          }
          else if(item.Picture.PictureUrl1 !== undefined && item.Class1 !== undefined){
            str += `<div class="col">
                    <div class="card w-100 h-100">
                      <img
                        src="${item.Picture.PictureUrl1}"
                        alt="${item.Picture.PictureDescription1}"
                        style="height: 200px; object-fit: cover;"
                      />
                      <div class="card-body p-20">
                        <h5 class="card-title fw-bold lh-14 mb-12">${item.ScenicSpotName}</h5>
                        <p class="card-text text-gray mb-12">
                          <i class="fa-solid fa-location-dot pe-2"></i>${item.Address}
                        </p>
                        <span class="badge rounded-pill bg-primary text-gray"
                          >${item.Class1}</span
                        >
                      </div>
                    </div>
                  </div>`;
          }
        })
        scenicList.innerHTML = str;
    })
    .catch((err) => {
      console.log(err);
    });
}


// 監聽顯示更多景點按鈕
moreData.addEventListener("click",function(e){
  dataNum += 20;
  console.log(dataNum);
  if(citySelect.value == "" && categorySelect.value == "" && txt.value == ""){
    getApiResponse();
  }
  else {
    renderData(); 
  }
})

// 監聽搜尋按鈕
send.addEventListener("click",function(e){
  dataNum = 30;
  renderData();
})

// 取得所有景點資料
function getAllTour() {
  axios.get("https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24format=JSON",{
    headers: getAuthorizationHeader()
  })
  .then(function(res) {
    const thisData = res.data;
    thisData.forEach(function(item){
      if(item.Class1 == undefined){
        return;
      }
      else if(tourCategory[item.Class1] == undefined){
        tourCategory[item.Class1]=1;
      }
      else{
        tourCategory[item.Class1]+=1;
      }
    })
    renderCategory();
  })
}

// 取得分類種類
function renderCategory() {
  const tourCategoryAry = Object.keys(tourCategory);
  let str = `<option selected class="d-none" value="">找分類</option>`;
  tourCategoryAry.forEach(function(item){
    str +=`<option value="${item}">${item}</option>`;
  })
  categorySelect.innerHTML = str;
}

// 渲染搜尋到的資料
function renderData() {
  const city = citySelect.value;
    const category = categorySelect.value;
    const keyWord = txt.value;
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/${city}?%24filter=contains(Class1,'${category}') and contains(ScenicSpotName,'${keyWord}')&%24top=${dataNum}&%24format=JSON`,{
        headers: getAuthorizationHeader()
    })
    .then(function(res){
        const tourismData = res.data;
        let str ="";
        let count = 0;
        tourismData.forEach(function(item){
          if(item.Picture.PictureUrl1 !== undefined){
            str += `<div class="col">
                    <div class="card w-100 h-100">
                      <img
                        src="${item.Picture.PictureUrl1}"
                        alt="${item.Picture.PictureDescription1}"
                        style="height: 200px; object-fit: cover;"
                      />
                      <div class="card-body p-20">
                        <h5 class="card-title fw-bold lh-14 mb-12">${item.ScenicSpotName}</h5>
                        <p class="card-text text-gray mb-12">
                          <i class="fa-solid fa-location-dot pe-2"></i>${item.City}
                        </p>
                        <span class="badge rounded-pill bg-primary text-gray"
                          >${item.Class1}</span
                        >
                      </div>
                    </div>
                  </div>`;
            count +=1;
          }
        })
        if(count <= 8){
          document.querySelector('.vector-2').classList.add('d-none');
          document.querySelector('.vector-3').classList.remove('d-lg-block');
        }
        else {
          document.querySelector('.vector-2').classList.remove('d-none');
          document.querySelector('.vector-3').classList.add('d-lg-block');
        }
        scenicList.innerHTML = str;
    })
}
