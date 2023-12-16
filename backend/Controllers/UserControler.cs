using Dapper;
using Microsoft.AspNetCore.Mvc;
using R8titAPI.Models;
using R8titAPI.Data;
using Microsoft.AspNetCore.Authorization;

namespace R8titAPI.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly DataContextDapper _dapper;
    public UserController(IConfiguration config)
    {
        _dapper = new DataContextDapper(config);
    }

    [HttpGet("currentUser")]
    public User GetCurrentUser()
    {
        string sql = @"SELECT * FROM R8titSchema.Users WHERE
                         =@UserIdParameter";
        DynamicParameters sqlParameters = new DynamicParameters();
        string? userId = this.User.FindFirst("userId")?.Value;
        sqlParameters.Add("@UserIdParameter", userId);

        User? user = _dapper.LoadData<User>(sql, sqlParameters).FirstOrDefault();
        if (user != null)
        {
            return user;
        }
        throw new Exception("User not found!");
    }
}
