using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Employees.Rest.Models
{
    public class EmployeesResponse
    {
        public IEnumerable<Employee> Data { get; set; }
        public PaginationResponse Pagination { get; set; }
    }
}
