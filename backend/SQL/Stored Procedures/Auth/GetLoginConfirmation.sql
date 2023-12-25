CREATE OR ALTER PROCEDURE R8titSchema.spLoginConfirmation_Get
    @Email NVARCHAR(50)
AS
IF NOT EXISTS (SELECT * FROM R8titSchema.Users WHERE Email = @Email)
BEGIN
    RAISERROR('User does not exist', 16, 1);
    RETURN;
END;
BEGIN
    SELECT [Auth].[PasswordHash],
        [Auth].[PasswordSalt],
        [Users].[UserId]
    FROM R8titSchema.Auth AS Auth
        LEFT JOIN R8titSchema.Users AS Users
                On Users.Email = Auth.Email
        WHERE Auth.Email = @Email
END;