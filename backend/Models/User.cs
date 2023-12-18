namespace R8titAPI.Models
{
    public class User
    {
        public int UserId { get; set; }
        public int? ImageId { get; set; }
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public bool Active { get; set; }
        public bool AdminRights { get; set; }
    }
}