'use strict';
const express = require('express');
const app = express();
const router = express.Router('./routes');
const http = require('http');
const mysql = require('mysql');
const Array = require('node-array');
const fs = require('fs');
const qs = require("querystring");
const createError = require('http-errors')

router.post('/api', async function(req, res, next) {
   await chooseAPI(req.url).then(jsonString => {
        res.send(jsonString)
   }).catch((res) => {
        next(createError(500,res))
   })
   
   res.end();
});

router.get('/api', async function(req, res) {
    let jsonString = await chooseAPI(req.url)
    res.send(jsonString)
    res.end();
});


module.exports = router;

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function chooseAPI(url){
    let querystring = url.split("?")[1];
    let queryObj = {};
    let jsonResult
    let sql

    return new Promise((resolve, reject) => {
        if(querystring){
            let arr = querystring.split("&");
            for(let i = 0; i <arr.length; i++){
                let arr2 = arr[i].split("=");
                queryObj[arr2[0]] = arr2[1];
            }
        }
        
        let action = queryObj.action
        
        switch (queryObj.table){ //在此決定action
            case 'teacher':
               if(action == "view"){
                sql = "SELECT * FROM teacher;"
                jsonResult = MySQLSelect(sql, "teacherView")
                resolve(jsonResult) 
               }
               else if(action == "add"){
                let confirmSQL = "select * from teacher where name = '" + queryObj.name + "'"

                MySQLSelect(confirmSQL, "dataConfirm").then( result => {
                    let arr = JSON.parse(result)
                    if (arr.length > 0){
                        return Promise.reject('you cant enter the same name , please try another..');
                    }
                }).then(result => {
                    sql = "insert into teacher  values ('" + _uuid() + "', '" + queryObj.name + "', NOW(), NOW())"
                    jsonResult = MySQLModify(sql, "insert")
                    resolve(jsonResult)
                }).catch(res => {
                    reject(res)
                })
                
               }
               else if(action == "delete"){
                sql = "delete from teacher where TID = '" + queryObj.TID + "'"
                jsonResult = MySQLModify(sql, "delete")
                resolve(jsonResult) 
               }
               else if(action == "update"){
                let confirmSQL = "select * from teacher where name = '" + queryObj.name + "'"
                MySQLSelect(confirmSQL, "dataConfirm").then( result => {
                    let arr = JSON.parse(result)
                    if (arr.length > 1){
                        return Promise.reject('you cant enter the same name , please try another..');
                    }
                }).then(result => {
                    sql = "update teacher set name = '" + queryObj.name + "' , modifyDate = NOW()  where TID ='" + queryObj.TID + "' "
                    jsonResult = MySQLModify(sql, "update")
                    resolve(jsonResult) 
                }).catch(res => {
                    reject(res)
                })
               } 
                break;
            case 'userdata':
                if(action == "view"){
                    sql = "SELECT * FROM userdata;"
                    jsonResult = MySQLSelect(sql, "userdataView")
                    resolve(jsonResult) 
                   }
                   else if(action == "add"){
                    let confirmSQL = "select * from userdata where username = '" + queryObj.username + "' and phonenumber ='" + queryObj.phonenumber + "'" 
    
                    MySQLSelect(confirmSQL, "dataConfirm").then( result => {
                        let arr = JSON.parse(result)
                        if (arr.length > 0){
                            return Promise.reject('you cant enter the same name with same number , please try another..');
                        }
                    }).then(result => {
                        sql = "insert into userdata  values ('" + _uuid() + "', '" + queryObj.username + "','"+ queryObj.phonenumber +"', '"+ queryObj.sex +"' , NOW(), NOW())"
                        jsonResult = MySQLModify(sql, "insert")
                        resolve(jsonResult)
                    }).catch(res => {
                        reject(res)
                    })
                    
                   }
                   else if(action == "delete"){
                    sql = "delete from userdata where Userdata = '" + queryObj.Userdata + "'"
                    jsonResult = MySQLModify(sql, "delete")
                    resolve(jsonResult) 
                   }
                   else if(action == "update"){
                    let confirmSQL = "select * from userdata where username = '" + queryObj.username + "' and phonenumber ='" + queryObj.phonenumber + "'" 
                    MySQLSelect(confirmSQL, "dataConfirm").then( result => {
                        let arr = JSON.parse(result)
                        if (arr.length > 1){
                            return Promise.reject('you cant enter the same name with same number , please try another..');
                        }
                    }).then(result => {
                        sql = "update userdata set username = '" + queryObj.username + "', phonenumber ='"+ queryObj.phonenumber +"', sex ='"+ queryObj.sex +"' , modifyDate = NOW()  where Userdata ='" + queryObj.Userdata + "' "
                        jsonResult = MySQLModify(sql, "update")
                        resolve(jsonResult) 
                    }).catch(res => {
                        reject(res)
                    })
                   } 
                break;
            case "location":
                if(action == "view"){
                    sql = "SELECT * FROM location;"
                    jsonResult = MySQLSelect(sql, "locationView")
                    resolve(jsonResult) 
                   }
                   else if(action == "add"){
                    let confirmSQL = "select * from location where title = '" + queryObj.title + "'"
    
                    MySQLSelect(confirmSQL, "dataConfirm").then( result => {
                        let arr = JSON.parse(result)
                        if (arr.length > 0){
                            return Promise.reject('you cant enter the same title , please try another..');
                        }
                    }).then(result => {
                        sql = "insert into location  values ('" + _uuid() + "', '" + queryObj.title + "', NOW(), NOW())"
                        jsonResult = MySQLModify(sql, "insert")
                        resolve(jsonResult)
                    }).catch(res => {
                        reject(res)
                    })
                    
                   }
                   else if(action == "delete"){
                    sql = "delete from location where LSID = '" + queryObj.LSID + "'"
                    jsonResult = MySQLModify(sql, "delete")
                    resolve(jsonResult) 
                   }
                   else if(action == "update"){
                    let confirmSQL = "select * from location where title = '" + queryObj.title + "'"
                    MySQLSelect(confirmSQL, "dataConfirm").then( result => {
                        let arr = JSON.parse(result)
                        if (arr.length > 1){
                            return Promise.reject('you cant enter the same title , please try another..');
                        }
                    }).then(result => {
                        sql = "update location set title = '" + queryObj.title + "' , modifyDate = NOW()  where LSID ='" + queryObj.LSID + "' "
                        jsonResult = MySQLModify(sql, "update")
                        resolve(jsonResult) 
                    }).catch(res => {
                        reject(res)
                    })
                   } 
                break;
            case "course":
                if(action == "view"){
                    sql = "select a.CCID, d.title location, c.name teacher, a.title, b.CCDID , b.CourseDate ,a.createdDate, a.modifyDate from course a"
                    sql += " left join coursedate b on a.CCID = b.CCID"
                    sql += " left join teacher c on a.TID =c.TID"
                    sql += " left join location d on a.LSID = d.LSID"
                    jsonResult = MySQLSelect(sql, "courseView")
                    resolve(jsonResult) 
                   }
                   else if(action == "add"){
                    let confirmSQL = "select * from course where title = '" + queryObj.title + "'"
    
                    MySQLSelect(confirmSQL, "dataConfirm").then( result => {
                        let arr = JSON.parse(result)
                        if (arr.length > 0){
                            return Promise.reject('same title has been created , please try another..');
                        }
                    }).then(result => {
                        let CCID = _uuid()
                        sql = "insert into course values ('" + CCID + "', '" + queryObj.LSID + "','"+ queryObj.TID +"', '"+ queryObj.title + "', NOW(), NOW());"
                        sql +=" "
                        sql +="insert into coursedate  values ('" + _uuid() + "', '" + CCID + "','" + queryObj.CourseDate  +"',  NOW(), NOW());"
                        jsonResult = MySQLModify(sql, "insert")
                        resolve(jsonResult)
                    }).catch(res => {
                        reject(res)
                    })
                    
                   }
                   else if(action == "delete"){
                    sql = "delete from course where CCID = '" + queryObj.CCID + "';"
                    sql +=" "
                    sql += "delete from coursedate where CCDID = '" + queryObj.CCDID + "';"
                    jsonResult = MySQLModify(sql, "delete")
                    resolve(jsonResult) 
                   }
                   else if(action == "update"){
                    let confirmSQL = "select * from course where title = '" + queryObj.title + "'"
    
                    MySQLSelect(confirmSQL, "dataConfirm").then( result => {
                        let arr = JSON.parse(result)
                        if (arr.length > 1){
                            return Promise.reject('same title has been created , please try another..');
                        }
                    }).then(result => {
                        sql = "update course set title = '" + queryObj.title + "', LSID = '" + queryObj.LSID + "', TID = '" + queryObj.TID  + "', modifyDate= NOW() where CCID = '" + queryObj.CCID + "' ;"
                        sql += " "
                        sql += "update coursedate set coursedate = '" + queryObj.CourseDate + "', modifyDate= NOW() where CCID = '" + queryObj.CCID + "'"
                        jsonResult = MySQLModify(sql, "update")
                        resolve(jsonResult)
                    }).catch(res => {
                        reject(res)
                    })

                   } 
                break;
            case "courseEnter":
                if(action == "userSelect"){
                    sql = "select Userdata, username from userdata ;"
                    jsonResult = MySQLSelect(sql, "dataConfirm")
                    resolve(jsonResult)
                }
                else if (action == "joinclass"){
                    let CCEID = _uuid()
                    sql = "insert into courseenter values ('" + CCEID + "', '" + queryObj.CCID + "','"+ queryObj.UPID +"', 'Y', NOW(), NOW());"
                    jsonResult = MySQLModify(sql, "insert")
                    resolve(jsonResult)
                }
                else if (action == "courseEnterandNum"){
                    sql = "select a.CCID, d.title location, c.name teacher, a.title, b.CourseDate , count(CCEID) PeopleNum from course a"
                    sql += " left join coursedate b on a.CCID = b.CCID"
                    sql += " left join teacher c on a.TID =c.TID"
                    sql += " left join location d on a.LSID = d.LSID"
                    sql += " left join courseenter e on a.CCID = e.CCID"
                    sql += " group by a.CCID, d.title, c.name , a.title, b.CourseDate"
                    jsonResult = MySQLSelect(sql, "courseView")
                    resolve(jsonResult)
                }
                else if (action == "studentStatus"){
                    sql = "select CCEID, username, phonenumber, sex from  courseenter  a "
                    sql += " left join userdata b on a.UPID = b.Userdata"
                    sql += " where a.ccid = '" + queryObj.CCID  + "'"
                    jsonResult = MySQLSelect(sql, "dataConfirm")
                    resolve(jsonResult)
                }
                else if (action == "exitclass"){
                    sql = "delete from courseenter where CCEID = '" + queryObj.CCEID + "';"
                    jsonResult = MySQLModify(sql, "delete")
                    resolve(jsonResult)
                }
                break;
            default:
                console.log('Invalid Type');
        }
    
        //console.log("----------------chooseAPI--------------")
      });
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------


//---------------------------------mySQL -----------------------------------------------------------------------------------------------------------------------------------
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123456',
    database: 'testDB',
    port: '3306',
    multipleStatements: true 
});

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
    
});

