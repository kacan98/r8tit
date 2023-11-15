## How to run the project
1. Install .NET Core 7.1 or higher (https://dotnet.microsoft.com/download)
1. Clone the repository to your local machine
2. Open the project in Visual Studio Code
3. Run the project by writing `dotnet run` in the terminal

## Secrets 
Some secrets are required to run the project.
Add secrets by running the following commands in the terminal:
dotnet user-secrets set "Movies:ServiceApiKey" "12345"

These secrets have to be defined:
- 'AppSettings:PasswordKey'
- 'AppSettings:TokenKey'
- 'ConnectionStrings:DefaultConnection'
- 'positionstackKey' (positionstack.com)