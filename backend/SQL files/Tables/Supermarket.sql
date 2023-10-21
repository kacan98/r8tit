DROP TABLE IF EXISTS R8titSchema.Supermarkets

CREATE TABLE R8titSchema.Supermarkets
(
    SupermarketId INT IDENTITY(1, 1) PRIMARY KEY
    , ImageId INT(50)
    , Name NVARCHAR(50)
    , City NVARCHAR(50)
    , Country NVARCHAR(50)
    , Latitude INT
    , Longitude INT
    , Active BIT
);