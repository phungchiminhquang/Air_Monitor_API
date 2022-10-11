# Air Monitoring
This project serves Quang's Thesis purpose. This api mainly using Nodejs and Express framework. It's connect to a MongoDB cloud database.

## Structure
This project using MVC pattern,
file structure contains 3 main folder:
* Routes folder: works as View in MVC pattern(aka subrouter in Express). Contains declared path link to request.
* Controller folder: works as Controller in MVC pattern. Contains controller for each request.
* Model folder: works as Model in MVC pattern. Contains Model to mapping data when sending or receiving data.

## MongoDB Schema pattern
This project using [Bucket pattern](https://www.mongodb.com/blog/post/paging-with-the-bucket-pattern--part-1?fbclid=IwAR3TENmPsyGvkEsK-uW42bCl8xosebiUXlnNxO907pLZmuuPf0926uJWzPI) introduced by MongoDB to store data collection. There is a slightly different is instead of using composite _id(like in the article), I am using composite object to make unique key for each document.
    
    compositeId:{
        stationId:"1",
        firstRecTime:"2022-10-4 15:00:00",
    }

## Document
This is the [postman document](https://documenter.getpostman.com/view/18364995/2s83zjr3TZ)

## Try yourself At
I have not run this api on any host yet