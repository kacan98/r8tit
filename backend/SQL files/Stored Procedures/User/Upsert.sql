CREATE OR ALTER PROCEDURE R8titSchema.spUser_Upsert
    @UserId INT,
    @ImageId INT,
    @Username NVARCHAR(50),
    @Email NVARCHAR(50),
    @Active BIT

    -- EXEC R8titSchema.spUser_Upsert 1, 1, 'test', 'test', 1
AS
BEGIN
    IF NOT EXISTS (SELECT * FROM R8titSchema.Users WHERE UserId = @UserId)
        BEGIN
        IF NOT EXISTS (SELECT * FROM R8titSchema.Users WHERE Email = @Email)
            BEGIN
                DECLARE @OutputUserId INT

                INSERT INTO R8titSchema.Users(
                    ImageId,
                    Username,
                    Email,
                    Active,
                    AdminRights
                ) VALUES (
                    @ImageId,
                    @Username,
                    @Email,
                    @Active,
                    0
                )
            END
        END
    ELSE 
        BEGIN
            UPDATE R8titSchema.Users 
            SET 
                ImageId = @ImageId,
                Username = @Username,
                Email = @Email,
                Active = @Active
            WHERE UserId = @UserId
        END
END
GO