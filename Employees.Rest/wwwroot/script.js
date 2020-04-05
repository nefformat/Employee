"use strict";

function closeButton(e) {
    e.preventDefault();
    document.getElementById('modalWindow').style.display = "none";
}

function inputManager(e) {
    e.preventDefault();
    e.srcElement.classList.remove('validate-error');

    if (e.srcElement.value.length < 3)
        return;
    fetchManagers(e.srcElement.value);
}

function updateManagerList() {
    let managers = document.getElementById('managers');
    while (managers.firstChild) {
        managers.removeChild(managers.firstChild);
    }

    MANAGERS.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.name;
        managers.appendChild(option);
    });
}

function fetchManagers(name) {
    let url = API_URL + 'byname/?name=' + name;

    fetch(url)
        .then(result => {
            if (result.status == 200) {
                result.json()
                    .then(result => {
                        MANAGERS = result;
                        updateManagerList();
                    })
            } else {
                showError(result);
            }
        }, error => {
            showError(error);
        });
}


function editChange(e) {
    e.srcElement.classList.remove('validate-error');
}

function sortNameStraight(a, b) {
    var nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase()
    if (nameA < nameB)
        return -1
    if (nameA > nameB)
        return 1
    return 0
}

function sortNameReverse(a, b) {
    var nameA = a.name.toLowerCase(),
        nameB = b.name.toLowerCase()
    if (nameA > nameB)
        return -1
    if (nameA < nameB)
        return 1
    return 0
}


function sortByDepartmentStraight(a, b) {
    let depatmentA = a.department.toLowerCase(),
        depatmentB = b.department.toLowerCase()
    if (depatmentA < depatmentB)
        return -1
    if (depatmentA > depatmentB)
        return 1
    return 0
}

function sortByDepartmentReverse(a, b) {
    let depatmentA = a.department.toLowerCase(),
        depatmentB = b.department.toLowerCase()
    if (depatmentA > depatmentB)
        return -1
    if (depatmentA < depatmentB)
        return 1
    return 0
}

function sortByName(e) {
    e.preventDefault();
    SORT_BY_DEPARTMENT_ORDER = 0;

    if (SORT_BY_NAME_ORDER == 0) {
        SORT_BY_NAME_ORDER = 1;
    } else if (SORT_BY_NAME_ORDER == 1) {
        SORT_BY_NAME_ORDER = -1;
    } else {
        SORT_BY_NAME_ORDER = 1;
    }

    if (SORT_BY_NAME_ORDER == 1)
        EMPLOYEES.sort(sortNameStraight);
    else if (SORT_BY_NAME_ORDER == -1)
        EMPLOYEES.sort(sortNameReverse);
    showTable();
}

function sortByDepartment(e) {
    e.preventDefault();
    SORT_BY_NAME_ORDER = 0;

    if (SORT_BY_DEPARTMENT_ORDER == 0)
        SORT_BY_DEPARTMENT_ORDER = 1;
    else if (SORT_BY_DEPARTMENT_ORDER == 1)
        SORT_BY_DEPARTMENT_ORDER = -1;
    else
        SORT_BY_DEPARTMENT_ORDER = 1;

    if (SORT_BY_DEPARTMENT_ORDER == 1)
        EMPLOYEES.sort(sortByDepartmentStraight);
    else if (SORT_BY_DEPARTMENT_ORDER == -1)
        EMPLOYEES.sort(sortByDepartmentReverse);
    showTable();
}

