using Employees.Rest.Infra;
using Employees.Rest.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Employees.Rest.Attributes
{
    public class ManagerAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            string employeeName = value as string;

            if (employeeName == null || employeeName.Length == 0)
                return ValidationResult.Success;

            IEmployeesRepo employeesRepo = (IEmployeesRepo)validationContext.GetService(typeof(IEmployeesRepo));
            Employee employee = employeesRepo.GetByName(employeeName);
            if (employee == null)
                return new ValidationResult("Not found");
            return ValidationResult.Success;
        }
    }
}
