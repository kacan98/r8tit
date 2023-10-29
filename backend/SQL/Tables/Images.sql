DROP TABLE IF EXISTS R8titSchema.Images

CREATE TABLE R8titSchema.Images
(
    ImageId INT IDENTITY(1, 1) PRIMARY KEY,
    CreatedByUserId INT NOT NULL,
    RelatedObjectId INT NOT NULL,
    RelatedObjectTable NVARCHAR(50) NOT NULL,
    ImageData VARBINARY(MAX) NOT NULL,
    CreatedDate DATETIME NOT NULL
);