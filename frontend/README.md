### To deploy the frontend app

1) run npm run build:prod
2) then log into Azure cli
3) run the following command from the ./www folder:
az webapp up --name R8tit --html

(I don't see a way as of now to add this to the package.json file as a script. I was a bit sleepy and tired when writing this, so might be worth investigating - there is probably a way)
