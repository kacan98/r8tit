CREATE OR ALTER PROCEDURE R8titSchema.spSupermarkets_GetList
AS
    BEGIN
        SELECT [Images].[ImageId],
        [Supermarkets].[SupermarketId],
        [Supermarkets].[Name],
        [Supermarkets].[Address],
        [Supermarkets].[City],
        [Supermarkets].[Country],
        [Supermarkets].[Active],
        [Supermarkets].[Longitude],
        [Supermarkets].[Latitude],
        [Supermarkets].[DateCreated] AS SupermarketCreatedDate,
        [Supermarkets].[DateUpdated] AS SupermarketUpdatedDate,
        [Users].[Username] AS SupermarketCreatedByUserName
        FROM R8titSchema.Supermarkets AS Supermarkets
            LEFT JOIN R8titSchema.Users as Users ON Supermarkets.CreatedByUserId = Users.UserId
            LEFT JOIN (
                SELECT MAX(ImageId) as ImageId, RelatedObjectId
                FROM R8titSchema.Images
                WHERE RelatedObjectTable = 'Supermarkets'
                GROUP BY RelatedObjectId
            ) LastImages ON Supermarkets.SupermarketId = LastImages.RelatedObjectId
            LEFT JOIN R8titSchema.Images ON LastImages.ImageId = R8titSchema.Images.ImageId
    END