// 取得頁面中用來呈現內容的元素
const content = document.querySelector('#content');
// 取得頁面中用來導航的元素
const nav = document.querySelector('nav');
// 綁定導航元素的 click 事件處理函式
nav.addEventListener('click', handleNavClick);

// 切換導覽功能時，顯示相對應的內容
// title 是標題，html 是內容
function switchContent(title, html) {
    content.innerHTML = `
${title}
${html}
`;
}


// 導航列各項目的點擊事件處理函式
function handleNavClick(e) {
    e.preventDefault();

    // 切換功能區域的內容
    if (e.target.textContent === '關於我們') {
        switchContent('關於我們', '此系統包含會員及行事曆資訊！');
    }
    else if (e.target.textContent === '單純顯示資料') {
        pureDisplay();
    } else if (e.target.textContent === 'CRUD操作') {
        crudOperate();
    } else if (e.target.textContent === '跨表格簡易存取') {
        crossTableBrief();
    } else if (e.target.textContent === '跨表格雙層折疊') {
        crossTableDoubleLayer();
    }
}

// 建立 Axios 實例
const axiosInstance = axios.create({
    baseURL: 'https://localhost:7061/api/',
    timeout: 5000,
});

// 將 form data 轉成 json
function form_data_to_json(formData) {
    let object = {};    // 宣告一個空物件
    // 逐一取出 form 之中各項的 key 和 value，記錄至物件中
    formData.forEach(function (value, key) {
        // 將 'true' 或 'false' 的字串格式轉換為布林值格式
        if (value === 'true' || value === 'false') {
            // 利用判斷 value 的值是 'true' 還是 'false'，來決定布林值
            // 通常是為了單選鈕 or 複選鈕是否要被勾選用
            object[key] = value === 'true';
        } else {
            object[key] = value; // 其他資料格式保持不變
        }
    });
    return object;
}


// 單純顯示資料
function pureDisplay() {
    const html = `
    <button class='btnMenu' onclick="AirplaneFull()">飛機完整資料</button>
    <button class='btnMenu' onclick="AirportFull()">機場完整資料</button>
       
    `;
    // 切換功能區域的內容
    switchContent('單純顯示資料的按鈕', html);
}

//CRUD操作
function crudOperate(){
    const html = `
    <button class='btnMenu' onclick="AirplaneFullCRUD()">CRUD飛機資料</button>
    <button class='btnMenu' onclick="AirportFullCRUD()">CRUD機場資料</button>
       
    `;
    // 切換功能區域的內容
    switchContent('CRUD資料的按鈕', html);
}

// 點選「行事曆完整資料」功能時，呼叫此函式
function AirplaneFull() {
    // 取得行事曆資料
    axiosInstance.get('Airplane')
        .then(res => {
            console.log(res);
            const airplane = res.data.airplanes;
            // 呼叫函式去呈現行事曆資料在頁面中
            show_airplane_full(airplane);
        })
        .catch(err => {
            console.error(err);
        });
}//Nice

// 呈現「行事曆完整資料」在頁面中
function show_airplane_full(airplane) {
    console.log(airplane);
    // 建立行事曆的 HTML 內容
    const html = `
    <table>
        <thead>
            <tr>
                <th>飛機名稱</th>
                <th>座位數量</th>
                <th>最高速度</th>
                <th>重量</th>
            </tr>
        </thead>
        <tbody>
            ${airplane.map(item => `
                <tr>
                    <td>${item.pname}</td>
                    <td>${item.pseats}</td>
                    <td>${item.pmaxspeed}</td>
                    <td>${item.pheavyload}</td>
                </tr>
                    
            `).join('')}
        </tbody>
    </table>`;
    // 切換功能區域的內容
    switchContent('飛機資料', html);
}//Nice

//
function AirplaneFullCRUD() {
    // 取得行事曆資料
    axiosInstance.get('Airplane')
        .then(res => {
            console.log(res);
            const airplane = res.data.airplanes;
            // 呼叫函式去呈現行事曆資料在頁面中
            show_airplane_CRUD(airplane);
        })
        .catch(err => {
            console.error(err);
        });
}//Nice

