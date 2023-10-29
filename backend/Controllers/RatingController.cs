using System.Data;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using R8titAPI.Data;
using R8titAPI.Dtos;
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
        public IActionResult GetRatingsForObject(int objectId, string tableName)
        {

            // Check if relatedObjectTable exists
            if (_dapper.DoesTableExist(tableName.ToString()) == false)
            {
                return new ObjectResult(new { message = "Invalid relatedObjectTable" })
                {
                    StatusCode = 400
                };
            }

            string sql = @"R8titSchema.spRating_GetRatings @RelatedObjectId, @RelatedObjectTable";

            DynamicParameters sqlParameters = new DynamicParameters();
            sqlParameters.Add("@RelatedObjectId", objectId, DbType.Int32);
            sqlParameters.Add("@RelatedObjectTable", tableName, DbType.String);

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

        [HttpPost("rating")]
        public IActionResult AddRating(Rating rating)
        {
            string sql = @"EXEC R8titSchema.spRatings_Upsert ";

            DynamicParameters sqlParameters = new();

            if (rating.RatingId != null)
            {
                sqlParameters.Add("@RatingIdParam", rating.RatingId, DbType.Int32);
                sql += "@RatingId = @RatingIdParam, ";
            }

            sqlParameters.Add("@RatingCategoryIdParam", rating.RatingCategoryId, DbType.Int32);
            sql += "@RatingCategoryId = @RatingCategoryIdParam, ";

            sqlParameters.Add("@RatingValueParam", rating.RatingValue, DbType.Int32);
            sql += "@RatingValue = @RatingValueParam, ";

            sqlParameters.Add("@CreatedByUserIdParam", this.User.FindFirst("userId")?.Value, DbType.Int32);
            sql += "@CreatedByUserId = @CreatedByUserIdParam, ";

            sqlParameters.Add("@RelatedObjectIdParam", rating.RelatedObjectId, DbType.Int32);
            sql += "@RelatedObjectId = @RelatedObjectIdParam, ";

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

        [HttpPost("ratingCategory")]
        public IActionResult PostRatingCategory(RatingCategoryForUpsertDto ratingCategory)
        {
            string sql = @"EXEC R8titSchema.spRatingCategories_Upsert ";

            DynamicParameters sqlParameters = new DynamicParameters();

            if (ratingCategory.RatingCategoryId != null)
            {
                sqlParameters.Add("@RatingCategoryIdParam", ratingCategory.RatingCategoryId, DbType.Int32);
                sql += "@RatingCategoryId = @RatingCategoryIdParam, ";
            }

            sqlParameters.Add("@CategoryNameParam", ratingCategory.CategoryName, DbType.String);
            sql += "@CategoryName = @CategoryNameParam, ";

            sqlParameters.Add("@CreatedByUserIdParam", this.User.FindFirst("userId")?.Value, DbType.Int32);
            sql += "@CreatedByUserId = @CreatedByUserIdParam, ";

            sqlParameters.Add("@RelatedObjectTableParam", ratingCategory.RelatedObjectTable, DbType.String);
            sql += "@RelatedObjectTable = @RelatedObjectTableParam, ";

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