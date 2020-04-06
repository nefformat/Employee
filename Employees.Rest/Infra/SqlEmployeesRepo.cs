using Employees.Rest.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace Employees.Rest.Infra
{
    public class SqlEmployeesRepo : IEmployeesRepo
    {
        private string _connectionString;

        public SqlEmployeesRepo(IOptions<Settings> settings)
        {
            if (!settings.Value.ConnectionStrings.ContainsKey("DefaultConnection"))
            {
                throw new KeyNotFoundException("DefaultConnection");
            }

            _connectionString = settings.Value.ConnectionStrings["DefaultConnection"];
        }
        public Employee GetByName(string name)
        {
            if (string.IsNullOrEmpty(name) || name.Length > 100)
                throw new ArgumentOutOfRangeException();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetByName", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SqlParameter nameParam = new SqlParameter
                    {
                        ParameterName = "@name",
                        Value = name
                    };
                    command.Parameters.Add(nameParam);

                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();

                    if (reader.HasRows)
                    {
                        Employee employee = null;
                        if (reader.Read())
                        {
                            employee = new Employee()
                            {
                                Id = reader.GetInt32(0),
                                Name = reader.IsDBNull(1) ? "" : reader.GetString(1),
                                Department = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                Position = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                ManagerId = reader.IsDBNull(4) ? null : (int?)reader.GetInt32(4),
                                StartDate = reader.GetDateTime(5)
                            };
                        }
                        connection.Close();

                        return employee;
                    }
                    return null;
                }
            }
        }
        public IEnumerable<Employee> GetListByName(string name, int take = 5)
        {
            if (string.IsNullOrEmpty(name) || take < 1)
                throw new ArgumentOutOfRangeException();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetListByName", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SqlParameter nameParam = new SqlParameter
                    {
                        ParameterName = "@name",
                        Value = name
                    };
                    command.Parameters.Add(nameParam);

                    SqlParameter takeParam = new SqlParameter
                    {
                        ParameterName = "@take",
                        Value = take
                    };
                    command.Parameters.Add(takeParam);

                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();

                    if (reader.HasRows)
                    {
                        List<Employee> employees = new List<Employee>();
                        while (reader.Read())
                        {
                            employees.Add(
                                new Employee()
                                {
                                    Id = reader.GetInt32(0),
                                    Name = reader.IsDBNull(1) ? "" : reader.GetString(1),
                                    Department = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                    Position = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                    ManagerId = reader.IsDBNull(4) ? null : (int?)reader.GetInt32(4),
                                    StartDate = reader.GetDateTime(5)
                                }
                            );
                        }
                        connection.Close();

                        return employees;
                    }
                    return null;
                }
            }
        }
        public IEnumerable<Employee> Get(int skip, int take)
        {
            if (skip < 0 || take < 1)
                throw new ArgumentOutOfRangeException();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetEmployees", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SqlParameter skipParam = new SqlParameter
                    {
                        ParameterName = "@skip",
                        Value = skip
                    };
                    command.Parameters.Add(skipParam);

                    SqlParameter takeParam = new SqlParameter
                    {
                        ParameterName = "@take",
                        Value = take
                    };
                    command.Parameters.Add(takeParam);

                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();

                    if (reader.HasRows)
                    {
                        List<Employee> employees = new List<Employee>();
                        while (reader.Read())
                        {
                            employees.Add(
                                new Employee()
                                {
                                    Id = reader.GetInt32(0),
                                    Name = reader.IsDBNull(1) ? "" : reader.GetString(1),
                                    Department = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                    Position = reader.IsDBNull(2) ? "" : reader.GetString(3),
                                    ManagerId = reader.IsDBNull(4) ? null : (int?)reader.GetInt32(4),
                                    StartDate = reader.GetDateTime(5)
                                }
                            );
                        }
                        connection.Close();

                        return employees;
                    }
                    return null;
                }
            }
        }
        public IEnumerable<HierarchyResponse> GetHierarchy(Employee employee)
        {
            if (employee == null)
                return null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetHierarchy", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SqlParameter employeeIdParam = new SqlParameter
                    {
                        ParameterName = "@EmployeeId",
                        Value = employee.Id
                    };
                    command.Parameters.Add(employeeIdParam);

                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();

                    if (reader.HasRows)
                    {
                        List<HierarchyResponse> employees = new List<HierarchyResponse>();
                        while (reader.Read())
                        {
                            employees.Add(
                                new HierarchyResponse()
                                {
                                    Id = reader.GetInt32(0),
                                    Name = reader.IsDBNull(1) ? "" : reader.GetString(1),
                                    SubCount = reader.IsDBNull(2) ? null : (int?)reader.GetInt32(2)
                                }
                            );
                        }
                        connection.Close();
                        employees.Reverse();
                        
                        return employees;
                    }
                    return null;
                }
            }
        }
        public Employee GetById(int id)
        {
            if (id <= 0)
                return null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetById", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SqlParameter idParam = new SqlParameter
                    {
                        ParameterName = "@id",
                        Value = id
                    };
                    command.Parameters.Add(idParam);

                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();

                    if (reader.HasRows)
                    {
                        Employee employee = null;
                        if (reader.Read())
                        {
                            employee = new Employee()
                            {
                                Id = reader.GetInt32(0),
                                Name = reader.IsDBNull(1) ? "" : reader.GetString(1),
                                Department = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                Position = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                ManagerId = reader.IsDBNull(4) ? null : (int?)reader.GetInt32(4),
                                StartDate = reader.GetDateTime(5)
                            };
                        }
                        connection.Close();

                        return employee;
                    }
                    return null;
                }
            }
        }
        public void Add(Employee employee)
        {
            if (employee == null)
                throw new ArgumentNullException();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("AddEmployee", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SqlParameter nameParam = new SqlParameter
                    {
                        ParameterName = "@name",
                        Value = employee.Name
                    };
                    command.Parameters.Add(nameParam);

                    SqlParameter departmentParam = new SqlParameter
                    {
                        ParameterName = "@department",
                        Value = employee.Department
                    };
                    command.Parameters.Add(departmentParam);

                    SqlParameter positionParam = new SqlParameter
                    {
                        ParameterName = "@position",
                        Value = employee.Position
                    };
                    command.Parameters.Add(positionParam);

                    SqlParameter managerIdParam = new SqlParameter
                    {
                        ParameterName = "@managerId",
                        Value = (object)employee.ManagerId ?? (object)DBNull.Value
                    };
                    command.Parameters.Add(managerIdParam);

                    SqlParameter startDateParam = new SqlParameter
                    {
                        ParameterName = "@startDate",
                        Value = employee.StartDate
                    };
                    command.Parameters.Add(startDateParam);

                    connection.Open();

                    command.ExecuteNonQuery();

                    connection.Close();

                }
            }
        }

        public void Remove(Employee employee)
        {
            if (employee == null)
                throw new ArgumentNullException();
            if (employee.Id <= 0)
                throw new ArgumentOutOfRangeException();


            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("RemoveById", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    SqlParameter nameParam = new SqlParameter
                    {
                        ParameterName = "@id",
                        Value = employee.Id
                    };
                    command.Parameters.Add(nameParam);

                    connection.Open();

                    command.ExecuteNonQuery();

                    connection.Close();

                }
            }
        }
        public int Count()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("EmployeesCount", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();
                    object result = command.ExecuteScalar();
                    result = (result == DBNull.Value) ? null : result;
                    connection.Close();

                    return Convert.ToInt32(result);
                }
            }
        }
    }
}
