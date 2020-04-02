using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Employees.Rest.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string Name {get; set;}
        public string Department { get; set; }
        public string Position { get; set; }
        public string Leader { get; set; }
        public int? LeaderId { get; set; }
        public DateTime StartDate { get; set; }
    }
}
