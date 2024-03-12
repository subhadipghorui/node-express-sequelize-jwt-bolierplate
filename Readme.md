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