namespace R8titAPI.Models
{
    public partial class RatingCategory
    {
        public int? RatingCategoryId { get; set; }
        public string CategoryName { get; set; } = "";
        public string RelatedObjectTable { get; set; } = ""; // e.g. "Supermarkets"
        public int CreatedByUserId { get; set; }

        // Global = true means it's enabled for everyone; 
        // Global = false means it's only enabled for the specific users who enabled it
        public bool Global { get; set; }
        public DateTime CategoryCreated { get; set; }
        public DateTime? CategoryUpdated { get; set; }
    }
}