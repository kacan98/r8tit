namespace R8titAPI.Controllers;
using System.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using R8titAPI.Models;
using R8titAPI.Data;
using R8titAPI.Dtos;
using Dapper;

[Authorize]
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

    [HttpGet("GetAll")]
    public IEnumerable<Supermarket> GetAll()
    {
        return _dapper.LoadData<Supermarket>(@"SELECT * FROM R8titSchema.Supermarkets");
    }

    [HttpGet("GetAllList")]
    public IEnumerable<ListSupermarketDTO> GetAllList()
    {
        return _dapper.LoadData<ListSupermarketDTO>(@"EXEC R8titSchema.spSupermarkets_GetList");
    }

    [HttpPut("Upsert")]
    public IActionResult Upsert(Supermarket supermarket)
    {
        string sql = @"EXEC R8titSchema.spSupermarkets_Upsert ";

        DynamicParameters sqlParameters = new DynamicParameters();

        sqlParameters.Add("@CreatedByUserIdParam", this.User.FindFirst("userId")?.Value, DbType.Int32);
        sql += "@CreatedByUserId = @CreatedByUserIdParam, ";

        if (supermarket.SupermarketId != 0)
        {
            sqlParameters.Add("@SupermarketIdParam", supermarket.SupermarketId, DbType.Int32);
            sql += "@SupermarketId = @SupermarketIdParam, ";
        }

        if (supermarket.ImageId != 0)
        {
            sqlParameters.Add("@ImageIdParam", supermarket.ImageId, DbType.Int32);
            sql += "@ImageId = @ImageIdParam, ";
        }

        if (supermarket.Name == "" || supermarket.City == "" || supermarket.Country == "" || supermarket.Latitude == 0 || supermarket.Longitude == 0)
        {
            return BadRequest("Name, City, Country, Latitude and Longitude are required");
        }
        sqlParameters.Add("@NameParam", supermarket.Name, DbType.String);
        sql += "@Name = @NameParam, ";

        sqlParameters.Add("@CityParam", supermarket.City, DbType.String);
        sql += "@City = @CityParam, ";

        sqlParameters.Add("@CountryParam", supermarket.Country, DbType.String);
        sql += "@Country = @CountryParam, ";

        sqlParameters.Add("@LatitudeParam", supermarket.Latitude, DbType.Decimal);
        sql += "@Latitude = @LatitudeParam, ";

        sqlParameters.Add("@LongitudeParam", supermarket.Longitude, DbType.Decimal);
        sql += "@Longitude = @LongitudeParam, ";

        if (supermarket.Active != null)
        {
            sqlParameters.Add("@ActiveParam", supermarket.Active, DbType.Boolean);
            sql += "@Active = @ActiveParam, ";
        }

        try
        {
            var supermarketUpserted = _dapper.UpsertSql<Supermarket>(sql.TrimEnd(new char[] { ',', ' ' }), sqlParameters);
            if (supermarketUpserted != null)
            {
                return Ok(new { message = "Supermarket upserted successfully", supermarket = supermarketUpserted });
            }
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        throw new Exception("failed to upsert supermarket!");
    }

    [HttpDelete("{supermarketId}")]
    public IActionResult DeleteSupermarket(int supermarketId)
    {
        string sql = @"EXEC R8titSchema.spSupermarkets_Delete";

        DynamicParameters sqlParameters = new DynamicParameters();
        sqlParameters.Add("@UserId", this.User.FindFirst("userId")?.Value, DbType.Int32);
        sqlParameters.Add("@SupermarketIdParam", supermarketId, DbType.Int32);
        sql += " @SupermarketId = @SupermarketIdParam";

        if (_dapper.ExecuteSql(sql, sqlParameters))
        {
            return Ok();
        }

        throw new Exception("Failed to delete supermarket!");
    }
}