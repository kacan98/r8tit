USE master 
GO

CREATE OR ALTER PROCEDURE R8titSchema.spRatings_Upsert
-- EXEC R8titSchema.spRatings_Upsert @RatingId = 1, @RatingValue = 1, @RatingCategoryId = 1, @CreatedByUserId = 1
    @RatingId INT = NULL,
    @RatingValue INT,
    @RatingCategoryId INT,
    @CreatedByUserId INT
AS
BEGIN
    IF NOT EXISTS (SELECT * FROM R8titSchema.RatingCategories WHERE RatingCategoryId = @RatingCategoryId)
        BEGIN
            RAISERROR('Category does not exist', 16, 1)
            RETURN
        END
    IF NOT EXISTS (SELECT * FROM R8titSchema.Ratings WHERE RatingId = @RatingId)
        BEGIN
            INSERT INTO R8titSchema.Ratings(
                CreatedByUserId,
                RatingValue,
                RatingCategoryId,
                RatingCreated
            ) VALUES (
                @CreatedByUserId,
                @RatingValue,
                @RatingCategoryId,
                GETDATE()
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