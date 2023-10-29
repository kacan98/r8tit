namespace R8titAPI.Models
{
    public partial class Rating
    {
        public int? RatingId { get; set; }
        public int? CreatedByUserId { get; set; }
        public int RelatedObjectId { get; set; }
        public int RatingValue { get; set; } // 1-5
        public int RatingCategoryId { get; set; }
        public DateTime RatingCreated { get; set; }
        public DateTime? RatingUpdated { get; set; }
    }
}