function show_airplane_CRUD(airplane) {
    console.log(airplane);
    // 建立行事曆的 HTML 內容
    const html = `
    <div class="button-container">
            <button class='createBtn' onclick="add_airplane()">新增飛機資料</button>
    </div>
    <table>
        <thead>
            <tr>
                <th>飛機名稱</th>
                <th>座位數量</th>
                <th>最高速度</th>
                <th>重量</th>
                <th>操作功能</th>
            </tr>
        </thead>
        <tbody>
            ${airplane.map(item => `
                <tr>
                    <td>${item.pname}</td>
                    <td>${item.pseats}</td>
                    <td>${item.pmaxspeed}</td>
                    <td>${item.pheavyload}</td>
                    <td>
                        <button class='updateBtn' onClick="update_airplane('${item.pid}')">修改</button>
                        <button class='deleteBtn' onClick="delete_airplane('${item.pid}')">刪除</button>
                    </td>
                </tr>
                    
            `).join('')}
        </tbody>
    </table>`;
    // 切換功能區域的內容
    switchContent('飛機資料', html);
}//Nice

// （新增）點選行事曆的「新增」按鈕時，呼叫此函式
function add_airplane() {
    // 呼叫函式去呈現行事曆新增資料在頁面中
    show_airplane_add();
}

// （新增）飛機
function show_airplane_add() {
    // 建立行事曆的 HTML 內容
    const html = `
    <form id="add-airplane-form">
        <table>
            <tbody>
                <tr>
                    <th>飛機名稱</th>
                    <td><input type="text" id="pname" name="pname"></td>
                </tr>
                <tr>
                    <th>座位數量</th>                    
                    <td><input type="number" id="pseats" name="pseats" min=1></td>
                </tr>                
                <tr>
                    <th>最高速度</th>                    
                    <td><input type="number" id="pmaxspeed" name="pmaxspeed" min=1></td>
                </tr>   
                <tr>
                    <th>重量</th>                    
                    <td><input type="number" id="pheavyload" name="pheavyload" min=1></td>
                </tr>   
            </tbody>
        </table>
        <button type="submit" class='addBtn'>確認新增</button>
    </form>
    `;
    // 切換功能區域的內容
    switchContent('新增飛機資料', html);

    const form = document.querySelector('#add-airplane-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        // 取得表單（form）所填寫的資料
        const formData = new FormData(form);
        // 將表單的資料轉換成 json 格式
        const jsonData = form_data_to_json(formData);
        console.log(jsonData);
        // 以 post 方式連線至伺服端新增資料
        axiosInstance.post(`Airplane`, jsonData)
            .then(res => {
                window.alert('飛機新增成功！');
                AirplaneFull();     // 重新列出最新的資料清單
            })
            .catch(err => {
                console.error(err);
            });
    });
}

// （修改）
function update_airplane(pid) {

    axiosInstance.get(`Airplane/${pid}`)
        .then(res => {
            const airplane = res.data.airplanes;

            show_airplane_update(airplane);
        })
        .catch(err => {
            console.error(err);
        });
}

//-----------------------------------------------------------------------------------------------------------------------------------//
// （修改）呈現「行事曆修改資料」在頁面中
function show_airplane_update(airplane) {
    console.log(airplane);
    // 建立行事曆的 HTML 內容
    const html = `
    <form id="update-airplane-form">
        <table>
            <tbody>
                <tr>
                    <th>飛機名稱</th>
                    <td><input type="text" id="pname" name="pname" value="${airplane.pname}" ></td>
                </tr>
                <tr>
                    <th>座位數量</th>                    
                    <td><input type="number" id="pseats" name="pseats" min=1 value="${airplane.pseats}"></td>
                </tr>
                <tr>
                    <th>最高速度</th>                    
                    <td><input type="number" id="pmaxspeed" name="pmaxspeed" min=1 value="${airplane.pmaxspeed}"></td>
                </tr>
                <tr>
                    <th>重量</th>                    
                    <td><input type="number" id="pheavyload" name="pheavyload" min=1 value="${airplane.pheavyload}"></td>
                </tr>
                
            </tbody>
        </table>
        <button type="submit" class='updateBtn'>確認修改</button>
        </form>
    `;
    // 切換功能區域的內容
    switchContent('飛機修改資料', html);

    const form = document.querySelector('#update-airplane-form');
    console.log(form)
    form.addEventListener('submit', e => {
        e.preventDefault();
        // 取得表單（form）所填寫的資料
        const formData = new FormData(form);
        // 將表單的資料轉換成 json 格式
        const jsonData = form_data_to_json(formData);
        console.log(jsonData);
        // 以 put 方式連線至伺服端修改資料
        axiosInstance.put(`Airplane/${airplane.pid}`, jsonData)
            .then(res => {
                window.alert('飛機修改成功！');
                show_airplane_CRUD();     // 重新列出最新的資料清單
            })
            .catch(err => {
                console.error(err);
            });
    });
}

