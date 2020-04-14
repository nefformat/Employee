using System;
using Xunit;
using Employees.Rest.Controllers;
using Employees.Rest.Infra;
using Moq;
using Employees.Rest.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Xunit.Abstractions;

namespace Employees.Rest.Tests
{
    public class EmployeeControllerTests
    {
        List<Employee> _employees;
        EmployeeController _controller;
        public EmployeeControllerTests()
        {
            // Arrange
            PopulateFakeEmployees();

            Mock<IEmployeesRepo> employeesRepo = new Mock<IEmployeesRepo>();
            employeesRepo.Setup(x => x.Get(It.IsAny<int>(), It.IsAny<int>()))
                .Returns((int skip, int take) => _employees.Skip(skip).Take(take));

            employeesRepo.Setup(x => x.Count())
                .Returns(_employees.Count());

            employeesRepo.Setup(x => x.GetById(It.IsAny<int>())).Returns(
                (int x) => _employees.Where(z => z.Id == x).FirstOrDefault());

            employeesRepo.Setup(x => x.GetListByName(It.IsAny<string>(), It.IsAny<int>()))
            //    .Returns((IEnumerable<Employee>)null);
            .Returns((string name, int take) => _employees.Where(z => z.Name.Contains(name)).Count() > 0 ? _employees.Where(z => z.Name.Contains(name)) : null);

            employeesRepo.Setup(x => x.GetHierarchy(It.IsAny<Employee>()))
                .Returns(() => GetTestHierarchy());

            employeesRepo.Setup(x => x.Remove(It.IsAny<Employee>()))
                .Callback<Employee>((Employee employee) => _employees = _employees.Where(x => x.Id != employee.Id).ToList());
            //.Returns(_employees);

            _controller = new EmployeeController(employeesRepo.Object);
        }

        [Fact]
        public void GetPageOk()
        {
            // Act
            var okResult = _controller.Get(2);
            Assert.IsType<OkObjectResult>(okResult.Result);
            var okObjectResult = okResult.Result as OkObjectResult;
            EmployeesResponse model = Assert.IsType<EmployeesResponse>(okObjectResult.Value);

            // Assert
            Assert.Equal(2, model.Pagination.ActivePage);
            Assert.Equal(4, model.Pagination.TotalPages);
            Assert.Equal(5, model.Data.Count());
        }
        [Fact]
        public void GetPageNotFound()
        {
            // Act
            var notFoundResult = _controller.Get(20);

            // Assert
            Assert.IsType<NotFoundResult>(notFoundResult.Result);
        }
        [Fact]
        public void GetListByNameOk()
        {
            // Act
            var okResult = _controller.GetListByName("Иван");
            var okObjectResult = okResult.Result as OkObjectResult;
            List<EmployeeResponse> model = Assert.IsAssignableFrom<IEnumerable<EmployeeResponse>>(okObjectResult.Value).ToList();

            // Assert
            Assert.IsType<OkObjectResult>(okResult.Result);
            Assert.Equal(3, model.Count);
            Assert.Equal("Иванов Иван Петрович", model[0].Name);
            Assert.Equal("Петренко Иван Олегович", model[1].Name);
            Assert.Equal("Ильин Макар Иванович", model[2].Name);
        }

        [Fact]
        public void GetListByNameNotFound()
        {
            // Act
            var okResult = _controller.GetListByName("Зигмунд123");
            // Act
            var notFoundResult = _controller.GetListByName("");

            Assert.IsType<NoContentResult>(okResult.Result);

            Assert.IsType<NotFoundResult>(notFoundResult.Result);
        }

        [Fact]
        public void GetHierarchyOk()
        {
            // Act
            var okResult = _controller.GetHierarchy(10);
            Assert.IsType<OkObjectResult>(okResult.Result);
            var okObjectResult = okResult.Result as OkObjectResult;
            List<HierarchyResponse> model = Assert.IsAssignableFrom<IEnumerable<HierarchyResponse>>(okObjectResult.Value).ToList();

            // Assert
            Assert.Equal(4, model.Count);

            Assert.Equal(1, model[0].Id);
            Assert.Equal(1, model[0].SubCount);

            Assert.Equal(2, model[1].Id);
            Assert.Equal(1, model[1].SubCount);

            Assert.Equal(3, model[2].Id);
            Assert.Equal(1, model[2].SubCount);

            Assert.Equal(4, model[3].Id);
            Assert.Equal(2, model[3].SubCount);
        }
        [Fact]
        public void GetHierarchyNotFound()
        {
            // Act
            var notFoundResult = _controller.GetHierarchy(40);

            // Assert
            Assert.IsType<NotFoundResult>(notFoundResult.Result);
        }
        [Fact]
        public void AddOk()
        {
            // Act
            EmployeeRequest employee = new EmployeeRequest { Name = "Тест Тестович Тестовый", Position = "Специалист по тестам", Department = "Отдел тестирования", StartDate = DateTime.Now };
            var actionResult = _controller.Add(employee);

            // Assert
            Assert.IsType<OkResult>(actionResult);
        }
        [Fact]
        public void AddBadRequest()
        {
            // Act
            EmployeeRequest employee = new EmployeeRequest { Position = "Специалист по тестам", Department = "Отдел тестирования", StartDate = DateTime.Now };
            _controller.ModelState.AddModelError("Name", "problem");
            var actionResult = _controller.Add(employee);

            // Assert
            Assert.IsType<BadRequestObjectResult>(actionResult);
        }

