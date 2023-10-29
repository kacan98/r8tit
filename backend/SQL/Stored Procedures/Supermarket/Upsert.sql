USE master
GO

CREATE OR ALTER PROCEDURE R8titSchema.spSupermarkets_Upsert
-- EXEC R8titSchema.spSupermarkets_Upsert
--     @SupermarketId = 1
--     , @CreatedByUserId = 1
--     , @Name = 'Lidl'
--     , @City = 'Bucharest'
--     , @Country = 'Romania'
--     , @Latitude = 44.4268
--     , @Longitude = 26.1025
--     , @ImageId = 1
--     , @Active = 1
    @SupermarketId INT = NULL
    , @CreatedByUserId INT
    , @Name NVARCHAR(50)
    , @City NVARCHAR(50)
    , @Country NVARCHAR(50)
    , @Latitude DECIMAL(8,6) = null
    , @Longitude DECIMAL(9,6) = null
    , @ImageId INT = null
    , @Active BIT = 1
AS
BEGIN
    IF NOT EXISTS (SELECT * FROM R8titSchema.Supermarkets WHERE SupermarketId = @SupermarketId)
        BEGIN
            INSERT INTO R8titSchema.Supermarkets(
                CreatedByUserId,
                Name,
                City,
                Country,
                Latitude,
                Longitude,
                ImageId,
                DateCreated,
                DateUpdated,
                Active
            ) 
            VALUES (
                @CreatedByUserId,
                @Name,
                @City,
                @Country,
                @Latitude,
                @Longitude,
                @ImageId,
                GETDATE(),
                NULL,
                @Active
            )
            SET @SupermarketId = SCOPE_IDENTITY()
        END
    ELSE
        BEGIN
            UPDATE R8titSchema.Supermarkets
                SET Name = @Name,
                    City = @City,
                    Country = @Country,
                    Latitude = @Latitude,
                    Longitude = @Longitude,
                    ImageId = @ImageId,
                    DateUpdated = GETDATE(),
                    Active = @Active
                WHERE SupermarketId = @SupermarketId
        END
    BEGIN
    SELECT * FROM R8titSchema.Supermarkets WHERE SupermarketId = @SupermarketId
    END
END