//-----------------------------------------------------------------------------------------------------------------------------------//

function AirportFull() {
    // 取得行事曆資料
    axiosInstance.get('Airport')
        .then(res => {
            const airport = res.data.airports;
            // 呼叫函式去呈現行事曆資料在頁面中
            show_airport_full(airport);
        })
        .catch(err => {
            console.error(err);
        });
}
//-----------------------------------------------------------------------------------------------------------------------------------//
function show_airport_full(airport) {
    console.log(airport);
    const html = `
    
    <table>
        <thead>
            <tr>
                <th>飛機名稱</th>
                <th>航廈數</th>
                <th>停機坪數</th>
                <th>面積</th>
            </tr>
        </thead>
        <tbody>
            ${airport.map(item => `
                <tr>
                    <td>${item.aname}</td>
                    <td>${item.aterminal}</td>
                    <td>${item.aapron}</td>
                    <td>${item.aarea}</td>
                    <td>
                </td>
                </tr>
                    
            `).join('')}
        </tbody>
        
    </table>`;
    switchContent('機場資料', html);
}

//--------------------------------------------------------------------------------------------------------------

function add_airport() {
    show_airport_add();
}

// （新增）機場
function show_airport_add() {
    // 建立行事曆的 HTML 內容
    const html = `
    <form id="add-airport-form">
        <table>
            <tbody>
                <tr>
                    <th>機場名稱</th>
                    <td><input type="text" id="aname" name="aname"></td>
                </tr>
                <tr>
                    <th>航廈數</th>                    
                    <td><input type="number" id="aterminal" name="aterminal" min=1></td>
                </tr>
                <tr>
                    <th>停機坪數</th>                    
                    <td><input type="number" id="aapron" name="aapron" min=1></td>
                </tr>    
                    <tr>
                    <th>面積</th>                    
                <td><input type="number" id="aarea" name="aarea" min=1></td>
        </tr>                    
            </tbody>
        </table>
        <button type="submit" class='addBtn'>確認新增</button>
    </form>
    `;
    // 切換功能區域的內容
    switchContent('新增機場資料', html);

    const form = document.querySelector('#add-airport-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        // 取得表單（form）所填寫的資料
        const formData = new FormData(form);
        // 將表單的資料轉換成 json 格式
        const jsonData = form_data_to_json(formData);
        console.log(jsonData);
        // 以 post 方式連線至伺服端新增資料
        axiosInstance.post(`Airport`, jsonData)
            .then(res => {
                window.alert('機場新增成功！');
                AirportFull();     // 重新列出最新的資料清單
            })
            .catch(err => {
                console.error(err);
            });
    });
}

function AirportFull() {
    // 取得行事曆資料
    axiosInstance.get('Airport')
        .then(res => {
            const airport = res.data.airports;
            // 呼叫函式去呈現行事曆資料在頁面中
            show_airport_full(airport);
        })
        .catch(err => {
            console.error(err);
        });
}

//--------------------------
function AirportFullCRUD() {
    // 取得行事曆資料
    axiosInstance.get('Airport')
        .then(res => {
            const airport = res.data.airports;
            // 呼叫函式去呈現行事曆資料在頁面中
            show_airport_CRUD(airport);
        })
        .catch(err => {
            console.error(err);
        });
}
//

function show_airport_CRUD(airport) {
    console.log(airport);
    const html = `
    <div class="button-container">
    <button class='createBtn' onclick="add_airport()">新增機場資料</button>
    </div>
    <table>
        <thead>
            <tr>
                <th>機場名稱</th>
                <th>航廈數</th>
                <th>停機坪數</th>
                <th>面積</th>
                <th>操作功能</th>
            </tr>
        </thead>
        <tbody>
            ${airport.map(item => `
                <tr>
                    <td>${item.aname}</td>
                    <td>${item.aterminal}</td>
                    <td>${item.aapron}</td>
                    <td>${item.aarea}</td>
                    <td>
                    <button class='updateBtn' onClick="update_airport('${item.aid}')">修改</button>
                    <button class='deleteBtn' onClick="delete_airport('${item.aid}')">刪除</button>
                </td>
                </tr>
                    
            `).join('')}
        </tbody>
        
    </table>`;
    switchContent('機場資料', html);
}
