CREATE OR ALTER PROCEDURE R8titSchema.spRegistration_Upsert
    @Email NVARCHAR(50),
    @PasswordHash VARBINARY(MAX),
    @PasswordSalt VARBINARY(MAX)
AS 
BEGIN
    IF NOT EXISTS (SELECT * FROM R8titSchema.Auth WHERE Email = @Email)
        BEGIN
            INSERT INTO R8titSchema.Auth(
                [Email],
                [PasswordHash],
                [PasswordSalt]
            ) VALUES (
                @Email,
                @PasswordHash,
                @PasswordSalt
            )
        END
    ELSE
        BEGIN
            UPDATE R8titSchema.Auth 
                SET PasswordHash = @PasswordHash,
                    PasswordSalt = @PasswordSalt
                WHERE Email = @Email
        END
END
GO