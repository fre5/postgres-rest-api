#Storefront backend REST API

###Initial setup
- Uncompress the package to a folder.
- Make the folder as the current directory `cd folder name`.
- Install all the dependencies with `npm install`. 
- Download Postgres https://www.postgresql.org/download/, install, and let's have the default user as `postgres` and default password as `password12345`.
- Open a terminal and type in `psql -U <username>` to make sure your database is accessible. <username> will be the username you will be using to access the database.
- create a new test user `postgres_test` by typing `CREATE USER postgres_test WITH PASSWORD <password>` using whatever password you like. In this scenario, we are using the same password as our default user.
- This application will be running on port 3000 and the Postgres database will be running on port 5432 which is the default port.
- Open a terminal window and enter `psql -U postgres` and enter the correct password to enter the postgres console that looks like this `postgres=#`
- Type in `CREATE DATABASE store;` to create the store database for this application and `CREATE DATABASE store_test;` to creat the test database. 
- Open `.env` file on the root of the directory. This .env file included is for demo purpose only, you should always include .env file in .gitignore and keep the file secret.\
  
  POSTGRES_HOST=(host address, typically localhost or 127.0.0.1, or a remote IP address if the database is in a different computer)\
  POSTGRES_DB=(the database name, in this case the value will be `store`)\
  POSTGRES_TEST_DB=(the test database name, the value is `store_test`)\
  POSTGRES_USER=(the username, the default value is `postgres`)\
  POSTGRES_TEST_USER=(the test username, `postgres_test`)\
  POSTGRES_PASSWORD=(the password set as `password12345`)\
  ENV=dev (this is the default environment, in the package.json `test` script, this variable is re-assigned to `test`)\
   
  The bottom three environment variables are used by `bcrypt` and `jsonwebtoken` to provide hash, salt, pepper, for authentication purpose, we can leave it as is.\
  BCRYPT_PASSWORD=(a string value)\
  SALT_ROUNDS=10\
  TOKEN_SECRET=(a string value)
- On a separate terminal, go to the application root directory and type in `db-migrate up` to set up all the tables. 
- Run `npm run watch` to start the application.
- To test, use `npm run test` and make sure the database tables are empty 
