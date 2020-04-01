"use strict";

function clickRemove(e) {
    e.preventDefault();
    console.log(e.srcElement.id);
}

function clickPage(e) {
    e.preventDefault();
    if (e.srcElement.id != "")
        console.log(e.srcElement.id);
    else
        console.log(e.srcElement.parentNode.id);
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
    let elem = document.getElementById('btnShowNewEmployee');
    elem.addEventListener("click", showNewEmplyee);

    elem = document.getElementById('btnCreate');
    elem.addEventListener("click", clickCreate);
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
    let table = document.getElementById('employeesTable');
    if (data.length == 0) {
        let row = table.insertRow();
        let cellNoData = row.insertCell();
        cellNoData.colSpan = 7;
        cellNoData.style.textAlign = "center";
        cellNoData.textContent = "Нет данных о сотрудниках";
    } else {
        for (var i = 0; i < data.length; i++) {
            let row = table.insertRow();

            let cellNum = row.insertCell();
            cellNum.textContent = i + 1;

            let cellName = row.insertCell();
            cellName.textContent = data[i].name;

            let cellDepartment = row.insertCell();
            cellDepartment.textContent = data[i].department;

            let cellPosition = row.insertCell();
            cellPosition.textContent = data[i].position;

            let cellLeader = row.insertCell();
            cellLeader.textContent = data[i].leader.value;

            let cellStartDate = row.insertCell();
            cellStartDate.textContent = data[i].startDate;

            let actionCell = row.insertCell();

            let link = document.createElement("a");
            link.href = "#";
            //data[i].id;
            link.id = data[i].id;
            link.addEventListener("click", clickRemove);
            let buttonText = document.createTextNode("Удалить");
            link.appendChild(buttonText);

            actionCell.appendChild(link);
            //actionCell.textContent = "Удалить Id: " + data[i].id;
        }
    }
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
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(testFetchData());
        }, 1);

    });

    promise.then(result => {
        showTable(result.data);
        showPagination(result.pagination);
    }, error => {
        alert("Rejected: " + error); // error - аргумент reject
    });

}

function testFetchData() {
    return {
        pagination: {
            activePage: 1,
            totalPages: 10
        },
        data: [{
                id: 1,
                name: "Иванов Иван Петрович",
                department: "Маркетинг",
                position: "Маркетолог",
                leader: {
                    id: 1,
                    value: "Cтепанов Владимир Станиславович"
                },
                startDate: "01.01.2013"
            },
            {
                id: 2,
                name: "Иванов Иван Петрович",
                department: "Маркетинг",
                position: "Маркетолог",
                leader: {
                    id: 1,
                    value: "Cтепанов Владимир Станиславович"
                },
                startDate: "01.01.2013"
            },
            {
                id: 3,
                name: "Зубко Елена Вадимовна",
                department: "Маркетинг",
                position: "Маркетолог",
                leader: {
                    id: 1,
                    value: "Cтепанов Владимир Станиславович"
                },
                startDate: "01.01.2013"
            },
            {
                id: 4,
                name: "Зубко Елена Вадимовна",
                department: "Маркетинг",
                position: "Маркетолог",
                leader: {
                    id: 1,
                    value: "Cтепанов Владимир Станиславович"
                },
                startDate: "01.01.2013"
            }
        ]
    }
}

function onLoad() {
    registerHandlers();
    //populateTable();
    fetchData();
    // showPagination({
    //     activePage: 4,
    //     totalPages: 10
    // });
}
window.onload = onLoad;