        [Fact]
        public void Remove()
        {
            // Act
            var actionResultOk = _controller.Remove(10);

            // Assert
            Assert.IsType<OkResult>(actionResultOk);

            // Act
            var actionResultNotFound = _controller.Remove(10);

            // Assert
            Assert.IsType<NotFoundResult>(actionResultNotFound);
        }


        private void PopulateFakeEmployees()
        {
            _employees = new List<Employee>(15);
            Employee employee1 = new Employee { Id = 1, Name = "Иванов Иван Петрович", Department = "Маркетинг", Position = "Маркетолог", ManagerId = null, StartDate = DateTime.Now };
            _employees.Add(employee1);

            Employee employee2 = new Employee { Id = 2, Name = "Зубко Елена Вадимовна", Department = "Маркетинг", Position = "Маркетолог", ManagerId = 1, StartDate = DateTime.Now };
            _employees.Add(employee2);

            Employee employee3 = new Employee { Id = 3, Name = "Cтепанов Владимир Станиславович", Department = "Маркетинг", Position = "Маркетолог", ManagerId = 2, StartDate = DateTime.Now };
            _employees.Add(employee3);

            Employee employee4 = new Employee { Id = 4, Name = "Альбрехт Сергей Сергеевич", Department = "Маркетинг", Position = "Маркетолог", ManagerId = 3, StartDate = DateTime.Now.AddDays(2) };
            _employees.Add(employee4);

            Employee employee5 = new Employee { Id = 5, Name = "Петренко Иван Олегович", Department = "Охрана труда", Position = "Специалист", ManagerId = 4, StartDate = DateTime.Now };
            _employees.Add(employee5);

            Employee employee6 = new Employee { Id = 6, Name = "Воробьёв Азарий Тарасович", Department = "Маркетинг", Position = "Маркетолог", ManagerId = 5, StartDate = DateTime.Now };
            _employees.Add(employee6);

            Employee employee7 = new Employee { Id = 7, Name = "Елисеев Людвиг Германович", Department = "Маркетинг", Position = "Маркетолог", ManagerId = 6, StartDate = DateTime.Now };
            _employees.Add(employee7);

            Employee employee8 = new Employee { Id = 8, Name = "Нестеров Самуил Павлович", Department = "Маркетинг", Position = "Маркетолог", ManagerId = 7, StartDate = DateTime.Now };
            _employees.Add(employee8);

            Employee employee9 = new Employee { Id = 9, Name = "Носков Артур Натанович", Department = "Маркетинг", Position = "Маркетолог", ManagerId = 8, StartDate = DateTime.Now.AddDays(2) };
            _employees.Add(employee9);

            Employee employee10 = new Employee { Id = 10, Name = "Королёв Вячеслав Ростиславович", Department = "Охрана труда", Position = "Специалист", ManagerId = 9, StartDate = DateTime.Now };
            _employees.Add(employee10);

            Employee employee11 = new Employee { Id = 11, Name = "Ильин Макар Иванович", Department = "Маркетинг", Position = "Маркетолог", ManagerId = 10, StartDate = DateTime.Now };
            _employees.Add(employee11);

            Employee employee12 = new Employee { Id = 12, Name = "Жуков Даниил Ефимович", Department = "Маркетинг", Position = "Маркетолог", ManagerId = 10, StartDate = DateTime.Now };
            _employees.Add(employee12);

            Employee employee13 = new Employee { Id = 13, Name = "Меркушев Велор Донатович", Department = "Маркетинг", Position = "Маркетолог", ManagerId = 10, StartDate = DateTime.Now };
            _employees.Add(employee13);

            Employee employee14 = new Employee { Id = 14, Name = "Игнатьев Эдуард Филатович", Department = "Маркетинг", Position = "Маркетолог", ManagerId = 10, StartDate = DateTime.Now.AddDays(2) };
            _employees.Add(employee14);

            Employee employee15 = new Employee { Id = 15, Name = "Ильин Севастьян Наумович", Department = "Охрана труда", Position = "Специалист", ManagerId = 10, StartDate = DateTime.Now };
            _employees.Add(employee15);

            Employee employee16 = new Employee { Id = 16, Name = "Сергеев Савелий Владимирович", Department = "Отдел торговли", Position = "Покупатель", ManagerId = 4, StartDate = DateTime.Now };
            _employees.Add(employee16);
        }

        private List<HierarchyResponse> GetTestHierarchy()
        {
            List<HierarchyResponse> result = new List<HierarchyResponse>
            {
                new HierarchyResponse { Id= 1, Name = "Иванов Иван Петрович", SubCount = 1 },
                new HierarchyResponse { Id= 2, Name = "Зубко Елена Вадимовна", SubCount = 1 },
                new HierarchyResponse { Id= 3, Name = "Cтепанов Владимир Станиславович", SubCount = 1 },
                new HierarchyResponse { Id= 4, Name = "Альбрехт Сергей Сергеевич", SubCount = 2 },
            };
            return result;
        }
    }
}
