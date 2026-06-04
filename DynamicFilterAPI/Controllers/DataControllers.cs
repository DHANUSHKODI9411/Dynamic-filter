using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace DynamicFilterAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // creats base url
    public class DataController : ControllerBase
    {
        private readonly string connectionString =
            "Server=localhost\\SQLEXPRESS;Database=FilterDB;Trusted_Connection=True;";

        // Allowed tables
        private readonly List<string> allowedTables = new List<string>
        {
            "Cars",
            "Employee",
            "Ecommerce",
            "Library"
        };

        // ✅ GET DATASET
        [HttpGet("{dataset}")]
        public IActionResult GetData(string dataset)
        {
            if (!allowedTables.Contains(dataset))
                return BadRequest("Invalid dataset"); // if data not allowed stop 

            var data = new List<Dictionary<string, object>>();

            using (SqlConnection dataflow = new SqlConnection(connectionString))
            {
                dataflow.Open();

                string query = $"SELECT * FROM {dataset}"; // get all data from selected table
                SqlCommand cmd = new SqlCommand(query, dataflow);

                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    var row = new Dictionary<string, object>(); // row object

                    for (int i = 0; i < reader.FieldCount; i++) // looping col
                    {
                        row[reader.GetName(i)] = reader.GetValue(i);
                    }

                    data.Add(row);
                }

                reader.Close();
            }

            return Ok(data);
        }

        //FILTER API WITH DATASET
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

            var data = new List<Dictionary<string, object>>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                string query = $"SELECT * FROM {dataset}";
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

            //  CONTAINS FILTER
            if (filterType == "contains" && !string.IsNullOrEmpty(value))
            {
                data = data.Where(item =>
                    item.ContainsKey(column) &&
                    item[column].ToString().ToLower()
                        .Contains(value.ToLower())
                ).ToList();
            }

            //  RANGE FILTER
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
                    if (!double.TryParse(item[column].ToString(), out num))
                        return true;

                    return num >= minVal && num <= maxVal;
                }).ToList();
            }

            return Ok(data);
        }
    }
}