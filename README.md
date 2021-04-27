# CMS Blog

- It helps to create authenticate blog posts, and users can also comments the specific posts.

## GET STARTED

**Default Login credentials**
username - `admin`
password - `admin`

**One Time Only in Linux OS**

- Install mongodb
```shell
sudo apt install mongodb-org
```

- Please Make sure whether your mongodb server running or not. before start the app
```
sudo systemctl start mongod
```

*Alternative*

- If you have docker machine, run below command to start a mongodb server
```shell
docker-compose up -d
```

**Node Engine**
- node - v14.5.3
- npm - 6.14.9

## Install Dependencies

- If you have nvm package, just use below command
```shell
nvm use
```

```shell
npm install && npm run client:install
```

## Development

```shell
cp -rf .env-example .env
```

**After that you have to replace your environment variable in `.env` file.**

- `.env` file look like this,

```env
ADMIN_USERNAME=<your admin name> // default "admin"
ADMIN_PASSWORD=<your admin password> // default "admin"
MONGODB_URI=<your mongodb uri> // default "mongodb://localhost/cms-blog"
COOKIE_SECRET_KEY=<your cookie secret key> // default "mycookiesecret"
SESSION_SECRET_KEY=<your cookie secret key> // default "mysessionsecret"
JWT_SECRET_KEY=<your jwt secret key> // default "myjwtsecret"
FACEBOOK_CLIENT_ID=<Your facebook client id>(Optional)
FACEBOOK_CLIENT_SECRET=<Your facebook client secret key>(Optional)
GOOGLE_CLIENT_ID=<Your google client id>(Optional)
GOOGLE_CLIENT_SECRET=<Your google client secret key>(Optional)
```

- If you start a both backend and frontend simultaneously, use below command
```shell
npm run dev
```

- For server(Run only in backend)
```shell
npm run server
```

- For client(Run only in frontend)
```shell
npm run client
```

## Production

- Start a production server
```shell
npm run prod
```
