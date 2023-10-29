CREATE OR ALTER PROCEDURE R8titSchema.spLoginConfirmation_Get
    @Email NVARCHAR(50)
AS
BEGIN
    SELECT [Auth].[PasswordHash],
        [Auth].[PasswordSalt],
        [Users].[UserId]
    FROM R8titSchema.Auth AS Auth
        LEFT JOIN R8titSchema.Users AS Users
                On Users.Email = Auth.Email
        WHERE Auth.Email = @Email
END;
GO