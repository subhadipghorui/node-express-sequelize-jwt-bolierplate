### Steps

npm install -g express-generator

express myapp --view=hogan --port=8080

npm install dotenv

PORT=8080


npm install --save-dev nodemon

"scripts": {
  "start": "nodemon your-app-file.js"
}

npm install express sequelize sequelize-cli pg pg-hstore
npx sequelize-cli init


sequelize model:generate --name Customer --attributes name:string,email:string
sequelize db:migrate

sequelize-cli db:migrate:undo



## JWT
terminal - node
require('crypto').randomBytes(64).toString('hex')

add to .env

ACCESS_TOKEN_SECRATE=145f34e051bbca15f52dc69f71fd5c4170d727abf3ec5dd390f137a7d3f88419e253afdf44aab69907383829e22ae4ec77c43545d6363f959a697d14efa66299
REFRESH_TOKEN_SECRATE=145f34e051bbca15f52dc69f71fd5c4170d727abf3ec5dd390f137a7d3f88419e253afdf44aab69907383829e22ae4ec77c43545d6363f959a697d14efa66299




password hash = $2b$10$AxqtxkXgmefDCmMN52CwK.GcXueHadshPZ./KmsraS/fmmbpWlmDK