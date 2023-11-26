DROP TABLE IF EXISTS R8titSchema.Supermarkets

CREATE TABLE R8titSchema.Supermarkets
(
    SupermarketId INT IDENTITY(1, 1) PRIMARY KEY
    , ImageId INT
    , CreatedByUserId INT NOT NULL
    , Name NVARCHAR(50) NOT NULL
    , City NVARCHAR(50) NOT NULL
    , Country NVARCHAR(50) NOT NULL
    , Latitude DECIMAL(8,6) 
    , Longitude DECIMAL(9,6)
    , Address NVARCHAR(100)
    , DateCreated DATETIME NOT NULL
    , DateUpdated DATETIME
    , Active BIT NOT NULL
);