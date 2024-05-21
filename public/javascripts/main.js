document.addEventListener('submit', async (e) => {
    e.preventDefault();

    const startYear = document.getElementById('start_year').value;
    const endYear = document.getElementById('end_year').value;
     if (startYear > endYear) {
         alert('起始年份不可大於結束年份');
         return;
     }

    //Get /api/getProductPriceChange API data 以product-table-body id的表單顯示資料
    const response = await fetch('http://localhost:3000/api/check?start_year=' + startYear + '&end_year=' + endYear);
    const data = await response.json();
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = '';
    data.forEach((row) => {
        const tr = document.createElement('tr');
        const yearTd = document.createElement('td');
        const priceTd = document.createElement('td');

        yearTd.textContent = "民國" + row.product_year + "年";
        priceTd.textContent = row.product_price.toFixed(2) + "元";

        tr.appendChild(yearTd);
        tr.appendChild(priceTd);

        tableBody.appendChild(tr);
    });
    document.getElementById('price_table').style.visibility = 'visible';
});
