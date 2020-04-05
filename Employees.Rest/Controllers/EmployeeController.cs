using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Employees.Rest.Infra;
using Employees.Rest.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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
        public ActionResult<EmployeesResponse> GetListByName(string name)
        {
            if (string.IsNullOrEmpty(name) || name.Length < 3)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            try
            {
                return Ok(_employeesRepo.GetListByName(name));
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
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
            int totalPages = (int)Math.Ceiling((double)_employeesRepo.Count() / _pageSize);

            if (page < 1 || page - 1 > totalPages)
                return NotFound();

            if (_employeesRepo.Count() == 0)
                return new EmployeesResponse
                {
                    Data = null,
                    Pagination = null
                };

            try
            {
                List<EmployeeResponse> employees = _employeesRepo.Get((page - 1) * _pageSize, _pageSize)
                    .Select(x =>
                        new EmployeeResponse()
                        {
                            Id = x.Id,
                            Name = x.Name,
                            Department = x.Department,
                            Position = x.Position,
                            Manager = x.Manager?.Name,
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
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
        [HttpPost]
        public IActionResult Add(EmployeeRequest employee)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Employee manager = null;

            if (employee.Manager != null)
            {
                manager = _employeesRepo.GetByName(employee.Manager);
                if (manager == null)
                {
                    ModelState.AddModelError(nameof(employee.Manager), "Manager is not be found");
                    return BadRequest(ModelState);
                }
            }

            try
            {
                Employee emp = new Employee();
                emp.Id = employee.Id;
                emp.Name = employee.Name;
                emp.Department = employee.Department;
                emp.Position = employee.Position;
                emp.Manager = manager;
                emp.StartDate = employee.StartDate;

                _employeesRepo.Add(emp);
                return Ok();
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
        [HttpDelete("{id:int}")]
        public IActionResult Remove(int id)
        {
            
            if (!ModelState.IsValid)
                return BadRequest();
            try
            {
                Employee employee = _employeesRepo.GetById(id);
                if (employee == null)
                    return NotFound();
                _employeesRepo.Remove(employee);
                return Ok();
            }
            catch
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}