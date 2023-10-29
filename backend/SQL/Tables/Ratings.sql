DROP TABLE IF EXISTS R8titSchema.Ratings

CREATE TABLE R8titSchema.Ratings(
    RatingId INT IDENTITY(1,1) PRIMARY KEY,
    CreatedByUserId INT NOT NULL,
    RatingValue INT NOT NULL,
    RatingCategoryId INT NOT NULL,
    RatingCreated DATETIME NOT NULL,
    RatingUpdated DATETIME,
    RelatedObjectId INT NOT NULL,
)