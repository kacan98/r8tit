CREATE OR ALTER PROCEDURE R8titSchema.spSupermarket_Delete
/* EXEC R8titSchema.spSupermarket_Delete
@SupermarketId = 1 */
    @SupermarketId int,
    @UserId int
AS
BEGIN
    DELETE FROM R8titSchema.Supermarket
    -- Only allow the user who created the supermarket to delete it
    -- TODO: Remove all reviews for this supermarket
    WHERE Supermarket.SupermarketId = @SupermarketId AND Supermarket.CreatedByUserId = @UserId
END