function clickRemove(e) {
    e.preventDefault();
    let id = e.srcElement.parentNode.parentNode.id;
    let recordCount = document.getElementById('employeesTable').tBodies[0].childElementCount;
    let pageCount = document.getElementById('pagination').childElementCount - 2;

    let request = new Request(API_URL + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    fetch(request).then(
        function(response) {
            if (response.status != 200) {
                console.log(response);
                showError(response.statusText);
            } else {
                if (recordCount == 1 && pageCount > 1)
                    PAGE = PAGE - 1;
                fetchData();
            }
        },
        function(error) {
            showError(error);
        }
    );
}

function clickPage(e) {
    e.preventDefault();
    SORT_BY_NAME_ORDER = 0;
    SORT_BY_DEPARTMENT_ORDER = 0;

    if (e.srcElement.id != "")
        PAGE = e.srcElement.id;
    else
        PAGE = e.srcElement.parentNode.id;
    fetchData();
}

function clickCreate(e) {
    e.preventDefault();

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

    fetch(request)
        .then(
            response => {
                if (response.status == 200) {
                    fetchData();
                    showNewEmployee();
                    clearCreateForm()
                    showError("Новый сотрудник успешно добавлен");
                } else if (response.status == 400) {
                    response.json()
                        .then(json => {
                            parseErrors(json.errors);
                        })
                        .catch(error => Promise.reject(error));
                } else {
                    return Promise.reject(response);
                }
            }
        )
        .catch(error => showError(error))
}

function clearCreateForm() {
    document.getElementsByName('name')[0].value = '';
    document.getElementsByName('department')[0].value = '';
    document.getElementsByName('position')[0].value = '';
    document.getElementsByName('manager')[0].value = '';
    placeDefaultDate();
}

function parseErrors(errors) {
    let result = "";
    for (let error in errors) {
        if (error[0] == '$')
            error = error.substring(2);
        let elem = document.getElementsByName(error.toLowerCase())[0];
        elem.classList.add("validate-error");
    }
    return result;
}

function registerHandlers() {
    document.getElementById('btnShowNewEmployee').addEventListener("click", showNewEmployee);
    document.getElementById('btnCreate').addEventListener("click", clickCreate);
    document.getElementById('btnClose').addEventListener("click", closeButton);
    document.getElementsByName('name')[0].addEventListener("input", editChange);
    document.getElementsByName('department')[0].addEventListener("input", editChange);
    document.getElementsByName('position')[0].addEventListener("input", editChange);
    document.getElementsByName('manager')[0].addEventListener("input", inputManager);
    document.getElementsByName('startdate')[0].addEventListener("input", editChange);
    document.getElementById('btnNameSort').addEventListener("click", sortByName);
    document.getElementById('btnDepartmentSort').addEventListener("click", sortByDepartment);
}

function showNewEmployee(e) {
    if (e)
        e.preventDefault();
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

function showHierarchy(element, data) {
    let ol = document.createElement('ol');

    for (let manager of data) {
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(manager.name));
        ol.appendChild(li);
    }

    let td = element.srcElement.parentNode;
    td.replaceChild(ol, td.firstChild);
}

function clickHierarchy(e) {
    e.preventDefault();
    let id = e.srcElement.parentNode.parentNode.id;
    let url = API_URL + 'hierarchy?id=' + id;

    fetch(url)
        .then(result => {
            if (result.status == 200) {
                result.json()
                    .then(result => {
                        showHierarchy(e, result);
                    })
            } else {
                showError(result);
            }
        }, error => {
            showError(error);
        });
}

function showTable() {
    let nameHeader = document.getElementById('btnNameSort');
    if (SORT_BY_NAME_ORDER == 1)
        nameHeader.innerHTML = 'ФИО &darr;';
    else if (SORT_BY_NAME_ORDER == -1)
        nameHeader.innerHTML = 'ФИО &uarr;';
    else
        nameHeader.innerHTML = 'ФИО &#8693;';

    let nameDepartment = document.getElementById('btnDepartmentSort');
    if (SORT_BY_DEPARTMENT_ORDER == 1)
        nameDepartment.innerHTML = 'Отдел &darr;';
    else if (SORT_BY_DEPARTMENT_ORDER == -1)
        nameDepartment.innerHTML = 'Отдел &uarr;';
    else
        nameDepartment.innerHTML = 'Отдел &#8693;';

    let oldTbody = document.getElementById('employeesTable').tBodies[0];
    var newTbody = document.createElement('tbody');
    if (!EMPLOYEES || EMPLOYEES.length == 0) {
        let row = newTbody.insertRow();
        let cellNoData = row.insertCell();
        cellNoData.colSpan = 7;
        cellNoData.style.textAlign = "center";
        cellNoData.textContent = "Нет данных о сотрудниках";
    } else {

        for (var i = 0; i < EMPLOYEES.length; i++) {
            let row = newTbody.insertRow();
            row.id = EMPLOYEES[i].id;
            let cellNum = row.insertCell();
            cellNum.textContent = EMPLOYEES[i].id;

            let cellName = row.insertCell();
            cellName.textContent = EMPLOYEES[i].name;

            let cellDepartment = row.insertCell();
            cellDepartment.textContent = EMPLOYEES[i].department;

            let cellPosition = row.insertCell();
            cellPosition.textContent = EMPLOYEES[i].position;

            let cellManager = row.insertCell();
            if (EMPLOYEES[i].manager) {
                let linkHierarchy = document.createElement("a");
                linkHierarchy.href = "#";
                linkHierarchy.addEventListener("click", clickHierarchy);
                linkHierarchy.appendChild(document.createTextNode(EMPLOYEES[i].manager));
                linkHierarchy.title = "Показать всех";
                cellManager.appendChild(linkHierarchy);
            } else {
                cellManager.textContent = "Руководитель отсутсвует";
            }

            let startDate = "";
            let cellStartDate = row.insertCell();
            if (EMPLOYEES[i].startDate != null) {
                startDate = new Date(EMPLOYEES[i].startDate);
            }
            cellStartDate.textContent = startDate.toLocaleDateString("ru-RU");;

            let actionCell = row.insertCell();
            let linkRemove = document.createElement("a");
            linkRemove.href = "#";
            linkRemove.addEventListener("click", clickRemove);
            linkRemove.appendChild(document.createTextNode("Удалить"));

            actionCell.appendChild(linkRemove);
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

function showPagination() {
    let pagination = document.getElementById("pagination");
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }

    if (PAGINATION == null)
        return;

    if (PAGINATION.activePage == 1)
        createPageButton('«', 1, true);
    else
        createPageButton('«', PAGINATION.activePage - 1, false);

    // Dots from left corner
    if (PAGINATION.activePage - 3 > 1)
        createPageButton('...', Math.floor((PAGINATION.activePage - 3) / 2), false);


    let startPage = PAGINATION.activePage > 4 ? PAGINATION.activePage - 3 : 1;
    for (let i = startPage; i <= PAGINATION.totalPages && i < startPage + 7; i++) {
        if (i == PAGINATION.activePage)
            createPageButton(i, i, true);
        else
            createPageButton(i, i, false);
    }
    // Dots from right corner
    if (PAGINATION.activePage + 3 < PAGINATION.totalPages)
        createPageButton('...', Math.floor(PAGINATION.activePage + 3 + (PAGINATION.totalPages - (PAGINATION.activePage + 3)) / 2), false);


    if (PAGINATION.activePage == PAGINATION.totalPages)
        createPageButton('»', PAGINATION.totalPages + 1, true);
    else
        createPageButton('»', PAGINATION.activePage + 1, false);
}

function fetchData() {
    let url = API_URL + '?page=' + PAGE;

    fetch(url)
        .then(result => {
            if (result.status == 200) {
                result.json()
                    .then(result => {
                        EMPLOYEES = result.data;
                        PAGINATION = result.pagination;
                        SORT_BY_NAME_ORDER = 0;
                        SORT_BY_DEPARTMENT_ORDER = 0;
                        showTable();
                        showPagination();
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

function placeDefaultDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementsByName('startdate')[0].value = today;
}

function onLoad() {
    registerHandlers();
    fetchData();
    placeDefaultDate();
}

var PAGE = 1;
var API_URL = 'http://localhost:5000/api/';
var EMPLOYEES = [];
var PAGINATION = null;
var MANAGERS = [];
var SORT_BY_NAME_ORDER = 0;
var SORT_BY_DEPARTMENT_ORDER = 0;
window.onload = onLoad;