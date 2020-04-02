using Employees.Rest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Employees.Rest.Infra
{
    public interface IEmployeesRepo
    {
        IEnumerable<Employee> Get(int skip, int take);
        Employee GetById(int id);
        void Add(Employee employee);
        void Remove(Employee employee);
        int Count();
    }
}
