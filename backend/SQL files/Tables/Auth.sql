DROP TABLE IF EXISTS R8titSchema.Auth

CREATE TABLE R8titSchema.Auth (
Email NVARCHAR (50)
, PasswordHash VARBINARY (MAX)
, PasswordSalt VARBINARY (MAX)
)


