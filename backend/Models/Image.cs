namespace R8titAPI.Models
{
    public class Image
    {
        public int ImageId { get; set; }
        public int CreatedByUserId { get; set; }
        public int RelatedObjectId { get; set; }
        public string RelatedObjectTable { get; set; } = ""; // Supermarket, Rating, User, etc.
        public byte[] ImageData { get; set; } = new byte[0];
        public DateTime CreatedDate { get; set; }
    }
}