CREATE OR ALTER PROCEDURE R8titSchema.spImages_Upsert
-- EXEC R8titSchema.spImages_Upsert
    @ImageId INT = NULL,
    @UserMakingRequest INT,
    @RelatedObjectId INT,
    @RelatedObjectTable NVARCHAR(50),
    @ImageData VARBINARY(MAX)
AS
BEGIN
    IF NOT EXISTS (SELECT * FROM R8titSchema.Images WHERE ImageId = @ImageId)
        BEGIN
            INSERT INTO R8titSchema.Images(
                CreatedByUserId,
                RelatedObjectId,
                RelatedObjectTable,
                ImageData,
                CreatedDate
            ) VALUES (
                @UserMakingRequest,
                @RelatedObjectId,
                @RelatedObjectTable,
                @ImageData,
                GETDATE()
            )
            SET @ImageId = SCOPE_IDENTITY()
        END
    ELSE
        BEGIN
            UPDATE R8titSchema.Images 
                SET CreatedByUserId = @UserMakingRequest,
                    RelatedObjectId = @RelatedObjectId,
                    RelatedObjectTable = @RelatedObjectTable,
                    ImageData = @ImageData
                WHERE ImageId = @ImageId
        END
        -- update the reference to the image in the related object
        IF @RelatedObjectTable = 'Supermarkets'
            BEGIN
                UPDATE R8titSchema.Supermarkets
                    SET Supermarkets.ImageId = @ImageId
                    WHERE SupermarketId = @RelatedObjectId
            END
        ELSE IF @RelatedObjectTable = 'Users'
            BEGIN
                UPDATE R8titSchema.Users
                    SET Users.ImageId = @ImageId
                    WHERE UserId = @RelatedObjectId
            END
    SELECT * FROM R8titSchema.Images WHERE Images.ImageId = @ImageId
END