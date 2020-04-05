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

        public IEnumerable<HierarchyResponse> GetHierarchy(Employee employee)
        {
            if (employee == null || employee.Manager == null)
                return null;

            List<HierarchyResponse> employees = new List<HierarchyResponse>();

            GetHirarchyRecursion(employee);

            Employee GetHirarchyRecursion(Employee employee)
            {
                if (employee == null)
                    return null;

                employees.Add(new HierarchyResponse() { Id = employee.Id, Name = employee.Name });

                if (employee.Manager == null)
                    return null;

                return GetHirarchyRecursion(employee.Manager);
            }


            return employees.Skip(1).Reverse();
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

            _employees.ForEach(x => { if (x.Manager == employeeForRemove) x.Manager = null; });

            if (employeeForRemove != null)
                _employees.Remove(employeeForRemove);
        }
        public int Count()
        {
            return _employees.Count;
        }
        private void FakePopulate()
        {
            Employee employee1 = new Employee { Id = 1, Name = "Иванов Иван Петрович", Department = "Маркетинг", Position = "Маркетолог", Manager = null, StartDate = DateTime.Now };
            _employees.Add(employee1);

            Employee employee2 = new Employee { Id = 2, Name = "Зубко Елена Вадимовна", Department = "Маркетинг", Position = "Маркетолог", Manager = employee1, StartDate = DateTime.Now };
            _employees.Add(employee2);

            Employee employee3 = new Employee { Id = 3, Name = "Cтепанов Владимир Станиславович", Department = "Маркетинг", Position = "Маркетолог", Manager = employee2, StartDate = DateTime.Now };
            _employees.Add(employee3);

            Employee employee4 = new Employee { Id = 4, Name = "Альбрехт Сергей Сергеевич", Department = "Маркетинг", Position = "Маркетолог", Manager = employee3, StartDate = DateTime.Now.AddDays(2) };
            _employees.Add(employee4);

            Employee employee5 = new Employee { Id = 5, Name = "Петренко Иван Олегович", Department = "Охрана труда", Position = "Специалист", Manager = employee4, StartDate = DateTime.Now };
            _employees.Add(employee5);

            Employee employee6 = new Employee { Id = 6, Name = "Воробьёв Азарий Тарасович", Department = "Маркетинг", Position = "Маркетолог", Manager = employee5, StartDate = DateTime.Now };
            _employees.Add(employee6);

            Employee employee7 = new Employee { Id = 7, Name = "Елисеев Людвиг Германович", Department = "Маркетинг", Position = "Маркетолог", Manager = employee6, StartDate = DateTime.Now };
            _employees.Add(employee7);

            Employee employee8 = new Employee { Id = 8, Name = "Нестеров Самуил Павлович", Department = "Маркетинг", Position = "Маркетолог", Manager = employee7, StartDate = DateTime.Now };
            _employees.Add(employee8);

            Employee employee9 = new Employee { Id = 9, Name = "Носков Артур Натанович", Department = "Маркетинг", Position = "Маркетолог", Manager = employee8, StartDate = DateTime.Now.AddDays(2) };
            _employees.Add(employee9);

            Employee employee10 = new Employee { Id = 10, Name = "Королёв Вячеслав Ростиславович", Department = "Охрана труда", Position = "Специалист", Manager = employee9, StartDate = DateTime.Now };
            _employees.Add(employee10);

            Employee employee11 = new Employee { Id = 11, Name = "Ильин Макар Иванович", Department = "Маркетинг", Position = "Маркетолог", Manager = employee10, StartDate = DateTime.Now };
            _employees.Add(employee11);

            Employee employee12 = new Employee { Id = 12, Name = "Жуков Даниил Ефимович", Department = "Маркетинг", Position = "Маркетолог", Manager = employee10, StartDate = DateTime.Now };
            _employees.Add(employee12);

            Employee employee13 = new Employee { Id = 13, Name = "Меркушев Велор Донатович", Department = "Маркетинг", Position = "Маркетолог", Manager = employee10, StartDate = DateTime.Now };
            _employees.Add(employee13);

            Employee employee14 = new Employee { Id = 14, Name = "Игнатьев Эдуард Филатович", Department = "Маркетинг", Position = "Маркетолог", Manager = employee10, StartDate = DateTime.Now.AddDays(2) };
            _employees.Add(employee14);

            Employee employee15 = new Employee { Id = 15, Name = "Ильин Севастьян Наумович", Department = "Охрана труда", Position = "Специалист", Manager = employee10, StartDate = DateTime.Now };
            _employees.Add(employee15);

            Employee employee16 = new Employee { Id = 16, Name = "Сергеев Савелий Владимирович", Department = "Отдел торговли", Position = "Покупатель", Manager = employee10, StartDate = DateTime.Now };
            _employees.Add(employee16);

        }
    }
}
