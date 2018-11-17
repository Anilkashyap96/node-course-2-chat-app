const path = require('path');
const http= require('http');
const socketID =require('socket.io');
const express = require('express');
var app = express();
const port = process.env.PORT||3000;
const publicPath = path.join(__dirname,'../public');

app.use(express.static(publicPath));
var server= http.createServer(app);
var io= socketID(server)

//To check new client connection
io.on('connection', (socket)=>{
    console.log('new user connected');

    //To check User disConnected or not ...here are calling socket
    //because server will tell user is connected or


    //socket.emit is to create custom event
    //newmail is a custom event crated in server side
    // socket.emit('newemail',{
    //   from:'anilkashyap1996@gmail.com',
    //   text: 'Hi, I sent mail',
    //   createdAt: 102
    // })

    //newmsg is a custom event crated in server side
    // socket.emit('newmsg',{
    //     from:'9407233844',
    //     text:'Hi I am Anil'
    // });


    //createmail getting that is created in index.js(clint side)
    // socket.on('createMail',(mail)=>{
    //     console.log(mail);
    // });

    //creatmessage getting that is created in index.js(clint side)
    socket.on('createmessage', (msg)=>{
      console.log('Message',msg);
      io.emit('newmsg',{
        from: msg.from,
        text: msg.text
      });

    });

    socket.on('disconnect',()=>{
      console.log('User disConnected');
    });
});
// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })
server.listen(port, function () {
  console.log('Example app listening on port ${port}!')
})
