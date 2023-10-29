CREATE OR ALTER PROCEDURE R8titSchema.spSupermarkets_Delete
/* EXEC R8titSchema.spSupermarkets_Delete
@SupermarketId = 1 */
    @SupermarketId int,
    @UserId int
AS
BEGIN
    DELETE FROM R8titSchema.Supermarkets
    -- Only allow the user who created the supermarket to delete it
    -- TODO: Remove all reviews for this supermarket
    WHERE Supermarkets.SupermarketId = @SupermarketId AND Supermarkets.CreatedByUserId = @UserId
END
