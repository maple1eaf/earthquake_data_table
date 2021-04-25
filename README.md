# INF 551 Project: Earthquake

## 0 How to Start
### 0.0 Download and Installation
0. Download and install Node.js v11.11.0 from [this website](https://nodejs.org/download/release/v11.11.0/).
1. Do the following things:
```bash
# use npm to install create-react-app in global environment
$ npm install -g create-react-app

# use npm to install nodemon
$ npm install -g nodemon

# clone the project to local
$ git clone git@github.com:maple1eaf/inf551project.git

# install frontend packages
$ cd inf551project/frontend
$ npm install

# then install backend packages
$ cd ../backend
$ npm install
```

2. In backend folder, you can use `npm start` to start server.
```bash
# start backend server at port 3001, assume that still in backend dir
$ npm start
# now you can use web browser at url http://localhost:3001/ to check if server starts
```
3. In frontend folder, you can use `npm start` to launch the web page.
```bash
# start frontend at port 3000
$ cd ../frontend
$ npm start
# now you can use web browser at url http://localhost:3000/ to check if you get the web page
```
### 0.1 Folder and File Sturcture
```
inf551project
    ├─backend                   // backend project root dir
    │   ├─data_upload           // data and source code for uploading to firebase
    │   ├─node_modules          // locally installed packages for backend
    │   ├─public                // resources for backend
    │   ├─src                   // backend's core source code
    │   ├─package.json          // configuration
    │   └─package-lock.json     // configuration
    ├─frontend                  // frontend project root dir
    │   ├─node_modules          // locally installed packages for backend
    │   ├─public                // resources for frontend
    │   ├─src                   // frontend's core source code
    |   |   └─css               // css files
    │   ├─package.json          // configuration
    │   └─package-lock.json     // configuration
    ├─resources                 // resources for the whole project
    └─README.md                 // that's me!
```

## 1 Development Progress & Features

### 1.0 upload date file to firebase RDB

- [x] the date should be coverted from csv to json
- [x] convert number with string format to number format
- [x] attribute with null value should be present as null in json format
- [x] use firebase api to upload data with json format

### 1.1 webpage basic structure
- [x] overview about data requests
    - [x] ~~in frontend, request data directly from firebase realtime database~~
    - [x] frontend asks backend to request data by backend's APIs
    - [x] backend receives frotend's requests, and get data from firebase by firebase web SDK, then process the data
    - [x] finally, after processing, backend send back to fronted
- [ ] frontend
    - [x] using React to render the web page and data table
    - [x] put the `<table />` in a `<div />` which has a scroller
    - [ ] `<table />` can change it's width to adjust the web browser's width
        - [ ] when web browser's width is equal or more than 950px, the `<table />`'s width is fixed 950px.
        - [ ] when web browser's width is less than 950px, the `<table />`'s width will be equal to the web browser's width.
    - [x] use `<div />`'s scroller to scan the table
    - [x] when vertically scroll the table, the table head shouldn't move
    - [ ] load more data when scroll to the buttom
    - [ ] beautify the web page
- [ ] backend
    - [x] use package "express" as web framework to build server
    - [x] use package "cors" to solve cross-domain problem
    - [x] api's entrance is at ` http://localhost:3001/api/xxx `, `xxx` represents the api command.
    - [x] api `/getdefaultpage` is used for get the defualt table data. return as an Array by default order.
    - [x] api `/getmaxmin` is to get the maximum and minimum values of an attribute, in which the minimum value might miss because of the null value
    - [x] api `/numsortandfilter` is used to sort and filter a number-column. return with an Array containing items
    - [x] api `/strsortandfilter` is used to sort and filter a string-column. return with an Array containing items

### 1.2 sort and filter
- [x] sorting and filtering modules are in the same dialog box
- [x] when put OK button, execute sorting and filtering at the same time
- [x] putting the clear button or cross sign in the dialog box will reset both sorting and filtering
- [ ] sort
    - [x] sort by number
    - [x] sort by string according to the ascii order
    - [ ] specially processing for date and time?
- [ ] filter
    - [x] for number columns, use a range-slider to represent a number range
    - [x] filter a column by entering a list of words
    - [ ] multi-column filter

### 1.3 visualization

### 1.4 description

## 2 Firebase RDB Structure
- address: https://inf551-4b3c9.firebaseio.com/earthquake
- structure:

![](./resources/markdown/mysql_desc.png)

## 3 Reference
### 3.0 Languages, Packages, and Tools Requirement
- HTML
- CSS
- JavaScript
- jQuery
- React
    - antd
    - axios
- Node.js
    - firebase web SDK
    - express
    - cors
    - nodemon
- Firebase Realtime Datebase

### 3.1 JavaScript
- [Learning JS: Xuefeng Liao](https://www.liaoxuefeng.com/wiki/1022910821149312)

### 3.2 React
Version: v16.10.1

#### 3.2.0 Installation
```shell
$ npm install -g create-react-app
$ create-react-app frontend
$ cd frontend
$ npm start
```

#### 3.2.1 Reference
- [Official tutorial](https://reactjs.org/tutorial/tutorial.html)
- [Learning React: runoob.com](http://www.runoob.com/react/react-tutorial.html)

#### 3.2.2 Package
- [react-infinite-scroller](https://github.com/CassetteRocks/react-infinite-scroller)
- [antd](https://www.npmjs.com/package/antd) (UI frame)
- [axios](https://github.com/axios/axios)

### 3.3 Node.js
Version: v11.11.0

#### 3.3.0 Reference
- [Node.js v11.x Documentation](https://nodejs.org/docs/latest-v11.x/api/)
- [Learning Node.js: Xuefeng Liao](https://www.liaoxuefeng.com/wiki/1022910821149312/1023025235359040)

#### 3.3.1 Package
- [firebase](https://firebase.google.com/docs/reference/js/firebase.database?authuser=0) 7.0.0
- [express](https://www.npmjs.com/package/express)
- [cors](https://www.npmjs.com/package/cors)
- [csvtojson](https://github.com/Keyang/node-csvtojson)
- [nodemon](https://www.npmjs.com/package/nodemon) (global)


### 3.4 Firebase JS SDK Reference
- [Installation](https://firebase.google.com/docs/web/setup?authuser=0#config-nodejs-app)
- [Read and Write Data on the Web](https://firebase.google.com/docs/database/web/read-and-write?authuser=0#basic_write)
- [Work with Lists of Data on the Web](https://firebase.google.com/docs/database/web/lists-of-data?authuser=0)
- [Structure Your Database](https://firebase.google.com/docs/database/web/structure-data?authuser=0)
- [Get Started with Database Rules](https://firebase.google.com/docs/database/security/quickstart?authuser=0#sample-rules)
- [Firebase Authentication](https://firebase.google.com/docs/auth/?authuser=0)

