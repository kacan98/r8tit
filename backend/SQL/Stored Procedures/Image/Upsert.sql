USE master
GO

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
END