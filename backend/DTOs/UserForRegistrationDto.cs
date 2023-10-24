namespace R8titAPI.Dtos
{
    public partial class UserForRegistrationDto
    {
        public string Username {get; set;} = "";
        public string Email {get; set;} = "";
        public string Password {get; set;} = "";
        public string PasswordConfirm {get; set;} = "";
    }
}