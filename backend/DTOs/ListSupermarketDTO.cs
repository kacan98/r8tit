namespace R8titAPI.Dtos
{
    public class ListSupermarketDTO
    {
        public int? ImageId { get; set; }
        public DateTime SupermarketCreatedDate { get; set; }
        public DateTime? SupermarketUpdatedDate { get; set; }
        public int SupermarketId { get; set; }
        public string SupermarketCreatedByUserName { get; set; } = "";
        public string Name { get; set; } = "";
        public string City { get; set; } = "";
        public string Country { get; set; } = "";
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public bool? Active { get; set; }
    }
}