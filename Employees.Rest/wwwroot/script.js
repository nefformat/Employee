"use strict";

function closeButton(e) {
    e.preventDefault();
    document.getElementById('modalWindow').style.display = "none";
}

function clickRemove(e) {
    e.preventDefault();
    let id = e.srcElement.id;
    let recordCount = document.getElementById('employeesTable').tBodies[0].childElementCount;
    let pageCount = document.getElementById('pagination').childElementCount - 2;
    console.log("Pages: " + pageCount);
    //if (recordCount == 1 && )

    console.log("Records: " + recordCount);



    let request = new Request(API_URL + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log(request);

    fetch(request).then(
        function(response) {
            console.log("RAW: ");
            console.log(response);
            if (response.status != 200) {
                console.log("ERRROR");
                showError(response);
            } else {
                console.log("OKOKOK");
                if (recordCount == 1 && pageCount > 1)
                    PAGE = PAGE - 1;
                fetchData();
            }
        },
        function(error) {
            console.log("ERRROR2");
            showError(error);
        }
    );



}

function clickPage(e) {
    e.preventDefault();
    if (e.srcElement.id != "")
        PAGE = e.srcElement.id;
    else
        PAGE = e.srcElement.parentNode.id;
    fetchData();
}

function clickCreate(event) {
    event.preventDefault();
    let form = document.getElementById('createemployee');
    let formData = new FormData(form);

    let obj = {};
    formData.forEach((value, key) => obj[key] = value);

    let request = new Request(form.action, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Отправляем (асинхронно!)
    fetch(request).then(
        function(response) {
            // Запрос успешно выполнен
            console.log(response);
            // return response.json() и так далее см. документацию
        },
        function(error) {
            // Запрос не получилось отправить
            console.error(error);
        }
    );

    // Код после fetch выполнится ПЕРЕД получением ответа
    // на запрос, потому что запрос выполняется асинхронно,
    // отдельно от основного кода
    console.log('Запрос отправляется');
}

function registerHandlers() {
    document.getElementById('btnShowNewEmployee').addEventListener("click", showNewEmplyee);
    document.getElementById('btnCreate').addEventListener("click", clickCreate);
    document.getElementById('btnClose').addEventListener("click", closeButton);
}

function showNewEmplyee() {
    let container1 = document.getElementById('container1');
    let container2 = document.getElementById('container2');
    let btn = document.getElementById('btnShowNewEmployee');

    if (container1.style.display == "block") {
        container1.style.display = "none";
        container2.style.display = "block";
        btn.firstChild.textContent = "+";
    } else {
        container1.style.display = "block";
        container2.style.display = "none";
        btn.firstChild.textContent = "<";
    }
}

function showTable(data) {
    let oldTbody = document.getElementById('employeesTable').tBodies[0];
    var newTbody = document.createElement('tbody');
    if (!data || data.length == 0) {
        let row = newTbody.insertRow();
        let cellNoData = row.insertCell();
        cellNoData.colSpan = 7;
        cellNoData.style.textAlign = "center";
        cellNoData.textContent = "Нет данных о сотрудниках";
    } else {

        for (var i = 0; i < data.length; i++) {
            let row = newTbody.insertRow();

            let cellNum = row.insertCell();
            cellNum.textContent = data[i].id;

            let cellName = row.insertCell();
            cellName.textContent = data[i].name;

            let cellDepartment = row.insertCell();
            cellDepartment.textContent = data[i].department;

            let cellPosition = row.insertCell();
            cellPosition.textContent = data[i].position;

            let cellLeader = row.insertCell();
            cellLeader.textContent = ""; //data[i].leader.value;

            let cellStartDate = row.insertCell();
            cellStartDate.textContent = data[i].startDate;

            let actionCell = row.insertCell();

            let link = document.createElement("a");
            link.href = "#";
            link.id = data[i].id;
            link.addEventListener("click", clickRemove);
            let buttonText = document.createTextNode("Удалить");
            link.appendChild(buttonText);

            actionCell.appendChild(link);
            //actionCell.textContent = "Удалить Id: " + data[i].id;
        }
    }
    oldTbody.parentNode.replaceChild(newTbody, oldTbody)
}

function createPageButton(text, dstLink, active) {
    let pagination = document.getElementById("pagination");

    let div = document.createElement("div");
    div.classList.add("button");
    let buttonText = document.createTextNode(text);
    div.appendChild(buttonText);

    if (active) {
        div.classList.add("active");
        pagination.appendChild(div);

    } else {
        let link = document.createElement("a");
        link.href = "#";
        link.id = dstLink;
        link.addEventListener("click", clickPage);
        link.appendChild(div);
        pagination.appendChild(link);
    }
}

function showPagination(pageData) {
    let pagination = document.getElementById("pagination");
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }

    if (pageData == null)
        return;

    if (pageData.activePage == 1)
        createPageButton('«', 1, true);
    else
        createPageButton('«', pageData.activePage - 1, false);

    // Dots from left corner
    if (pageData.activePage - 3 > 1)
        createPageButton('...', Math.floor((pageData.activePage - 3) / 2), false);


    let startPage = pageData.activePage > 4 ? pageData.activePage - 3 : 1;
    for (let i = startPage; i <= pageData.totalPages && i < startPage + 7; i++) {
        if (i == pageData.activePage)
            createPageButton(i, i, true);
        else
            createPageButton(i, i, false);
    }
    // Dots from right corner
    if (pageData.activePage + 3 < pageData.totalPages)
        createPageButton('...', Math.floor(pageData.activePage + 3 + (pageData.totalPages - (pageData.activePage + 3)) / 2), false);


    if (pageData.activePage == pageData.totalPages)
        createPageButton('»', pageData.totalPages + 1, true);
    else
        createPageButton('»', pageData.activePage + 1, false);
}

function fetchData() {
    let url = API_URL + '?page=' + PAGE;

    fetch(url)
        .then(result => {
            if (result.status == 200) {
                result.json()
                    .then(result => {
                        console.log(result);
                        showTable(result.data);
                        showPagination(result.pagination);
                    })
            } else {
                showError(result);
            }
        }, error => {
            showError(error);
        });
}

function showError(text) {
    document.getElementById('modalWindow').style.display = 'block';
    let newError = document.createElement('p');
    newError.id = 'errorMessage';
    let oldError = document.getElementById('errorMessage');

    newError.appendChild(document.createTextNode(text));
    oldError.parentNode.replaceChild(newError, oldError)
}

function onLoad() {
    registerHandlers();
    fetchData();
}

var PAGE = 1;
var API_URL = 'http://localhost:5000/api/';
window.onload = onLoad;