-- TODO: Rename this to Supermarkets
DROP TABLE IF EXISTS R8titSchema.Supermarkets

CREATE TABLE R8titSchema.Supermarkets
(
    SupermarketId INT IDENTITY(1, 1) PRIMARY KEY
    , ImageId INT
    , CreatedByUserId INT
    , Name NVARCHAR(50)
    , City NVARCHAR(50)
    , Country NVARCHAR(50)
    , Latitude DECIMAL(8,6)
    , Longitude DECIMAL(9,6)
    , DateCreated DATETIME
    , DateUpdated DATETIME
    , Active BIT
);