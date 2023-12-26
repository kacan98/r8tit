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
        private readonly DataContextDapper _dapper;
        private readonly RatingHelper _ratingHelper;
        public RatingController(IConfiguration config)
        {
            _dapper = new DataContextDapper(config);
            _ratingHelper = new RatingHelper(config);
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
            IActionResult? tableValidityResult = ValidityOfTable(tableName);
            if (tableValidityResult != null)
            {
                return tableValidityResult;
            }

            //check if object exists
            IActionResult? objectValidityResult = ValidityOfObject(tableName, objectId);
            if (objectValidityResult != null)
            {
                return objectValidityResult;
            }


            string sql = @"R8titSchema.spRating_GetRatingsForObject @RelatedObjectId, @RelatedObjectTable";

            DynamicParameters sqlParameters = new();
            sqlParameters.Add("@RelatedObjectId", objectId, DbType.Int32);
            sqlParameters.Add("@RelatedObjectTable", tableName, DbType.String);

            try
            {
                IEnumerable<RatingForObjectDTO> ratings = _dapper.LoadData<RatingForObjectDTO>(sql, sqlParameters);

                return Ok(ratings);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("upsertRating")]
        public IActionResult AddRating(RatingForUpsertDTO rating)
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            //validate if rating can be inserted
            ObjectResult validationResult = _ratingHelper.ValidateIfRatingCanBeUpserted(rating, int.Parse(userIdClaim.Value));
            if (validationResult.StatusCode != 200)
            {
                return validationResult;
            }

            int currentUserId = int.Parse(userIdClaim.Value);

            try
            {
                RatingComplete upsertedRating = _ratingHelper.UpsertRating(rating, currentUserId);

                return Ok(new { message = "Rating upserted successfully", rating = upsertedRating });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Failed to upsert rating: " + ex.Message);
            }
        }

        [HttpPost("upsertRatings")]
        public IActionResult UpsertRatings(IEnumerable<RatingForUpsertDTO> ratings)
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int currentUserId = int.Parse(userIdClaim.Value);

            // make sure none of the ratings are invalid
            foreach (RatingForUpsertDTO rating in ratings)
            {
                ObjectResult result = _ratingHelper.ValidateIfRatingCanBeUpserted(rating, currentUserId);
                if (result.StatusCode != 200)
                {
                    return result;
                }
            }

            List<RatingComplete> upsertedRatings = new();
            // All ratings can be upserted
            foreach (RatingForUpsertDTO rating in ratings)
            {
                try
                {
                    RatingComplete upsertedRating = _ratingHelper.UpsertRating(rating, currentUserId);
                    upsertedRatings.Add(upsertedRating);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Failed to upsert rating: " + ex.Message);
                }
            }

            return Ok(new { message = "Ratings upserted successfully", ratings = upsertedRatings });
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

        // Should get all rating categories for a specific object that a user has enabled and all also global rating categories for the object
        //TODO: Currently only returns global rating categories
        [HttpGet("categoriesForTable")]
        public IActionResult GetRatingCategoriesForTable(string tableName)
        {
            // Check if relatedObjectTable exists
            IActionResult? tableValidityResult = ValidityOfTable(tableName);
            if (tableValidityResult != null)
            {
                return tableValidityResult;
            }

            string sql = @"SELECT * FROM R8titSchema.RatingCategories WHERE RelatedObjectTable = @RelatedObjectTable AND Global = 1";

            DynamicParameters sqlParameters = new DynamicParameters();
            sqlParameters.Add("@RelatedObjectTable", tableName, DbType.String);

            try
            {
                IEnumerable<RatingCategory> ratingCategories = _dapper.LoadData<RatingCategory>(sql, sqlParameters);

                return Ok(new { message = "Rating categories retrieved successfully", global = ratingCategories, user = "Not implemented yet" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        IActionResult? ValidityOfObject(string tableName, int objectId)
        {
            //check if object exists
            if (_dapper.DoesObjectExist(tableName, objectId) == false)
            {
                return StatusCode(400, "Invalid objectId");
            }

            return null;
        }

        IActionResult? ValidityOfTable(string tableName)
        {
            // Check if relatedObjectTable exists
            if (_dapper.DoesTableExist(tableName) == false)
            {
                return StatusCode(400, "Invalid relatedObjectTable");
            }

            return null;
        }
    }
}