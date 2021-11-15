const express = require('express')
const app = express();


app.use(express.static('./dist/AngularTetris'));

app.get('/*',(req,res)=>
{
    res.sendFile('index.html',{root:'dist/AngularTetris'})
});

app.listen(process.env.PORT || 8080);
