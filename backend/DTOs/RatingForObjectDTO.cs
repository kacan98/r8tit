namespace R8titAPI.Dtos
{
    public partial class RatingForObjectDTO
    {
        public string CategoryName { get; set; } = "";
        public bool Global { get; set; }
        public decimal RatingValue { get; set; }
        public int RatingCategoryId { get; set; }
        public int CreatedByUserId { get; set; }
        public int ImageId { get; set; }
        public string Username { get; set; } = "";
    }
}