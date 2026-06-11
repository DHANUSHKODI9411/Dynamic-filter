namespace DynamicFilterAPI.Models
{
    public class MultiFilterRequest
    {
        public required string Dataset { get; set; }

        public required Dictionary<string, List<string>> Filters { get; set; }
    }
}
