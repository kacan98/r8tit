Write-Host "Building project..."
dotnet build --configuration Release

Write-Host "Deploying to Azure..."
az webapp up --name "R8titAPI1" --os-type linux