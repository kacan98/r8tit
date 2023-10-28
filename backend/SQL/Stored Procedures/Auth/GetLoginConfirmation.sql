CREATE OR ALTER PROCEDURE R8titSchema.spLoginConfirmation_Get
    @Email NVARCHAR(50)
AS
BEGIN
    SELECT [Auth].[PasswordHash],
        [Auth].[PasswordSalt] 
    FROM R8titSchema.Auth AS Auth 
        WHERE Auth.Email = @Email
END;
GO