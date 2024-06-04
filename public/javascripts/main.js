//按下顯示所有按鈕 會顯示所有資料庫的資料 (GET)
document.addEventListener('click', async (e) => {
    e.preventDefault();
    if (e.target.id === 'show_all') {
        const response = await fetch('/api/getUrl');
        const data = await response.json();
        console.log(data);
        const table = document.getElementById('result_table');

        table.innerHTML = '';

        table.innerHTML = `
            <tr>
                <th>名稱</th>
                <th>網址</th>
                <th>備註</th>
            </tr>
        `;
        data.forEach((item) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.url_name}</td>
                <td><a href="${item.url}" target="_blank">${item.url}</a></td>
                <td>${item.url_illustrate}</td>
            `;
            table.appendChild(tr);
        });
    }
    //按下新增按鈕 會新增一筆資料到資料庫 (GET)
    else if (e.target.id === 'add') {
        const url_name = document.getElementById('name').value;
        const url = document.getElementById('url').value;
        const url_illustrate = document.getElementById('note').value;
        //如果沒有輸入名稱或網址或備註 則不新增 並跳出警告視窗
        if (!url_name || !url || !url_illustrate) {
            alert('請輸入完整資料!');
            return;
        }
        //清空輸入欄位
        document.getElementById('name').value = '';
        document.getElementById('url').value = '';
        document.getElementById('note').value = '';
        const response = await fetch(`/api/insert?url_name=${url_name}&url=${url}&url_illustrate=${url_illustrate}`);
        const data = await response.send;
        //顯示新增成功 視窗
        alert('新增成功');
        console.log(data);
    }
    //按下查詢按鈕 會查詢含有某字串的資料 (GET)
    else if (e.target.id === 'search_button') {
        const keyword = document.getElementById('search').value;
        const response = await fetch(`/api/search?keyword=${keyword}`);
        const data = await response.json();
        console.log(data);
        //清空輸入欄位
        document.getElementById('search').value = '';
        //如果沒搜尋到資料 則跳出警告視窗
        if (data.length === 0) {
            alert('查無資料');
            return;
        }
        const table = document.getElementById('result_table');

        table.innerHTML = '';

        table.innerHTML = `
            <tr>
                <th>名稱</th>
                <th>網址</th>
                <th>備註</th>
            </tr>
        `;
        data.forEach((item) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.url_name}</td>
                <td><a href="${item.url}" target="_blank">${item.url}</a></td>
                <td>${item.url_illustrate}</td>
            `;
            table.appendChild(tr);
        });
    }
});
