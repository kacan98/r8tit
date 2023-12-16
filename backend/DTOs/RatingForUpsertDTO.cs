namespace R8titAPI.Dtos
{
    public partial class RatingForUpsertDTO
    {
        public int? RatingId { get; set; } // Should be sent with null from frontend. If exists in database, it is should be found and added before upsert
        public int RelatedObjectId { get; set; }
        public decimal RatingValue { get; set; } // 1.0-5.0, not inforced though (yet?)
        public int RatingCategoryId { get; set; }
    }
}