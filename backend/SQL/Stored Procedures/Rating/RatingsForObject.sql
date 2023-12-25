CREATE OR ALTER PROCEDURE R8titSchema.spRating_GetRatingsForObject
-- EXEC R8titSchema.spRating_GetRatingsForObject 1, 'Supermarkets'
    @ObjectId INT,
    @TableName VarChar(50)
AS
BEGIN
        SELECT 
[Categories].[CategoryName]
,[Categories].[Global]
,[Ratings].[RatingValue]
,[Ratings].[RatingCategoryId]
,[Users].[UserId] as CreatedByUserId
,[Users].[ImageId]
,[Users].[Username]
  FROM [R8titSchema].[Ratings] as Ratings
    LEFT JOIN [R8titSchema].[RatingCategories] as Categories
        ON Ratings.RatingCategoryId = Categories.RatingCategoryId
    LEFT JOIN [R8titSchema].[Users] as Users
        ON Ratings.CreatedByUserId = Users.UserId
        WHERE Ratings.RelatedObjectId = @ObjectId AND Categories.RelatedObjectTable = @TableName
END