function MySQLModify(SQL, Type) {
    let ObjList;
    let randomNum = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let randomNum2 = Math.floor(Math.random() * 1000);
    let message = "Success"
    return new Promise((resolve, reject) => {
        switch (Type) {
            case 'getCourseInformationV2':
                ObjList = [values.map(value => [value.CCDID, value.CCID, value.LSID, value.date, value.startTime,
                value.endTime, value.CheckinBeforeClassStart, value.CheckinAfterClassStart, value.name, value.teacher,
                value.teacherPic, value.count, value.modify_Date, value.modifier])]
                break;
            case 'insert':
                break;
            case 'delete':
                break;
            case 'update':
                break;
            default:
                console.log('Invalid Type');
            case '':
    
                break;
        }

        console.time(randomNum + "(" + randomNum2 + ")" + Type);

        /*
                if (!ObjList) {
            message = 'Undefined Obj';
        } else {
        //console.log(ObjList)//,----------------------------------------------------------------------
        }
        */ 

        connection.query(SQL, ObjList, function (err, rows) {
            if (err) {
                message = 'error: ' + err.message ;
            }
        });

        console.timeEnd(randomNum + "(" + randomNum2 + ")" + Type);
        resolve(message)  
      });
}


function MySQLSelect(SQL_, Type) {
    let resObj = [];
    let resJSON = [];
    let now = new Date(+new Date() + 8 * 3600 * 1000);
    let randomNum = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let randomNum2 = Math.floor(Math.random() * 1000);

    return new Promise((resolve, reject) => {
        connection.query(SQL_, function (err, rows) {
            if (err) {
                return console.error('error: ' + err.message);
            }
           // console.log('--------------------------SELECT----------------------------');
           // console.log(SQL_);
          //  console.log('------------------------------------------------------------\n\n');
            resJSON = JSON.stringify(rows)//看似物件卻無法直接賦值 因此走一次轉換流程
            console.time(randomNum + "(" + randomNum2 + ")" + Type);
            switch (Type) {
                case 'teacherView':
                    break;
                case 'userdataView':
                    break;
                case 'locationView':
                    break;
                case 'courseView':
                    break;
                case 'TEST':
                    resObj = JSON.parse(resJSON)
                    if(resObj){
                        resObj.forEach(function (element, index, arr) {
                            let value = {
                                Userdata: element.Userdata,
                                username: element.username,
                                phonenumber: element.phonenumber,
                                sex: element.sex,
                                createdDate: element.createdDate,
                                modifyDate: element.modifyDate
                            }
                           console.log(value.Userdata)
                        })
                    }
                    else
                        console.log('NO DATA');
    
                    console.timeEnd(randomNum + "(" + randomNum2 + ")" + Type);
                    break;
                //根據查詢需要新增
                case 'dataConfirm':
                    break;
                default:
                    console.log('Invalid Type');
            }
            resolve(resJSON)  
        });
      });
}


//////////////////////

function _uuid() { 
    let d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function Dictionary() {
    let items = {};
    const clone=[];
    this.set = function (key, value) { items[key] = value; };
    this.has = function (key) { return key in items; };
    this.get = function (key) { return this.has(key) ? items[key] : ''; };
    this.clear = function () { items = {}; };
    this.delete = function (key) { return this.has(key) ? items[key] = '' : 'Empty'; };
    this.values = function () {
        let values = [];
        for (let k in items) {
            if (this.has(k)) {
                values.push(items[k]);
            }
        }
        return values;
    };
    this.copy = function () { }
}