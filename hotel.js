
// 選擇器設定
const hotelList = document.querySelector('.hotelList');

// ------ 初始化
function init(){
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

function getOriginData(){
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?%24top=30&%24format=JSON`,{
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