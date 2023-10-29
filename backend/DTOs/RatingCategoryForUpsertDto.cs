namespace R8titAPI.Dtos
{
    public partial class RatingCategoryForUpsertDto
    {
        //create
        public string CategoryName { get; set; } = "";
        public string RelatedObjectTable { get; set; } = ""; // e.g. "Supermarkets"

        //update
        public int? CreatedByUserId { get; set; }
        public int? RatingCategoryId { get; set; }
    }
}