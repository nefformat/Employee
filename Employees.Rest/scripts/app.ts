class Employee {
    id: number;
    name: string;
    department: string;
    position: string;
    manager: string;
    startDate: string;
}

class Pagination {
    activePage: number;
    totalPages: number;
}

class EmployeesResponse {
    employees: Array<Employee>;
    pagination: Pagination;
    constructor(employees: Array<Employee>, pagination: Pagination) {
        this.employees = employees;
        this.pagination = pagination;
    }
}

class HierarchyResponse {
    id: number;
    name: string;
    subCount: number;
}

class Main {
    fetcher: Fetcher;
    employees: Array<Employee>;
    pagination: Pagination;
    showAddEmployeeTab: boolean;
    sortByNameOrder: number;
    sortByDepartmentOrder: number;

    constructor(apiUrl: string) {
        this.fetcher = new Fetcher(apiUrl);
        this.showAddEmployeeTab = true;
        this.pagination = new Pagination();
        this.pagination.activePage = 1;
        this.sortByNameOrder = 0;
        this.sortByDepartmentOrder = 0;
        this.placeDate();

        //register handlers
        document.getElementById('btnShowNewEmployee').addEventListener("click", event => { event.preventDefault(); this.toggleAddEmployeeTab(); });
        document.getElementById('btnCreate').addEventListener("click", event => { event.preventDefault(); this.clickCreate() });
        document.getElementById('btnClose').addEventListener("click", event => { event.preventDefault(); this.closeErrorWindow(); });
        document.getElementsByName('name')[0].addEventListener("input", event => (<HTMLInputElement>event.srcElement).classList.remove('validate-error'));
        document.getElementsByName('department')[0].addEventListener("input", event => (<HTMLInputElement>event.srcElement).classList.remove('validate-error'));
        document.getElementsByName('position')[0].addEventListener("input", event => (<HTMLInputElement>event.srcElement).classList.remove('validate-error'));
        document.getElementsByName('manager')[0].addEventListener("input", event => { event.preventDefault(); this.inputManager(<HTMLInputElement>event.srcElement) });
        document.getElementsByName('startdate')[0].addEventListener("input", event => (<HTMLInputElement>event.srcElement).classList.remove('validate-error'));
        document.getElementById('btnNameSort').addEventListener("click", event => { event.preventDefault; this.sortByName() });
        document.getElementById('btnDepartmentSort').addEventListener("click", event => { event.preventDefault; this.sortByDepartment() });
        this.refetchEmployeesList();
    }

    inputManager(sender: HTMLInputElement): void {
        sender.classList.remove('validate-error');
        if (sender.value.length < 3)
            return;
        this.fetcher.fetchManagers(sender.value)
            .then(managers => this.refreshManagersList(managers))
            .catch(ex => {
                this.showError(ex.statusText)
            });
    }

    sortNameStraight(a: Employee, b: Employee): number {
        let nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase()
        if (nameA < nameB)
            return -1
        if (nameA > nameB)
            return 1
        return 0
    }

    sortNameReverse(a: Employee, b: Employee): number {
        let nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase()
        if (nameA > nameB)
            return -1
        if (nameA < nameB)
            return 1
        return 0
    }

    sortByDepartmentStraight(a: Employee, b: Employee): number {
        let depatmentA = a.department.toLowerCase(),
            depatmentB = b.department.toLowerCase()
        if (depatmentA < depatmentB)
            return -1
        if (depatmentA > depatmentB)
            return 1
        return 0
    }

    sortByDepartmentReverse(a: Employee, b: Employee): number {
        let depatmentA = a.department.toLowerCase(),
            depatmentB = b.department.toLowerCase()
        if (depatmentA > depatmentB)
            return -1
        if (depatmentA < depatmentB)
            return 1
        return 0
    }

    sortByName(): void {
        this.sortByDepartmentOrder = 0;

        if (this.sortByNameOrder == 0) {
            this.sortByNameOrder = 1;
        } else if (this.sortByNameOrder == 1) {
            this.sortByNameOrder = -1;
        } else {
            this.sortByNameOrder = 1;
        }

        if (this.sortByNameOrder == 1)
            this.employees.sort(this.sortNameStraight);
        else if (this.sortByNameOrder == -1)
            this.employees.sort(this.sortNameReverse);
        this.refreshTable();
    }

    sortByDepartment(): void {
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
    }

    clearCreateForm(): void {
        (<HTMLInputElement>document.getElementsByName('name')[0]).value = '';
        (<HTMLInputElement>document.getElementsByName('department')[0]).value = '';
        (<HTMLInputElement>document.getElementsByName('position')[0]).value = '';
        (<HTMLInputElement>document.getElementsByName('manager')[0]).value = '';
        this.placeDate();
    }

    placeDate(): void {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let sYyyy = today.getFullYear().toString();

        let sDd = dd.toString();
        let sMm = mm.toString();

        if (dd < 10) {
            sDd = '0' + dd
        }

        if (mm < 10) {
            sMm = '0' + mm
        }

        (<HTMLInputElement>document.getElementsByName('startdate')[0]).value = sYyyy + '-' + sMm + '-' + sDd;
    }

