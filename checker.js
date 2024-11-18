const exp = require('express')
const pub = require('./pub');
const off = require('./off')
const app = exp()
app.use(exp.json());
app.use("/public",pub);
app.use('/off',off)
app.listen(800,()=>{
    console.log("server is on");
})