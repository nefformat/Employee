﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Employees.Rest.Models
{
    public class Employee
    {
        public int Id { get; set; }
        [Required]
        [Display(Name = "Имя фамилия отчество")]
        public string Name {get; set;}
        [Required]
        [Display(Name = "Отдел")]
        public string Department { get; set; }
        [Required]
        [Display(Name = "Должность")]
        public string Position { get; set; }
        public Employee Manager { get; set; }
        [Display(Name = "Руководитель")]
        public int? ManagerId { get; set; }
        [Required]
        [Display(Name = "Дата начала работы")]
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }
    }
}