    closeErrorWindow(): void {
        document.getElementById('modalWindow').style.display = "none";
    }

    toggleAddEmployeeTab(): void {
        this.showAddEmployeeTab = !this.showAddEmployeeTab;
        let container1 = document.getElementById('container1');
        let container2 = document.getElementById('container2');
        let btn = document.getElementById('btnShowNewEmployee');

        if (this.showAddEmployeeTab) {
            container1.style.display = "none";
            container2.style.display = "block";
            btn.firstChild.textContent = "+";
        } else {
            container1.style.display = "block";
            container2.style.display = "none";
            btn.firstChild.textContent = "<";
        }
    }

    createPageButton(text: string, dstLink: number, active: boolean): void {
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
            link.id = dstLink.toString();
            link.addEventListener("click", event => {
                event.preventDefault();
                let a = <HTMLAnchorElement>event.srcElement;
                let div = <HTMLDivElement>a.parentNode;
                if (a.id)
                    this.clickPage(Number(a.id));
                else
                    this.clickPage(Number(div.id));
            });
            link.appendChild(div);
            pagination.appendChild(link);
        }
    }

    clickCreate(): void {
        let form = <HTMLFormElement>document.getElementById('createemployee');
        let formData = new FormData(form);

        let obj = new Employee();
        formData.forEach((value, key) => obj[key] = value);

        this.fetcher.addEmployee(obj)
            .then(x => {
                if (x.status == 200) {
                    this.showError("Пользователь успешно добавлен");
                    this.refetchEmployeesList();
                    this.toggleAddEmployeeTab();
                    this.clearCreateForm();
                }
                else if (x.status == 400) {
                    this.showValidationErrors(x.errors)
                }
            })
            .catch(ex => {
                this.showError(ex.statusText)
            });
    }

    showValidationErrors(errors): void {
        for (let error in errors) {
            if (error[0] == '$')
                error = error.substring(2);
            let elem = document.getElementsByName(error.toLowerCase())[0];
            elem.classList.add("validate-error");
        }
    }

    clickPage(page: number) {
        this.pagination.activePage = page;
        this.sortByNameOrder = 0;
        this.sortByDepartmentOrder = 0;
        this.refetchEmployeesList();
    }

    clickHierarchy(sender: HTMLAnchorElement, id: number) {
        this.fetcher.fetchHierarchy(id)
            .then(hierarchy => sender.parentElement.replaceChild(this.showHierarchy(hierarchy), sender))
            .catch(ex => this.showError(ex));
    }

    showHierarchy(data: Array<HierarchyResponse>): HTMLUListElement {
        let ul = document.createElement('ul');

        for (let manager of data) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(manager.name + ' (' + manager.subCount + ')'));
            ul.appendChild(li);
        }
        return ul;
    }

    refreshPagination(): void {
        let pagination = document.getElementById("pagination");
        while (pagination.firstChild) {
            pagination.removeChild(pagination.firstChild);
        }

        if (this.pagination.activePage == 1)
            this.createPageButton('«', 1, true);
        else
            this.createPageButton('«', this.pagination.activePage - 1, false);

        // Dots from left corner
        if (this.pagination.activePage - 3 > 1)
            this.createPageButton('...', Math.floor((this.pagination.activePage - 3) / 2), false);

        let startPage = this.pagination.activePage > 4 ? this.pagination.activePage - 3 : 1;
        for (let i = startPage; i <= this.pagination.totalPages && i < startPage + 7; i++) {
            if (i == this.pagination.activePage)
                this.createPageButton(i.toString(), i, true);
            else
                this.createPageButton(i.toString(), i, false);
        }
        // Dots from right corner
        if (this.pagination.activePage + 3 < this.pagination.totalPages)
            this.createPageButton('...', Math.floor(this.pagination.activePage + 3 + (this.pagination.totalPages - (this.pagination.activePage + 3)) / 2), false);


        if (this.pagination.activePage == this.pagination.totalPages)
            this.createPageButton('»', this.pagination.totalPages + 1, true);
        else
            this.createPageButton('»', this.pagination.activePage + 1, false);
    }

    refetchEmployeesList(): void {
        this.fetcher.fetchData(this.pagination.activePage)
            .then(response => {
                this.employees = response.employees;
                this.pagination = response.pagination;
                this.refreshTable();
                this.refreshPagination();
            })
            .catch(ex => this.showError(ex));
    }

    refreshTableHeader(): void {
        let nameHeader = document.getElementById('btnNameSort');
        if (this.sortByNameOrder == 1)
            nameHeader.innerHTML = 'ФИО &darr;';
        else if (this.sortByNameOrder == -1)
            nameHeader.innerHTML = 'ФИО &uarr;';
        else
            nameHeader.innerHTML = 'ФИО &#8693;';

        let nameDepartment = document.getElementById('btnDepartmentSort');
        if (this.sortByDepartmentOrder == 1)
            nameDepartment.innerHTML = 'Отдел &darr;';
        else if (this.sortByDepartmentOrder == -1)
            nameDepartment.innerHTML = 'Отдел &uarr;';
        else
            nameDepartment.innerHTML = 'Отдел &#8693;';
    }

    refreshTable(): void {
        this.refreshTableHeader();
        let oldTbody = (<HTMLTableElement>document.getElementById('employeesTable')).tBodies[0];
        let newTbody = document.createElement('tbody');
        if (!this.employees || this.employees.length == 0) {
            let row = newTbody.insertRow();
            let cellNoData = row.insertCell();
            cellNoData.colSpan = 7;
            cellNoData.style.textAlign = "center";
            cellNoData.textContent = "Нет данных о сотрудниках";
        } else {

            for (var i = 0; i < this.employees.length; i++) {
                let row = newTbody.insertRow();
                row.id = this.employees[i].id.toString();
                let cellNum = row.insertCell();
                cellNum.textContent = this.employees[i].id.toString();

                let cellName = row.insertCell();
                cellName.textContent = this.employees[i].name;

                let cellDepartment = row.insertCell();
                cellDepartment.textContent = this.employees[i].department;

                let cellPosition = row.insertCell();
                cellPosition.textContent = this.employees[i].position;

                let cellManager = row.insertCell();
                if (this.employees[i].manager) {
                    let linkHierarchy = document.createElement("a");
                    linkHierarchy.href = "#";
                    linkHierarchy.addEventListener("click", event => {
                        event.preventDefault();
                        let a = <HTMLAnchorElement>event.srcElement;
                        let src = a.parentNode;
                        this.clickHierarchy(a, Number((<HTMLTableRowElement>src.parentNode).id));
                    });
                    linkHierarchy.appendChild(document.createTextNode(this.employees[i].manager));
                    linkHierarchy.title = "Показать всех";
                    cellManager.appendChild(linkHierarchy);
                } else {
                    cellManager.textContent = "Руководитель отсутсвует";
                }

                let startDate = "";
                let cellStartDate = row.insertCell();
                if (this.employees[i].startDate) {
                    startDate = new Date(this.employees[i].startDate).toLocaleDateString("ru-RU");
                }
                cellStartDate.textContent = startDate;

                let actionCell = row.insertCell();
                let linkRemove = document.createElement("a");
                linkRemove.href = "#";
                linkRemove.addEventListener("click", event => {
                    event.preventDefault();
                    let src = (<HTMLAnchorElement>event.srcElement).parentNode;
                    this.clickRemove(Number((<HTMLTableRowElement>src.parentNode).id));
                });
                linkRemove.appendChild(document.createTextNode("Удалить"));

                actionCell.appendChild(linkRemove);
            }
        }
        oldTbody.parentNode.replaceChild(newTbody, oldTbody)
    }

    refreshManagersList(managers: Array<Employee>) {
        let managersHint = document.getElementById('managers');
        while (managersHint.firstChild) {
            managersHint.removeChild(managersHint.firstChild);
        }

        managers.forEach(function (item) {
            var option = document.createElement('option');
            option.value = item.name;
            managersHint.appendChild(option);
        });
    }

    clickRemove(id: number): void {
        this.fetcher.removeEmployee(id)
            .then(() => {
                if (this.employees.length == 1 || this.pagination.activePage > 2)
                    this.pagination.activePage--;
                this.refetchEmployeesList();
            })
            .catch(ex => this.showError(ex));
    }

    showError(text: string): void {
        document.getElementById('modalWindow').style.display = 'block';
        let newError = document.createElement('p');
        newError.id = 'errorMessage';
        let oldError = document.getElementById('errorMessage');

        newError.appendChild(document.createTextNode(text));
        oldError.parentNode.replaceChild(newError, oldError)
    }
}

