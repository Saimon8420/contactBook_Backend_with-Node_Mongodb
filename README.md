# Project_Name: Contact Book. Visit # https://amazing-llama-99e7de.netlify.app

## Description:
This project is contact book, where user can add personal contact, can also delete, update and remove existing contacts. For all these operation first user have to login. If he/she is an authorized user, he/she can login into system, else he/she have to create personal account.

### Features:
* Tokenized authentication system. So, after login user doesn't need to login again. It will valid until expired token or user logout from system by his/her own action.
* Highly protected password system. So, doesn't any worries for leaking password.
* Each user will get his/her own saved contact. No ways to get others contact.

#### Technologies & Packages:
This system build with nodejs and used mongoDB as database.
List of packages:
* npm bcrypt
* npm body-parser
* npm cors
* npm dotenv
* npm express
* npm joi
* npm jsonwebtoken
* npm mongodb
* npm mongoose
* npm nodemon