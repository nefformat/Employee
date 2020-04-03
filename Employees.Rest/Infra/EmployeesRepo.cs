using Employees.Rest.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Employees.Rest.Infra
{
    public class EmployeesRepo : IEmployeesRepo
    {
        private List<Employee> _employees;
        public EmployeesRepo()
        {
            _employees = new List<Employee>();
            FakePopulate();
        }

        public Employee GetByName(string name)
        {
            return _employees.Where(x => x.Name == name).FirstOrDefault();
        }

        public IEnumerable<Employee> GetListByName(string name, int take = 5)
        {
            return _employees.Where(x => x.Name.Contains(name)).Take(take);
        }
        public IEnumerable<Employee> Get(int skip, int take)
        {
            if (skip < 0 || take < 1)
                throw new ArgumentOutOfRangeException();

            return _employees.Skip(skip).Take(take);
        }
        public Employee GetById(int id)
        {
            return _employees.FirstOrDefault(x => x.Id == id);
        }

        public void Add(Employee employee)
        {
            if (employee == null)
                throw new ArgumentNullException();
            employee.Id = _employees.Max(x => x.Id) + 1;
            _employees.Add(employee);
        }
        public void Remove(Employee employee)
        {
            if (employee == null)
                throw new ArgumentNullException();
            Employee employeeForRemove = _employees.FirstOrDefault(x => x.Id == employee.Id);
            if (employeeForRemove != null)
                _employees.Remove(employeeForRemove);
        }
        public int Count()
        {
            return _employees.Count;
        }
        private void FakePopulate()
        {
            _employees.Add(new Employee { Id = 1, Name = "Иванов Иван Петрович", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 2, Name = "Зубко Елена Вадимовна", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 3, Name = "Cтепанов Владимир Станиславович", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 4, Name = "Альбрехт Сергей Сергеевич", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now.AddDays(2) });
            _employees.Add(new Employee { Id = 5, Name = "Петренко Иван Олегович", Department = "Охрана труда", Position = "Специалист", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 6, Name = "Воробьёв Азарий Тарасович", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 7, Name = "Елисеев Людвиг Германович", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 8, Name = "Нестеров Самуил Павлович", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 9, Name = "Носков Артур Натанович", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now.AddDays(2) });
            _employees.Add(new Employee { Id = 10, Name = "Королёв Вячеслав Ростиславович", Department = "Охрана труда", Position = "Специалист", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 11, Name = "Ильин Макар Иванович", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 12, Name = "Жуков Даниил Ефимович", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 13, Name = "Меркушев Велор Донатович", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 14, Name = "Игнатьев Эдуард Филатович", Department = "Маркетинг", Position = "Маркетолог", StartDate = DateTime.Now.AddDays(2) });
            _employees.Add(new Employee { Id = 15, Name = "Ильин Севастьян Наумович", Department = "Охрана труда", Position = "Специалист", StartDate = DateTime.Now });
            _employees.Add(new Employee { Id = 16, Name = "Сергеев Савелий Владимирович", Department = "Отдел торговли", Position = "Покупатель", StartDate = DateTime.Now });
        }
    }
}
