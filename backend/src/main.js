const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
var mysql  = require('mysql');

// var fs = require("fs");

const ONE_PAGE_LIMIT = 50;
const API_PORT = 3001;
const DEFAULT_VALUE = "set_to_default";
const app = express();
app.use(cors());
app.use(bodyParser.json());
const router = express.Router();

let db = null;
let handleError = () => {
    // set mysql server configuration
    db = mysql.createConnection({
        // host     : '3.19.75.152', 
        host     : 'localhost',      
        user     : 'project',              
        password : 'nUXqNrmwHe6Anb2w2vm7',       
        port     : '3306',                   
        database : 'inf551'
    });

    // initialzize mysql server connection
    // connection error，retry in 2 seconds
    db.connect((err) => {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 2000);
        }
    });

    db.on('error', (err) => {
        console.log('db error', err);
        // if disconnect, auto reconnect
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}
handleError();

// // set mysql server configuration
// var db = mysql.createConnection({     
//     host     : '3.19.75.152', 
//     // host     : 'localhost',      
//     user     : 'project',              
//     password : 'nUXqNrmwHe6Anb2w2vm7',       
//     port     : '3306',                   
//     database : 'inf551'
//     }); 

// // initialzize mysql server connection
// db.connect();

const nums = ["id", "latitude", "longitude", "distance", "depth", "xm", "md", "richter", "mw", "ms", "mb"];
const strs = ["date", "time", "country", "city", "area", "direction"];

app.get('/', (req, res) => {
    res.send('server connected!!!!!')
});

router.get('/mysqltest', (req, res) => {
    const test_query = 'SELECT * FROM earthquake WHERE area="dedemli_hassa"'
    db.query(test_query, (err, result) => {
        if(err){
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        res.send(result);
    });
});


router.post('/getdefaultpage', (req, res) => {
    const {page_limit_num, page_offset} = req.body;
    console.log(page_limit_num +' '+ page_offset);
    const default_page_query = `SELECT * FROM earthquake LIMIT ${page_limit_num} OFFSET ${page_offset};`;
    db.query(default_page_query, (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        return res.send(result);
    });
});

router.post('/getmaxmin', (req, res) => {
    const {headers} = req.body;
    // console.log(headers);
    let max_min = {};
    let n = 0;
    headers.forEach(element => {
        // console.log(element);
        max_min[element] = {};

        // get max
        n ++;
        // console.log(n);
        const _max_query = `SELECT MAX(${element}) FROM earthquake;`;
        db.query(_max_query, (err, result) => {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            let b = Object.values(result[0])[0];
            max_min[element]['max'] = b;
            n --;
            if(n === 0){
                return res.send(max_min);
            }
            return;
        });

        // get min
        n ++;
        // console.log(n);
        const _min_query = `SELECT MIN(${element}) FROM earthquake;`;
        db.query(_min_query, (err, result) => {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            let b = Object.values(result[0])[0];
            max_min[element]['min'] = b;
            n --;
            if(n === 0){
                return res.send(max_min);
            }
            return;
        });

        // get hasnull
        n ++;
        // console.log(n);
        const _has_query = `SELECT ${element} FROM earthquake ORDER BY ${element} LIMIT 1;`;
        db.query(_has_query, (err, result) => {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            let b = Object.values(result[0])[0];
            // b could be null or min number
            max_min[element]['hasnull'] = b;
            n --;
            if(n === 0){
                return res.send(max_min);
            }
            return;
        });

        // get number of rows
        n ++;
        // console.log(n);
        const _count_query = `SELECT COUNT(*) FROM earthquake;`;
        db.query(_count_query, (err, result) => {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            let b = Object.values(result[0])[0];
            // b could be null or min number
            max_min['countrows'] = b;
            n --;
            if(n === 0){
                return res.send(max_min);
            }
            return;
        });
    });
});

router.post('/numsortandfilter', (req, res) => {
    const {column_title, sort_direction, filter_range, include_null, page_limit_num, page_offset} = req.body;
    // filter_range should be [null, number] or [number, number]
    // include_null should be true or false
    // sort_direction should be 'ASC' or 'DESC' or 'NOTSORT'
    
    // query head
    sample_query = 'select * from earthquake where latitude>=30 and latitude<=32 order by latitude asc limit 20;';
    query_head = 'SELECT * FROM earthquake';

    // filter
    console.log('include_null='+include_null);
    console.log(filter_range);
    if (include_null === true) {
        // eg: mw filter_range==[null, 5] ==> WHERE ISNULL(mw) OR mw<=5
        query_filter = `WHERE ISNULL(${column_title}) OR ${column_title}<=${filter_range[1]}`;
    } else {
        // eg: mw filter_range==[1, 5] ==> WHERE mw>=1 AND mw<=5
        query_filter = `WHERE ${column_title}>=${filter_range[0]} AND ${column_title}<=${filter_range[1]}`;
    }

    // sort
    if (sort_direction === 'NOTSORT') {
        query_sort = '';
    } else {
        query_sort = `ORDER BY ${column_title} ${sort_direction}`;
    }

    // limit offset
    let query_limit = `LIMIT ${page_limit_num} OFFSET ${page_offset};`;

    // combine query
    const query_all = query_head+' '+query_filter+' '+query_sort+' '+query_limit;
    console.log(query_all);
    // execute query
    db.query(query_all, (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        return res.send(result);
    });
});

router.post('/numsortandfilternrow', (req, res) => {
    const {column_title, filter_range, include_null} = req.body;
    // filter_range should be [null, number] or [number, number]
    // include_null should be true or false
    // sort_direction should be 'ASC' or 'DESC' or 'NOTSORT'
    
    // query head
    sample_query = 'select count(*) from earthquake where latitude>=30 and latitude<=32;';
    query_head = 'SELECT COUNT(*) rows FROM earthquake';

    // filter
    console.log('include_null='+include_null);
    console.log(filter_range);
    if (include_null === true) {
        // eg: mw filter_range==[null, 5] ==> WHERE ISNULL(mw) OR mw<=5
        query_filter = `WHERE ISNULL(${column_title}) OR ${column_title}<=${filter_range[1]}`;
    } else {
        // eg: mw filter_range==[1, 5] ==> WHERE mw>=1 AND mw<=5
        query_filter = `WHERE ${column_title}>=${filter_range[0]} AND ${column_title}<=${filter_range[1]}`;
    }

    // combine query
    const query_all = query_head+' '+query_filter;
    console.log(query_all);
    // execute query
    db.query(query_all, (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        return res.send(result);
    });
});

router.post('/strsortandfilter', (req, res) => {
    // filter_keywords should by ["a", "b", ...], [] means not filter
    // sort_direction should be 'ASC' or 'DESC' or 'NOTSORT'
    
    const {column_title, sort_direction, filter_keywords,include_null, page_limit_num, page_offset} = req.body;

    let querystr = `SELECT * FROM earthquake `;
    let items = [];
    for(let filter_keyword of filter_keywords) {
        items.push(`"${filter_keyword}"`);
    }

    let wherestr = `${column_title} in (${items.join(",")})` ;
    let orderstr = null;
    if(sort_direction=='ASC'||sort_direction=='DESC'){
        orderstr = ` ${column_title} ${sort_direction}`
    }else{
        orderstr = null;
    }
    if(filter_keywords.length>0) {
        querystr+= " where "+wherestr;
    }
    if(orderstr!=null) {
        querystr+= " order by "+orderstr;
    }
    querystr+=` limit ${page_limit_num} offset ${page_offset};`;
    console.log(querystr);
    db.query(querystr, (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        return res.send(result);
    });
});

router.post('/strsortandfilternrow', (req, res) => {
    const {column_title, filter_keywords, include_null} = req.body;
    // filter_keywords should by ["a", "b", ...], [] means not filter
    // include_null should be true or false
    
    let not_filter = filter_keywords[0] === undefined;

    // query head
    sample_query = 'select count(*) from earthquake where area in ("baliklicay", "hamzabeyli", "demirciler_milas") order by area limit 20;';
    query_head = 'SELECT COUNT(*) rows FROM earthquake';

    // filter
    if (not_filter) {
        query_filter = '';
    } else {
        query_filter = `WHERE ${column_title} IN ("${filter_keywords.join('", "')}")`;
    }

    // combine query
    const query_all = query_head+' '+query_filter;
    console.log(query_all);
    // execute query
    db.query(query_all, (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        return res.send(result);
    });
});

router.post('/chartdata', (req, res) => {
    const title = req.body['title'];
    const query = `SELECT ${title} FROM earthquake;`
    console.log(query);
    db.query(query, (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        return res.send(result);
    });
});

router.post('/chartdatagroupcount', (req, res) => {
    const title = req.body['title'];
    const query = `SELECT ${title}, COUNT(*) count FROM earthquake GROUP BY ${title};`
    console.log(query);
    db.query(query, (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        return res.send(result);
    });
})

router.post('/mysqlquery', (req, res) => {
    const query = req.body['query'];
    console.log(query);
    db.query(query, (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        return res.send(result);
    });
})

app.use('/api', router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
