using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Linq;
using DynamicFilterAPI.Models;

namespace DynamicFilterAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataController : ControllerBase
    {
        private readonly string connectionString =
            "Server=localhost\\SQLEXPRESS;Database=FilterDB;Trusted_Connection=True;";

        // ✅ Allowed tables
        private readonly List<string> allowedTables = new List<string>
        {
            "Cars",
            "Employee",
            "Ecommerce",
            "Library",
        };

        // ✅ Common method to fetch data
        private List<Dictionary<string, object>> ExecuteQuery(string query)
        {
            var data = new List<Dictionary<string, object>>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(query, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    var row = new Dictionary<string, object>();

                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        row[reader.GetName(i)] = reader.GetValue(i);
                    }

                    data.Add(row);
                }

                reader.Close();
            }

            return data;
        }

        // ✅ GET DATASET
        [HttpGet("{dataset}")]
        public IActionResult GetData(string dataset)
        {
            if (!allowedTables.Contains(dataset))
                return BadRequest("Invalid dataset");

            string query = $"SELECT * FROM {dataset}";
            var data = ExecuteQuery(query);

            return Ok(data);
        }

        // ✅ FILTER (Single Column)
        [HttpGet("filter")]
        public IActionResult GetFilteredData(
            string dataset,
            string column,
            string filterType,
            string? value,
            string? max)
        {
            if (!allowedTables.Contains(dataset))
                return BadRequest("Invalid dataset");

            string query = $"SELECT * FROM {dataset}";
            var data = ExecuteQuery(query);

            // ✅ CONTAINS
            if (filterType == "contains" && !string.IsNullOrEmpty(value))
            {
                string search = value.Trim().ToLower();

                data = data.Where(item =>
                    item.ContainsKey(column) &&
                    item[column]?.ToString()?.ToLower().Contains(search) == true
                ).ToList();
            }

            // ✅ RANGE
            if (filterType == "range")
            {
                double minVal = string.IsNullOrEmpty(value)
                    ? double.MinValue
                    : Convert.ToDouble(value);

                double maxVal = string.IsNullOrEmpty(max)
                    ? double.MaxValue
                    : Convert.ToDouble(max);

                data = data.Where(item =>
                {
                    if (!item.ContainsKey(column)) return true;

                    double num;
                    if (!double.TryParse(item[column]?.ToString(), out num))
                        return true;

                    return num >= minVal && num <= maxVal;
                }).ToList();
            }

            return Ok(data);
        }

        // ✅ SORT
        [HttpGet("sort")]
        public IActionResult GetSortedData(
            string dataset,
            string sortColumn,
            string sortOrder)
        {
            if (!allowedTables.Contains(dataset))
                return BadRequest("Invalid dataset");

            string query = $"SELECT * FROM {dataset}";
            var data = ExecuteQuery(query);

            if (!string.IsNullOrEmpty(sortColumn))
            {
                if (sortOrder == "asc")
                {
                    data = data.OrderBy(item =>
                        item.ContainsKey(sortColumn)
                            ? item[sortColumn]?.ToString()
                            : ""
                    ).ToList();
                }
                else if (sortOrder == "desc")
                {
                    data = data.OrderByDescending(item =>
                        item.ContainsKey(sortColumn)
                            ? item[sortColumn]?.ToString()
                            : ""
                    ).ToList();
                }
            }

            return Ok(data);
        }

        // ✅ MULTI-FILTER (MAIN FEATURE 🔥)
        [HttpPost("multi-filter")]
        public IActionResult GetMultiFilteredData(
            [FromBody] MultiFilterRequest request)
        {
            if (!allowedTables.Contains(request.Dataset))
                return BadRequest("Invalid dataset");

            string query = $"SELECT * FROM {request.Dataset}";
            var data = ExecuteQuery(query);

            // ✅ APPLY MULTI-FILTER
            foreach (var filter in request.Filters)
            {
                var column = filter.Key;
                var values = filter.Value;

                // case-insensitive + trimmed
                values = values.Select(v => v.Trim().ToLower()).ToList();

                data = data.Where(item =>
                    item.ContainsKey(column) &&
                    values.Contains(item[column]?.ToString()?.Trim().ToLower())
                ).ToList();
            }

            return Ok(data);
        }
    }
}