class Fetcher {
    apiUrl: string;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async fetchData(page: number): Promise<EmployeesResponse> {
        if (page < 1)
            throw new Error("Некорректный номер страницы");

        let url = this.apiUrl + '?page=' + page;
        return fetch(url)
            .then(response => {
                if (!response.ok)
                    throw new Error(response.statusText);
                return response.json()
            })
            .then(json => new EmployeesResponse(json.data, json.pagination));
    }

    async removeEmployee(id: number): Promise<void> {
        let request = new Request(this.apiUrl + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return fetch(request)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
            });
    }

    async fetchHierarchy(id: number): Promise<Array<HierarchyResponse>> {
        let url = this.apiUrl + 'hierarchy?id=' + id;

        return fetch(url)
            .then(response => {
                if (!response.ok)
                    throw new Error(response.statusText);
                return response.json();
            })
    }

    async fetchManagers(name: string): Promise<Array<Employee>> {
        let url = this.apiUrl + 'byname/?name=' + name;

        return fetch(url)
            .then(response => {
                if (!response.ok)
                    throw new Error(response.statusText);
                return response.json();
            })
    }

    async addEmployee(employee: Employee): Promise<any> {
        let request = new Request(this.apiUrl, {
            method: 'POST',
            body: JSON.stringify(employee),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return fetch(request)
            .then(
                response => {
                    if (response.status == 200)
                        return response;
                    else if (response.status == 400)
                        return response.json();
                    throw new Error(response.statusText);
                });
    }
}

let main;
window.onload = () => {
    main = new Main('/api/');
}