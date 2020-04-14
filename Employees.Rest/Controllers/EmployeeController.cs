using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Employees.Rest.Infra;
using Employees.Rest.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Employees.Rest.Controllers
{
    [Route("api/")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private IEmployeesRepo _employeesRepo;
        private int _pageSize;
        public EmployeeController(IEmployeesRepo employeesRepo)
        {
            _employeesRepo = employeesRepo;
            _pageSize = 5;
        }

        [Route("byname/")]
        public ActionResult<IEnumerable<EmployeeResponse>> GetListByName(string name)
        {
            if (string.IsNullOrEmpty(name) || name.Length < 3)
            {
                return NotFound();
            }

            IEnumerable<Employee> employees = _employeesRepo.GetListByName(name);

            if (employees == null)
                return NoContent();

            var result = employees.Select(x =>
                new EmployeeResponse
                {
                    Id = x.Id,
                    Name = x.Name,
                    Department = x.Department,
                    Position = x.Position,
                    Manager = x.ManagerId == null ? null : _employeesRepo.GetById((int)x.ManagerId).Name,
                    StartDate = x.StartDate
                }
            );

            return Ok(result);
        }

        [HttpGet]
        [Route("hierarchy/")]
        public ActionResult<IEnumerable<HierarchyResponse>> GetHierarchy(int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Employee employee = _employeesRepo.GetById(id);

            if (employee == null)
                return NotFound();

            IEnumerable<HierarchyResponse> hierarchy = _employeesRepo.GetHierarchy(employee);

            if (hierarchy == null)
                return NotFound();

            return Ok(hierarchy);
        }

        [HttpGet]
        public ActionResult<EmployeesResponse> Get(int page)
        {
            int employeesCount = _employeesRepo.Count();
            int totalPages = (int)Math.Ceiling((double)employeesCount / _pageSize);

            if (page < 1 || page - 1 > totalPages)
                return NotFound();

            if (employeesCount == 0)
                return new EmployeesResponse
                {
                    Data = null,
                    Pagination = new PaginationResponse { ActivePage = 1, TotalPages = 0 }
                };

            List<EmployeeResponse> employees = _employeesRepo.Get((page - 1) * _pageSize, _pageSize)
                .Select(x =>
                    new EmployeeResponse()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Department = x.Department,
                        Position = x.Position,
                        Manager = x.ManagerId == null ? null : _employeesRepo.GetById((int)x.ManagerId).Name,
                        StartDate = x.StartDate
                    }
                )
                .ToList();

            EmployeesResponse employeesResponse =
                new EmployeesResponse
                {
                    Data = employees,
                    Pagination = new PaginationResponse
                    {
                        ActivePage = page,
                        TotalPages = totalPages
                    }
                };
            return Ok(employeesResponse);
        }
        [HttpPost]
        public IActionResult Add(EmployeeRequest employee)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Employee manager = null;

            if (!string.IsNullOrEmpty(employee.Manager))
            {
                manager = _employeesRepo.GetByName(employee.Manager);
                if (manager == null)
                {
                    ModelState.AddModelError(nameof(employee.Manager), "Manager is not be found");
                    return BadRequest(ModelState);
                }
            }

            Employee emp = new Employee();
            emp.Id = employee.Id;
            emp.Name = employee.Name;
            emp.Department = employee.Department;
            emp.Position = employee.Position;
            emp.ManagerId = manager?.Id;
            emp.StartDate = employee.StartDate;

            _employeesRepo.Add(emp);
            return Ok();
        }
        [HttpDelete("{id:int}")]
        public IActionResult Remove(int id)
        {

            if (!ModelState.IsValid)
                return BadRequest();

            Employee employee = _employeesRepo.GetById(id);
            if (employee == null)
                return NotFound();
            _employeesRepo.Remove(employee);
            return Ok();

        }
    }
}