namespace R8titAPI.Models
{
    public partial class RatingComplete
    {
        public int? RatingId { get; set; }
        public int? CreatedByUserId { get; set; }
        public int RelatedObjectId { get; set; }
        public decimal RatingValue { get; set; } // 1-5
        public int RatingCategoryId { get; set; }
        public DateTime RatingCreated { get; set; }
        public DateTime? RatingUpdated { get; set; }
    }
}