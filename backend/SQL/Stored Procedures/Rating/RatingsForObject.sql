USE master 
GO

CREATE OR ALTER PROCEDURE R8titSchema.spRating_GetRatings
    @ObjectId INT,
    @TableName VarChar(50)
AS
BEGIN
        SELECT * FROM R8titSchema.Ratings as Ratings
        LEFT JOIN R8titSchema.RatingCategories as Categories
        ON Ratings.RatingCategoryId = Categories.RatingCategoryId
        WHERE Ratings.RelatedObjectId = @ObjectId AND Categories.RelatedObjectTable = @TableName
END