DROP TABLE IF EXISTS R8titSchema.RatingCategories

CREATE TABLE R8titSchema.RatingCategories(
    RatingCategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CreatedByUserId INT NOT NULL,
    CategoryName NVARCHAR(50) NOT NULL,
    Global BIT NOT NULL,
    CategoryCreated DATETIME NOT NULL,
    CategoryUpdated DATETIME,
    RelatedObjectTable NVARCHAR(50) NOT NULL,
)

-- add one overall feel category
INSERT INTO R8titSchema.RatingCategories(CreatedByUserId, CategoryName, Global, CategoryCreated, RelatedObjectTable)
VALUES(1, 'Overall Feel', 1, GETDATE(), 'Supermarkets')