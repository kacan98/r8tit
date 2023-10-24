DROP TABLE IF EXISTS R8titSchema.Users

CREATE TABLE R8titSchema.Users
(
    UserId INT IDENTITY(1, 1) PRIMARY KEY
    , ImageId INT
    , Active BIT
    , Username NVARCHAR(50) NOT NULL
    , Email NVARCHAR(50) NOT NULL,
    , AdminRights BIT
);