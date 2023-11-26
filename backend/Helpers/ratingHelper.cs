using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using R8titAPI.Data;
using R8titAPI.Models;

namespace R8titAPI.Helpers
{
    public class RatingHelper
    {
        private readonly DataContextDapper _dapper;
        public RatingHelper(IConfiguration config)
        {
            _dapper = new DataContextDapper(config);
        }

        public Rating UpsertRating(Rating rating, int currentUserId)
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

            sqlParameters.Add("@CreatedByUserIdParam", currentUserId, DbType.Int32);
            sql += "@CreatedByUserId = @CreatedByUserIdParam, ";

            sqlParameters.Add("@RelatedObjectIdParam", rating.RelatedObjectId, DbType.Int32);
            sql += "@RelatedObjectId = @RelatedObjectIdParam, ";

            return _dapper.UpsertSql<Rating>(sql.TrimEnd(new char[] { ',', ' ' }), sqlParameters);
        }

        public ObjectResult ValidateIfRatingCanBeInsterted(Rating rating, int currentUserId)
        {
            RatingCategory ratingCategory = GetRatingCategoryById(rating.RatingCategoryId);

            // Check if the object exists within relatedObjectTable inside the category
            if (_dapper.DoesObjectExist(ratingCategory.RelatedObjectTable, rating.RelatedObjectId) == false)
            {
                return new ObjectResult(new { message = $"There is no object in the {ratingCategory.RelatedObjectTable} table with id {rating.RelatedObjectId}" })
                {
                    StatusCode = 400
                };
            }

            // Check if this user already posted a rating for this object with this category
            string existingRatingSql = @"SELECT * FROM R8titSchema.Ratings WHERE RelatedObjectId = @RelatedObjectIdParam AND RatingCategoryId = @RatingCategoryIdParam AND CreatedByUserId = @CreatedByUserIdParam";
            DynamicParameters sqlPar = new DynamicParameters();
            sqlPar.Add("@RelatedObjectIdParam", rating.RelatedObjectId, DbType.Int32);
            sqlPar.Add("@RatingCategoryIdParam", rating.RatingCategoryId, DbType.Int32);
            sqlPar.Add("@CreatedByUserIdParam", currentUserId, DbType.Int32);

            Rating? existingRating = _dapper.LoadDataSingleOrDefaultToNull<Rating>(existingRatingSql, sqlPar);

            if (existingRating != null)
            {
                rating.RatingId = existingRating.RatingId;
            }
            return new ObjectResult(new { message = "Rating can be inserted" })
            {
                StatusCode = 200
            };
        }

        public RatingCategory GetRatingCategoryById(int ratingCategoryId)
        {
            string sql = @"SELECT * FROM R8titSchema.RatingCategories WHERE RatingCategoryId = @RatingCategoryIdParameter";

            DynamicParameters sqlParameters = new();

            sqlParameters.Add("@RatingCategoryIdParameter", ratingCategoryId, DbType.Int32);

            return _dapper.LoadDataSingle<RatingCategory>(sql, sqlParameters);
        }
    }
}