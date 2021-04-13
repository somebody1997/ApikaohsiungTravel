const zoneList = document.querySelector('.card-list');
const zoneTitle = document.querySelector('.zone-title');
const zoneSelect = document.querySelector('#drop-down');
const hotZone = document.querySelector('.hotZone-list');
const pageId = document.querySelector('#pageid');
const goTop = document.querySelector('#go-top');

const jsonUrl = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json';

let jsonData = {};

fetch(jsonUrl,{method:'get'})
    .then((respone)=>{
        return respone.json();
    }).then((data)=>{
        jsonData = data.result.records;
        console.log(jsonData);

        addOption();
        pagination(jsonData,1);
    })

//各個地區選項加到 dropdown" 並渲染到介面上
function addOption(){
    let zoneAry = [];
    for(let i=0; i<jsonData.length;i++){
        zoneAry.push(jsonData[i].Zone);
    }

    let filterZoneAry = zoneAry.filter(function(item,index){
        return zoneAry.indexOf(item) == index;
    });
    console.log('已移除陣列中重複的元素',filterZoneAry);

    let option = '<option value="" disabled selected> -- 請選擇行政區--</option> <option value="">全部行政區</option>';
    for(let i=0;i<filterZoneAry.length;i++){
        option += `<option value="${filterZoneAry[i]}">${filterZoneAry[i]}</option>`;       
    }
    zoneSelect.innerHTML = option;
}

//行政區渲染
function updateList(arr,value){
    let ticketImg;
    let str ='';

    for(let i=0;i<arr.length;i++){
        if (value === arr[i].Zone) {
            zoneTitle.textContent = value;
        } else {
            zoneTitle.textContent = '全部行政區';
        }
     

        if(arr[i].Ticketinfo !== ''){
            ticketImg =
            `
                <div class="ticket-info">
                    <img src="image/icons_tag.png" class="tag-Pic">
                    <p class="price">${arr[i].Ticketinfo}</p>
                </div>
            `
        }else{
            ticketImg = '';
        }
    
        str += 
            `<li class="card-item">
            <a href="#" class="card-header" style="background-image: url( ${arr[i].Picture1} );">
                <h4>${arr[i].Name}</h4>
                <p>${arr[i].Zone}</p>
            </a>
            <ul class="card-body">
                <li>
                    <img src="image/icons_clock.png">
                    <p>${arr[i].Opentime}</p>
                </li>
                <li>
                    <img src="image/icons_pin.png">
                    <p>${arr[i].Add}</p>
                </li>
                <li>
                    <div>
                        <img src="image/icons_phone.png">
                        <a href="tel:+${arr[i].Tel}">${arr[i].Tel}</a>
                    </div>
                    ${ticketImg}
                </li>
            </ul>
        </li>`;
    }
    zoneList.innerHTML = str;
}

// 切換下拉列表項目
zoneSelect.addEventListener('change',function(e){
    let filterData =[];
    if(e.target.value){
        filterData = jsonData.filter(function(item){
            return e.target.value === item.Zone;
        })
    }else{
        filterData = jsonData;
    }
    
    pagination(filterData,1,e.target.value);

    console.log('下拉式選單的 e.target.value ->',e.target.value);
});

//點擊熱門按鈕
hotZone.addEventListener('click',function(e){
    e.preventDefault();
    if(e.target.nodeName !== 'BUTTON'){
        return;
    }
    let hotFilter = jsonData.filter(function(item){
        return e.target.value === item.Zone;
    })
    pagination(hotFilter,1,e.target.value);

    console.log('熱們按鈕的 e.target.value ->',e.target.value);
});

function pagination(jsonData,nowPage,value){
    console.log('是否有撈到 下拉式選單 or 熱門按鈕的 value ->', value);

    console.log(nowPage);
    const dataTotal =jsonData.length;

    const perpage = 6;
    const pageTotal = Math.ceil(dataTotal/perpage);
    let currentPage =nowPage;

    if(currentPage>pageTotal){
        currentPage = pageTotal;
    }

    const minDate = (currentPage * perpage)- perpage+1;
    const maxData = (currentPage * perpage);
    //用 ES6 forEach 做資料處理，用索引來判斷資料位子，使用 index
    const data =[];
    jsonData.forEach((item,index) => {
        const num =index+1;
        if(num>= minDate&& num<= maxData){
            data.push(item);
        }
    })
    const page ={
        pageTotal, currentPage, 
        hasPage:currentPage > 1,
        hasNext: currentPage < pageTotal,
    }
    updateList(data,value);
    pageBtn(page);
}

function pageBtn(page){
    let str= '';
    const total = page.pageTotal;

    if(page.hasPage){
        str += `<li><a href="#" data-page="${Number(page.currentPage)-1}" class="link">Prev</a></li>`;
    }else{
        str += `<li class="link"><span>Prev</span><li> `;
    }

    for(let i=1;i<=total; i++){
        if(Number(page.currentPage) === i){
            str += `<li><a href="#" class="link active" data-page="${i}">${i}</a></li>`;
        }else{
            str += `<li><a href="#" class="link" data-page="${i}">${i}</a></li>`;
        }
    };

    if(page.hasNext){
        str +=`<li><a href="#" data-page="${Number(page.currentPage)+1}" class="link">Next</a></li>` ;
    }else{
        str += `<li class="link"><span>Next</span></li>`;
    }
    pageId.innerHTML = str;
}

function switchPage(e){
    e.preventDefault();
    if(e.target.nodeName !== 'A'){
        return;
    }
    const page = e.target.dataset.page;
    pagination(jsonData,page);
}
pageId.addEventListener('click',switchPage);

goTop.addEventListener('click',function(e){
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior:"smooth"
    })
})

document.addEventListener("scroll",function(){
    if(window.scrollY >850){
        goTop.style.display = "block";
    }else{
        goTop.style.display = "none";
    }
});