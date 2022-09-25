
// 選擇器設定
const hotelCategory = {};
const hotelList = document.querySelector('.hotelList');
const citySelect = document.querySelector('.citySelect');
const categorySelect = document.querySelector('.categorySelect');
const txt = document.querySelector('.txt');
const moreData = document.querySelector('.moreData');
const send = document.querySelector('.send');
let dataNum = 30;
// ------ 初始化
function init(){
    getAllHotel();
    getOriginData();
}
  
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

send.addEventListener("click",function(e){
		dataNum = 30;
		renderData();
})

moreData.addEventListener("click",function(e){
    dataNum +=20;
		if(citySelect.value == "" && categorySelect.value == "" && txt.value == ""){
			getOriginData();
		}
		else{
			renderData();
		}
})

function getAllHotel(){
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?%24format=JSON`,{
        headers: getAuthorizationHeader()
    })
    .then((res) =>{
        const thisData = res.data;
        thisData.forEach((item) =>{
            if(item.Class == undefined){
                return;
            }
            else if(hotelCategory[item.Class] == undefined){
                hotelCategory[item.Class] = 1;
            }
            else{
                hotelCategory[item.Class] +=1;
            }
        })
        renderCategory();
    })
    .catch((err) =>{
        console.log(err);
    })
}

function renderCategory(){
    const hotelCategoryAry = Object.keys(hotelCategory);
    let str = `<option selected class="d-none" value="">找分類</option>`;
    hotelCategoryAry.forEach((item) =>{
        str += `<option value="${item}">${item}</option>`;
    })
    categorySelect.innerHTML = str;
}

function getOriginData(){
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?%24top=${dataNum}&%24format=JSON`,{
        headers: getAuthorizationHeader()
    })
    .then((res) =>{
        const thisData = res.data;
        let str = "";
        thisData.forEach(function(item){
            if(item.Picture.PictureUrl1 !== undefined){
                str += `<div class="col">
                            <div class="card w-100 h-100">
                              <img
                                src="${item.Picture.PictureUrl1}"
                                class="card-img-top"
                                alt="${item.PictureDescription1}"
                                style="height: 200px; object-fit: cover;"
                              />
                              <div class="card-body p-20">
                                <h5 class="card-title fw-bold lh-14 mb-12">${item.HotelName}</h5>
                                <p class="card-text text-gray mb-12">
                                  <i class="fa-solid fa-location-dot pe-2"></i>${item.Address}
                                </p>
                                <span class="badge rounded-pill bg-primary text-gray"
                                  >${item.Class}</span
                                >
                              </div>
                            </div>
                        </div>`
            }
        })
        hotelList.innerHTML = str;
    })
    .catch((err) =>{
        console.log(err);
    })
}

function renderData(){
    const city = citySelect.value;
    const category = categorySelect.value;
    const keyWord = txt.value;
    let count = 0;
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel/${city}?%24filter=contains(Class,'${category}')%20and%20contains(HotelName,'${keyWord}')&%24top=${dataNum}&%24format=JSON`,{
        headers: getAuthorizationHeader()
    })
    .then(function(res){
        const thisData =res.data;
        let str = "";
        thisData.forEach(function(item){
						if(item.HotelName == "雀客旅館台北信義" || item.HotelName == "達觀農場"){
							return;
						}
            else if(item.Picture.PictureUrl1 !== undefined){
                str += `<div class="col">
                            <div class="card w-100 h-100">
                              <img
                                src="${item.Picture.PictureUrl1}"
                                class="card-img-top"
                                alt="${item.Picture.PictureDescription1}"
                                style="height: 200px; object-fit: cover;"
                              />
                              <div class="card-body p-20">
                                <h5 class="card-title fw-bold lh-14 mb-12">${item.HotelName}</h5>
                                <p class="card-text text-gray mb-12">
                                  <i class="fa-solid fa-location-dot pe-2"></i>${item.City}
                                </p>
                                <span class="badge rounded-pill bg-primary text-gray"
                                  >${item.Class}</span
                                >
                              </div>
                            </div>
                        </div>`
                count += 1;
            }
        })
        if(count <= 8){
        	document.querySelector('.vector-2').classList.add('d-none');
        	document.querySelector('.vector-3').classList.remove('d-lg-block');
        }
				else{
					document.querySelector('.vector-2').classList.remove('d-none');
          document.querySelector('.vector-3').classList.add('d-lg-block');
				}
        hotelList.innerHTML = str;
    })
    .catch((err) =>{
        console.log(err);
				alert("選擇城市!");
    })
}