using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace R8titAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult TestConnection()
        {
            return Ok("Connection successful!");
        }
    }
}