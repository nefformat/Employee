var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Employee = (function () {
    function Employee() {
    }
    return Employee;
}());
var Pagination = (function () {
    function Pagination() {
    }
    return Pagination;
}());
var EmployeesResponse = (function () {
    function EmployeesResponse(employees, pagination) {
        this.employees = employees;
        this.pagination = pagination;
    }
    return EmployeesResponse;
}());
var HierarchyResponse = (function () {
    function HierarchyResponse() {
    }
    return HierarchyResponse;
}());
var Main = (function () {
    function Main(apiUrl) {
        var _this = this;
        this.fetcher = new Fetcher(apiUrl);
        this.showAddEmployeeTab = true;
        this.pagination = new Pagination();
        this.pagination.activePage = 1;
        this.pagination.totalPages = 0;
        this.sortByNameOrder = 0;
        this.sortByDepartmentOrder = 0;
        this.placeDate();
        document.getElementById('btnShowNewEmployee').addEventListener("click", function (event) { event.preventDefault(); _this.toggleAddEmployeeTab(); });
        document.getElementById('btnCreate').addEventListener("click", function (event) { event.preventDefault(); _this.clickCreate(); });
        document.getElementById('btnClose').addEventListener("click", function (event) { event.preventDefault(); _this.closeErrorWindow(); });
        document.getElementsByName('name')[0].addEventListener("input", function (event) { return event.srcElement.classList.remove('validate-error'); });
        document.getElementsByName('department')[0].addEventListener("input", function (event) { return event.srcElement.classList.remove('validate-error'); });
        document.getElementsByName('position')[0].addEventListener("input", function (event) { return event.srcElement.classList.remove('validate-error'); });
        document.getElementsByName('manager')[0].addEventListener("input", function (event) { event.preventDefault(); _this.inputManager(event.srcElement); });
        document.getElementsByName('startdate')[0].addEventListener("input", function (event) { return event.srcElement.classList.remove('validate-error'); });
        document.getElementById('btnNameSort').addEventListener("click", function (event) { event.preventDefault; _this.sortByName(); });
        document.getElementById('btnDepartmentSort').addEventListener("click", function (event) { event.preventDefault; _this.sortByDepartment(); });
        this.refetchEmployeesList();
    }
    Main.prototype.inputManager = function (sender) {
        var _this = this;
        sender.classList.remove('validate-error');
        if (sender.value.length < 3)
            return;
        this.fetcher.fetchManagers(sender.value)
            .then(function (managers) { return _this.refreshManagersList(managers); })
            .catch(function (ex) {
            _this.showError(ex.statusText);
        });
    };
    Main.prototype.sortNameStraight = function (a, b) {
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;
        return 0;
    };
    Main.prototype.sortNameReverse = function (a, b) {
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA > nameB)
            return -1;
        if (nameA < nameB)
            return 1;
        return 0;
    };
    Main.prototype.sortByDepartmentStraight = function (a, b) {
        var depatmentA = a.department.toLowerCase(), depatmentB = b.department.toLowerCase();
        if (depatmentA < depatmentB)
            return -1;
        if (depatmentA > depatmentB)
            return 1;
        return 0;
    };
    Main.prototype.sortByDepartmentReverse = function (a, b) {
        var depatmentA = a.department.toLowerCase(), depatmentB = b.department.toLowerCase();
        if (depatmentA > depatmentB)
            return -1;
        if (depatmentA < depatmentB)
            return 1;
        return 0;
    };
    Main.prototype.sortByName = function () {
        this.sortByDepartmentOrder = 0;
        if (this.sortByNameOrder == 0) {
            this.sortByNameOrder = 1;
        }
        else if (this.sortByNameOrder == 1) {
            this.sortByNameOrder = -1;
        }
        else {
            this.sortByNameOrder = 1;
        }
        if (this.sortByNameOrder == 1)
            this.employees.sort(this.sortNameStraight);
        else if (this.sortByNameOrder == -1)
            this.employees.sort(this.sortNameReverse);
        this.refreshTable();
    };
    Main.prototype.sortByDepartment = function () {
        this.sortByNameOrder = 0;
        if (this.sortByDepartmentOrder == 0)
            this.sortByDepartmentOrder = 1;
        else if (this.sortByDepartmentOrder == 1)
            this.sortByDepartmentOrder = -1;
        else
            this.sortByDepartmentOrder = 1;
        if (this.sortByDepartmentOrder == 1)
            this.employees.sort(this.sortByDepartmentStraight);
        else if (this.sortByDepartmentOrder == -1)
            this.employees.sort(this.sortByDepartmentReverse);
        this.refreshTable();
    };
    Main.prototype.clearCreateForm = function () {
        document.getElementsByName('name')[0].value = '';
        document.getElementsByName('department')[0].value = '';
        document.getElementsByName('position')[0].value = '';
        document.getElementsByName('manager')[0].value = '';
        this.placeDate();
    };
    Main.prototype.placeDate = function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var sYyyy = today.getFullYear().toString();
        var sDd = dd.toString();
        var sMm = mm.toString();
        if (dd < 10) {
            sDd = '0' + dd;
        }
        if (mm < 10) {
            sMm = '0' + mm;
        }
        document.getElementsByName('startdate')[0].value = sYyyy + '-' + sMm + '-' + sDd;
    };
    Main.prototype.closeErrorWindow = function () {
        document.getElementById('modalWindow').style.display = "none";
    };
    Main.prototype.toggleAddEmployeeTab = function () {
        this.showAddEmployeeTab = !this.showAddEmployeeTab;
        var container1 = document.getElementById('container1');
        var container2 = document.getElementById('container2');
        var btn = document.getElementById('btnShowNewEmployee');
        if (this.showAddEmployeeTab) {
            container1.style.display = "none";
            container2.style.display = "block";
            btn.firstChild.textContent = "+";
        }
        else {
            container1.style.display = "block";
            container2.style.display = "none";
            btn.firstChild.textContent = "<";
        }
    };
    Main.prototype.createPageButton = function (text, dstLink, active) {
        var _this = this;
        var pagination = document.getElementById("pagination");
        var div = document.createElement("div");
        div.classList.add("button");
        var buttonText = document.createTextNode(text);
        div.appendChild(buttonText);
        if (active) {
            div.classList.add("active");
            pagination.appendChild(div);
        }
        else {
            var link = document.createElement("a");
            link.href = "#";
            link.id = dstLink.toString();
            link.addEventListener("click", function (event) {
                event.preventDefault();
                var a = event.srcElement;
                var div = a.parentNode;
                if (a.id)
                    _this.clickPage(Number(a.id));
                else
                    _this.clickPage(Number(div.id));
            });
            link.appendChild(div);
            pagination.appendChild(link);
        }
    };
    Main.prototype.clickCreate = function () {
        var _this = this;
        var form = document.getElementById('createemployee');
        var formData = new FormData(form);
        var obj = new Employee();
        formData.forEach(function (value, key) { return obj[key] = value; });
        this.fetcher.addEmployee(obj)
            .then(function (x) {
            if (x.status == 200) {
                _this.showError("Пользователь успешно добавлен");
                _this.refetchEmployeesList();
                _this.toggleAddEmployeeTab();
                _this.clearCreateForm();
            }
            else if (x.status == 400) {
                _this.showValidationErrors(x.errors);
            }
        })
            .catch(function (ex) {
            console.log(ex);
            _this.showError(ex.statusText);
        });
    };
    Main.prototype.showValidationErrors = function (errors) {
        for (var error in errors) {
            if (error[0] == '$')
                error = error.substring(2);
            var elem = document.getElementsByName(error.toLowerCase())[0];
            elem.classList.add("validate-error");
        }
    };
    Main.prototype.clickPage = function (page) {
        this.pagination.activePage = page;
        this.sortByNameOrder = 0;
        this.sortByDepartmentOrder = 0;
        this.refetchEmployeesList();
    };
    Main.prototype.clickHierarchy = function (sender, id) {
        var _this = this;
        this.fetcher.fetchHierarchy(id)
            .then(function (hierarchy) { return sender.parentElement.replaceChild(_this.showHierarchy(hierarchy), sender); })
            .catch(function (ex) { return _this.showError(ex); });
    };
    Main.prototype.showHierarchy = function (data) {
        var ul = document.createElement('ul');
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var manager = data_1[_i];
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(manager.name + ' (' + manager.subCount + ')'));
            ul.appendChild(li);
        }
        return ul;
    };
    Main.prototype.refreshPagination = function () {
        var pagination = document.getElementById("pagination");
        while (pagination.firstChild) {
            pagination.removeChild(pagination.firstChild);
        }
        if (this.pagination == null ||
            this.pagination.activePage == null ||
            this.pagination.totalPages == null ||
            this.pagination.totalPages == 0)
            return;
        if (this.pagination.activePage == 1)
            this.createPageButton('«', 1, true);
        else
            this.createPageButton('«', this.pagination.activePage - 1, false);
        if (this.pagination.activePage - 3 > 1)
            this.createPageButton('...', Math.floor((this.pagination.activePage - 3) / 2), false);
        var startPage = this.pagination.activePage > 4 ? this.pagination.activePage - 3 : 1;
        for (var i = startPage; i <= this.pagination.totalPages && i < startPage + 7; i++) {
            if (i == this.pagination.activePage)
                this.createPageButton(i.toString(), i, true);
            else
                this.createPageButton(i.toString(), i, false);
        }
        if (this.pagination.activePage + 3 < this.pagination.totalPages)
            this.createPageButton('...', Math.floor(this.pagination.activePage + 3 + (this.pagination.totalPages - (this.pagination.activePage + 3)) / 2), false);
        if (this.pagination.activePage == this.pagination.totalPages)
            this.createPageButton('»', this.pagination.totalPages + 1, true);
        else
            this.createPageButton('»', this.pagination.activePage + 1, false);
    };
    Main.prototype.refetchEmployeesList = function () {
        var _this = this;
        this.fetcher.fetchData(this.pagination.activePage)
            .then(function (response) {
            _this.employees = response.employees;
            if (response.pagination != null)
                _this.pagination = response.pagination;
            _this.refreshTable();
            _this.refreshPagination();
        })
            .catch(function (ex) { return _this.showError(ex); });
    };
    Main.prototype.refreshTableHeader = function () {
        var nameHeader = document.getElementById('btnNameSort');
        if (this.sortByNameOrder == 1)
            nameHeader.innerHTML = 'ФИО &darr;';
        else if (this.sortByNameOrder == -1)
            nameHeader.innerHTML = 'ФИО &uarr;';
        else
            nameHeader.innerHTML = 'ФИО &#8693;';
        var nameDepartment = document.getElementById('btnDepartmentSort');
        if (this.sortByDepartmentOrder == 1)
            nameDepartment.innerHTML = 'Отдел &darr;';
        else if (this.sortByDepartmentOrder == -1)
            nameDepartment.innerHTML = 'Отдел &uarr;';
        else
            nameDepartment.innerHTML = 'Отдел &#8693;';
    };
    Main.prototype.refreshTable = function () {
        var _this = this;
        this.refreshTableHeader();
        var oldTbody = document.getElementById('employeesTable').tBodies[0];
        var newTbody = document.createElement('tbody');
        if (!this.employees || this.employees.length == 0) {
            var row = newTbody.insertRow();
            var cellNoData = row.insertCell();
            cellNoData.colSpan = 7;
            cellNoData.style.textAlign = "center";
            cellNoData.textContent = "Нет данных о сотрудниках";
        }
        else {
            for (var i = 0; i < this.employees.length; i++) {
                var row = newTbody.insertRow();
                row.id = this.employees[i].id.toString();
                var cellNum = row.insertCell();
                cellNum.textContent = this.employees[i].id.toString();
                var cellName = row.insertCell();
                cellName.textContent = this.employees[i].name;
                var cellDepartment = row.insertCell();
                cellDepartment.textContent = this.employees[i].department;
                var cellPosition = row.insertCell();
                cellPosition.textContent = this.employees[i].position;
                var cellManager = row.insertCell();
                if (this.employees[i].manager) {
                    var linkHierarchy = document.createElement("a");
                    linkHierarchy.href = "#";
                    linkHierarchy.addEventListener("click", function (event) {
                        event.preventDefault();
                        var a = event.srcElement;
                        var src = a.parentNode;
                        _this.clickHierarchy(a, Number(src.parentNode.id));
                    });
                    linkHierarchy.appendChild(document.createTextNode(this.employees[i].manager));
                    linkHierarchy.title = "Показать всех";
                    cellManager.appendChild(linkHierarchy);
                }
                else {
                    cellManager.textContent = "Руководитель отсутсвует";
                }
                var startDate = "";
                var cellStartDate = row.insertCell();
                if (this.employees[i].startDate) {
                    startDate = new Date(this.employees[i].startDate).toLocaleDateString("ru-RU");
                }
                cellStartDate.textContent = startDate;
                var actionCell = row.insertCell();
                var linkRemove = document.createElement("a");
                linkRemove.href = "#";
                linkRemove.addEventListener("click", function (event) {
                    event.preventDefault();
                    var src = event.srcElement.parentNode;
                    _this.clickRemove(Number(src.parentNode.id));
                });
                linkRemove.appendChild(document.createTextNode("Удалить"));
                actionCell.appendChild(linkRemove);
            }
        }
        oldTbody.parentNode.replaceChild(newTbody, oldTbody);
    };
    Main.prototype.refreshManagersList = function (managers) {
        var managersHint = document.getElementById('managers');
        while (managersHint.firstChild) {
            managersHint.removeChild(managersHint.firstChild);
        }
        managers.forEach(function (item) {
            var option = document.createElement('option');
            option.value = item.name;
            managersHint.appendChild(option);
        });
    };
    Main.prototype.clickRemove = function (id) {
        var _this = this;
        this.fetcher.removeEmployee(id)
            .then(function () {
            if (_this.employees.length == 1 && _this.pagination.activePage > 2)
                _this.pagination.activePage--;
            _this.refetchEmployeesList();
        })
            .catch(function (ex) { return _this.showError(ex); });
    };
    Main.prototype.showError = function (text) {
        document.getElementById('modalWindow').style.display = 'block';
        var newError = document.createElement('p');
        newError.id = 'errorMessage';
        var oldError = document.getElementById('errorMessage');
        newError.appendChild(document.createTextNode(text));
        oldError.parentNode.replaceChild(newError, oldError);
    };
    return Main;
}());
var Fetcher = (function () {
    function Fetcher(apiUrl) {
        this.apiUrl = apiUrl;
    }
    Fetcher.prototype.fetchData = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                if (page < 1)
                    throw new Error("Некорректный номер страницы");
                url = this.apiUrl + '?page=' + page;
                return [2, fetch(url)
                        .then(function (response) {
                        if (!response.ok)
                            throw new Error(response.statusText);
                        return response.json();
                    })
                        .then(function (json) { return new EmployeesResponse(json.data, json.pagination); })];
            });
        });
    };
    Fetcher.prototype.removeEmployee = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                request = new Request(this.apiUrl + id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                return [2, fetch(request)
                        .then(function (response) {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                    })];
            });
        });
    };
    Fetcher.prototype.fetchHierarchy = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                url = this.apiUrl + 'hierarchy?id=' + id;
                return [2, fetch(url)
                        .then(function (response) {
                        if (!response.ok)
                            throw new Error(response.statusText);
                        return response.json();
                    })];
            });
        });
    };
    Fetcher.prototype.fetchManagers = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                url = this.apiUrl + 'byname/?name=' + name;
                return [2, fetch(url)
                        .then(function (response) {
                        if (!response.ok)
                            throw new Error(response.statusText);
                        return response.json();
                    })];
            });
        });
    };
    Fetcher.prototype.addEmployee = function (employee) {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                request = new Request(this.apiUrl, {
                    method: 'POST',
                    body: JSON.stringify(employee),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                return [2, fetch(request)
                        .then(function (response) {
                        if (response.status == 200)
                            return response;
                        else if (response.status == 400)
                            return response.json();
                        throw new Error(response.statusText);
                    })];
            });
        });
    };
    return Fetcher;
}());
var main;
window.onload = function () {
    console.log("Hello!");
    main = new Main('/api/');
};
//# sourceMappingURL=app.js.map