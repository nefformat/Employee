using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Employees.Rest.Models
{
    public class PaginationResponse
    {
        public int ActivePage { get; set; }
        public int TotalPages { get; set; }
    }
}
