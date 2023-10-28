DROP TABLE IF EXISTS R8titSchema.Images

CREATE TABLE R8titSchema.Images
(
    ImageId INT IDENTITY(1, 1) PRIMARY KEY,
    CreatedByUserId INT,
    RelatedObjectId INT,
    RelatedObjectTable NVARCHAR(50),
    ImageData VARBINARY(MAX),
    CreatedDate DATETIME
);