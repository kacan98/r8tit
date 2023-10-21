namespace R8titAPI.Models
{
    public class Supermarket
    {
        public string SupermarketId { get; set; } = "";
        public string ImageId { get; set; } = "";
        public string Name { get; set; } = "";
        public string City { get; set; } = "";
        public string Country { get; set; } = "";
        public int Latitude { get; set; }
        public int Longitude { get; set; }
        public bool Active { get; set; }
    }
}