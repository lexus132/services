# Telegram docker service for recieve errror messages and push them to telegram

## Starting project
### 1) Create folder src/config
### 2) Create file src/config/config.json
### 3) Simple data in file: 
```
{   
    "telegram_token" : "480076030:AAGEKEl0je-17hkLu1KrBbCCHA1gWTfM92E",
    "telegram_chat_id" : "386849513",
    "secret_key": "EKEl0je-D7hkLu1KrBbCCHA1gWTfM92E221322PooifnvkierHii",
    "servers" : {
      "odnode0.cnwdev.com" : {
        "login" : "login1",
        "psw" : "pswsd1"
      },
      "odnode1.cnwdev.com" : {
        "login" : "login2",
        "psw" : "pswsd2"
      },
      "odnode2.cnwdev.com" : {
        "login" : "login3",
        "psw" : "pswsd3"
      },
      "odnode3.cnwdev.com" : {
        "login" : "login4",
        "psw" : "pswsd4"
      }

    }
}
```
### 4) docker-compose up - Enjoy!!!

## Api routes
### Get JWT token: send POST to http://localhost:8082/auth (x-www-form-urlencoded with data fields: login: login1, psw: pswsd1)
### Send Error Message: send GET to http://localhost:8082/message?message=Simple Error Message (Headers field: Authorization: JWT ${token})

## Errors: 
### 401 Status - unauthorized