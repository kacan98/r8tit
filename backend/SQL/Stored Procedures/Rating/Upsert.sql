CREATE OR ALTER PROCEDURE R8titSchema.spRatings_Upsert
-- EXEC R8titSchema.spRatings_Upsert @RatingId = 1, @RatingValue = 1, @RatingCategoryId = 1, @CreatedByUserId = 1, @RelatedObjectId = 5
    @RatingId INT = NULL,
    @RatingValue DECIMAL(18, 2),
    @RatingCategoryId INT,
    @CreatedByUserId INT,
    @RelatedObjectId INT
AS
BEGIN
    IF NOT EXISTS (SELECT * FROM R8titSchema.RatingCategories WHERE RatingCategoryId = @RatingCategoryId)
        BEGIN
            RAISERROR('Category does not exist', 16, 1)
            RETURN
        END
    IF @RatingId IS NOT NULL AND NOT EXISTS (SELECT * FROM R8titSchema.Ratings WHERE RatingId = @RatingId)
        BEGIN
            RAISERROR('The rating you are trying to edit does not exist', 16, 1)
            RETURN
        END
    IF NOT EXISTS (SELECT * FROM R8titSchema.Ratings WHERE RatingId = @RatingId)
        BEGIN
            INSERT INTO R8titSchema.Ratings(
                CreatedByUserId,
                RatingValue,
                RatingCategoryId,
                RatingCreated,
                RelatedObjectId
            ) VALUES (
                @CreatedByUserId,
                @RatingValue,
                @RatingCategoryId,
                GETDATE(),
                @RelatedObjectId
            )
            SET @RatingId = SCOPE_IDENTITY()
        END
    ELSE
        BEGIN
            UPDATE R8titSchema.Ratings 
                SET CreatedByUserId = @CreatedByUserId,
                    RatingValue = @RatingValue,
                    RatingCategoryId = @RatingCategoryId,
                    RatingUpdated = GETDATE()
                WHERE RatingId = @RatingId
        END

    SELECT * FROM R8titSchema.Ratings WHERE RatingId = @RatingId
END