CREATE OR ALTER PROCEDURE R8titSchema.spSupermarkets_Delete
/* EXEC R8titSchema.spSupermarkets_Delete
@SupermarketId = 1 */
    @SupermarketId int
AS
BEGIN
    DELETE FROM R8titSchema.Supermarkets
    WHERE SupermarketId = @SupermarketId
END