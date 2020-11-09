const express = require('express')
const app = express();


app.use(express.static('./dist/tetrisCli'));

app.get('/*',(req,res)=>
{
    res.sendFile('index.html',{root:'dist/tetrisCli'})
});

app.listen(process.env.PORT || 8080);