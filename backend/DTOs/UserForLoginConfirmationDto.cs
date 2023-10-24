namespace R8titAPI.Dtos
{
    public partial class UserForLoginConfirmationDto
    {
        public int UserId {get; set;}
        public byte[] PasswordHash {get; set;} = new byte[0];
        public byte[] PasswordSalt {get; set;} = new byte[0];
    }
}