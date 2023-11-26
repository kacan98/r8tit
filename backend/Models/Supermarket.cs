namespace R8titAPI.Models
{
    public class Supermarket
    {
        public int? SupermarketId { get; set; }
        public int? ImageId { get; set; }
        public int? CreatedByUserId { get; set; }
        public string Name { get; set; } = "";
        public string? Address { get; set; }
        public string City { get; set; } = "";
        public string Country { get; set; } = "";
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public bool? Active { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}