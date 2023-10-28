USE master
GO

CREATE OR ALTER PROCEDURE R8titSchema.spRatingCategories_Upsert
-- EXEC R8titSchema.spRatingCategories_Upsert @RatingCategoryId = 1, @CategoryName = 'Test', @CreatedByUserId = 1, @RelatedObjectTable = 'Supermarkets'
    @RatingCategoryId INT = NULL,
    @RelatedObjectTable NVARCHAR(50),
    @CategoryName NVARCHAR(50),
    @CreatedByUserId INT
AS
BEGIN
    IF EXISTS (SELECT * FROM R8titSchema.RatingCategories WHERE CategoryName = @CategoryName AND RatingCategoryId <> @RatingCategoryId)
        BEGIN
            THROW 50000, 'Category name already exists', 1;
        END
        --TODO: Ideally all upserts should behave like this 
        -- but I'm too lazy to do it now. I think it should be fine if it's handled in the controllers
    IF @RatingCategoryId IS NOT NULL AND NOT EXISTS (SELECT * FROM R8titSchema.RatingCategories WHERE RatingCategoryId = @RatingCategoryId)
        BEGIN
            THROW 50000, 'The category you are trying to edit does not exist', 1;
        END
    IF NOT EXISTS (SELECT * FROM R8titSchema.RatingCategories WHERE RatingCategoryId = @RatingCategoryId)
        BEGIN
            INSERT INTO R8titSchema.RatingCategories(
                CreatedByUserId,
                CategoryName,
                Global,
                CategoryCreated,
                RelatedObjectTable
            ) VALUES (
                @CreatedByUserId,
                @CategoryName,
                0,
                GETDATE(),
                @RelatedObjectTable
            )
            SET @RatingCategoryId = SCOPE_IDENTITY()
            SELECT * FROM R8titSchema.RatingCategories WHERE RatingCategoryId = @RatingCategoryId
        END
    ELSE
        BEGIN
            UPDATE R8titSchema.RatingCategories 
                SET CreatedByUserId = @CreatedByUserId,
                    CategoryName = @CategoryName,
                    CategoryUpdated = GETDATE()
                WHERE RatingCategoryId = @RatingCategoryId
                SELECT * FROM R8titSchema.RatingCategories WHERE RatingCategoryId = @RatingCategoryId
        END
END