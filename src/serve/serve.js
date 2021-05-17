const express = require('express');
const app = express();
const Mock = require('mockjs');

app.get('/apis/getUser', (req, res) => {
   const data =  Mock.mock({
        'list|1-10': [{
            'id|+1': 1,
            'name': '@name',
            'age|10-40': 1
        }],
        
    });
    res.send(data);
});
app.listen('3001');