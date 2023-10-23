namespace R8titAPI.Controllers;
using System.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using R8titAPI.Models;
using R8titAPI.Data;

[ApiController]
[Route("[controller]")]
public class SupermarketController : ControllerBase
{
    private readonly ILogger<SupermarketController> _logger;
    private readonly DataContextDapper _dapper;

    public SupermarketController(IConfiguration config, ILogger<SupermarketController> logger)
    {
        _logger = logger;
        _dapper = new DataContextDapper(config);

    }

    [HttpGet(Name = "GetSupermarket")]
    public IEnumerable<Supermarket> Get()
    {
        return _dapper.LoadData<Supermarket>(@"SELECT * FROM R8titSchema.Supermarkets", null);
    }
}