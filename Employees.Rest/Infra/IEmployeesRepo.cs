using Employees.Rest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Employees.Rest.Infra
{
    public interface IEmployeesRepo
    {
        Employee GetByName(string name);
        IEnumerable<Employee> GetListByName(string name, int take = 5);
        IEnumerable<Employee> Get(int skip, int take);
        Employee GetById(int id);
        void Add(Employee employee);
        void Remove(Employee employee);
        int Count();
    }
}
