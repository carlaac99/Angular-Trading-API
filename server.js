const http = require('http')
const express = require('express');
const app = express();
var fs = require('fs')
const cors = require('cors');

app.use(express.json());
const port = process.env.PORT || 4100;
app.use(cors({
    origin: 'http://localhost:4200'  // Replace this with your frontend's URL
  }));


app.get('/', (req,res) => {
    
    fs.readFile(__dirname + "/" + "traders.json",'utf8', (err,data) =>{

        if (err){
            console.error("error reading gile in get route: ", err)
        }
        else{
            console.log(data)
            const tradersGet= JSON.parse(data)
    
            
            res.json(tradersGet)  
            
        }


    })
})

app.get('/:id', (req,res) => {

    fs.readFile(__dirname + "/" + "traders.json",'utf8', (err,data) =>{

        var traders = JSON.parse(data)

        console.log("traders in get /id", traders,)

        
        var trader = traders.find(trader => trader.id === parseInt(req.params.id));


        console.log ("trader",trader);

        res.json(trader)
    })
})

app.post('/addTrader', (req,res) => {

    var traders;
    const newTrader = req.body.trader;

    fs.readFile(__dirname + "/" + "traders.json",'utf8', (err,data) =>{

        traders = JSON.parse(data);

        newTrader.id = traders.length + 1

        newTrader.key = newTrader.id.toString()

        traders.push(newTrader)

        console.log("traders::", traders)
        console.log("trader", newTrader)
            
        fs.writeFile(__dirname + "/" + "traders.json",  JSON.stringify(traders,null,2),'utf8', (err,data) =>{


            res.status(201).json( traders);
        })

    })

})

app.delete('/delete/:id', (req,res) => {

    fs.readFile(__dirname + "/" + "traders.json",'utf8', (err,data) =>{

        var traders = JSON.parse(data)

        traders = traders.filter(trader => trader.id !== parseInt(req.params.id));

        console.log(traders)

        fs.writeFile(__dirname + "/" + "traders.json",  JSON.stringify(traders,null,2),'utf8', (err,data) =>{


            res.status(201).json(traders);
        })
    })

})

app.post('/deposit/:id/:amount', (req,res) => {

    fs.readFile(__dirname + "/" + "traders.json",'utf8', (err,data) =>{

        var traderId = req.params.id;

        var amount = req.params.amount;

        var traders = JSON.parse(data)

        var trader = traders.find(trader => trader.id === parseInt(traderId));
       
        trader.amount += Number(amount)

        console.log(trader)

        fs.writeFile(__dirname + "/" + "traders.json",  JSON.stringify(traders,null,2),'utf8', (err,data) =>{


            res.status(201).json(trader);
            // res.json(trader)
        })
    })

})

app.post('/withdraw/:id/:amount', (req,res) => {

    fs.readFile(__dirname + "/" + "traders.json",'utf8', (err,data) =>{

        var traderId = req.params.id;

        var amount = req.params.amount;

        var traders = JSON.parse(data)

        var trader = traders.find(trader => trader.id === parseInt(traderId));
        
        trader.amount -= Number(amount)

        console.log(trader)

        fs.writeFile(__dirname + "/" + "traders.json",  JSON.stringify(traders,null,2),'utf8', (err,data) =>{

            res.status(201).json( trader);
        })
    })

})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)

})