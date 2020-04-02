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
                EmployeesResponse employeesResponse =
                    new EmployeesResponse
                    {
                        Data = _employeesRepo.Get((page - 1) * _pageSize, _pageSize),
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
        public IActionResult Add(Employee employee)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            try
            {
                _employeesRepo.Add(employee);
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