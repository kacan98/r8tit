using System.Data;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using R8titAPI.Data;
using R8titAPI.Helpers;
using R8titAPI.Models;

namespace R8titAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RatingController : ControllerBase
    {
        private readonly SqlHelper _sqlHelper;
        private readonly DataContextDapper _dapper;
        public RatingController(IConfiguration config)
        {
            _sqlHelper = new SqlHelper(config);
            _dapper = new DataContextDapper(config);
        }

        [HttpGet("ratingCategories")]
        public IActionResult GetRatingCategories(bool? excludeGlobal = true)
        {
            string sql = @"SELECT * FROM R8titSchema.RatingCategories ";

            if (excludeGlobal == true)
            {
                sql += "WHERE Global != 1 ";
            }

            sql += "ORDER BY CategoryName ASC";

            try
            {
                IEnumerable<RatingCategory> ratingCategories = _dapper.LoadData<RatingCategory>(sql);

                return Ok(ratingCategories);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ratingsForObject")]
        public IActionResult GetRatingsForObject(int objectId, int tableName)
        {
            string sql = @"SELECT * FROM R8titSchema.Ratings
                            WHERE RelatedObjectId = @RelatedObjectIdParam
                            AND RelatedObjectTable = @RelatedObjectTableParam";

            DynamicParameters sqlParameters = new DynamicParameters();
            sqlParameters.Add("@RelatedObjectIdParam", objectId, DbType.Int32);
            sqlParameters.Add("@RelatedObjectTableParam", tableName, DbType.Int32);

            try
            {
                IEnumerable<Rating> ratings = _dapper.LoadData<Rating>(sql, sqlParameters);

                return Ok(ratings);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("addRating")]
        public IActionResult AddRating(Rating rating)
        {
            string sql = @"EXEC R8titSchema.spRating_Rate ";

            DynamicParameters sqlParameters = new DynamicParameters();

            if (rating.RatingId != 0)
            {
                sqlParameters.Add("@RatingIdParam", rating.RatingId, DbType.Int32);
                sql += "@RatingId = @RatingIdParam, ";
            }

            if (rating.RatingCategoryId != 0)
            {
                sqlParameters.Add("@RatingCategoryIdParam", rating.RatingCategoryId, DbType.Int32);
                sql += "@RatingCategoryId = @RatingCategoryIdParam, ";
            }

            sqlParameters.Add("@RatingValueParam", rating.RatingValue, DbType.Int32);
            sql += "@RatingValue = @RatingValueParam, ";

            sqlParameters.Add("@CreatedByUserIdParam", this.User.FindFirst("userId")?.Value, DbType.Int32);
            sql += "@CreatedByUserId = @CreatedByUserIdParam ";

            sqlParameters.Add("@RatingId", rating.RatingId, DbType.Int32, ParameterDirection.Output);

            try
            {
                Rating upsertedRating = _dapper.UpsertSql<Rating>(sql.TrimEnd(new char[] { ',', ' ' }), sqlParameters);

                return Ok(new { Message = "Rating added successfully", Rating = upsertedRating });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("addRatingCategory")]
        public IActionResult AddRatingCategory(RatingCategory ratingCategory)
        {
            string sql = @"EXEC R8titSchema.spRatingCategory_Upsert ";

            DynamicParameters sqlParameters = new DynamicParameters();

            if (ratingCategory.RatingCategoryId != 0)
            {
                sqlParameters.Add("@RatingCategoryIdParam", ratingCategory.RatingCategoryId, DbType.Int32);
                sql += "@RatingCategoryId = @RatingCategoryIdParam, ";
            }

            sqlParameters.Add("@CategoryNameParam", ratingCategory.CategoryName, DbType.String);
            sql += "@CategoryName = @CategoryNameParam, ";

            sqlParameters.Add("@CreatedByUserIdParam", this.User.FindFirst("userId")?.Value, DbType.Int32);
            sql += "@CreatedByUserId = @CreatedByUserIdParam ";

            sqlParameters.Add("@RatingCategoryId", ratingCategory.RatingCategoryId, DbType.Int32, ParameterDirection.Output);

            try
            {
                RatingCategory upsertedRatingCategory = _dapper.UpsertSql<RatingCategory>(sql.TrimEnd(new char[] { ',', ' ' }), sqlParameters);

                return Ok(new { Message = "Rating category added successfully", RatingCategory = upsertedRatingCategory });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}