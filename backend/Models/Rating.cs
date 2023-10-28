namespace R8titAPI.Models
{
    public partial class Rating
    {
        public int RatingId { get; set; }
        public int UserId { get; set; }
        public int OverallRating { get; set; }
        public int QualityRating { get; set; }
        public int ValueForPriceRating { get; set; }
        public DateTime RatingCreated { get; set; }
        public DateTime RatingUpdated { get; set; }
    }
}