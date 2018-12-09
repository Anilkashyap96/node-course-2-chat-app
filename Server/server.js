const path = require('path');
const http= require('http');
const socketID =require('socket.io');
const express = require('express');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var app = express();
const port = process.env.PORT||3000;
const publicPath = path.join(__dirname,'../public');

app.use(express.static(publicPath));
var server= http.createServer(app);
var io= socketID(server);
var users = new Users();

//To check new client connection
io.on('connection', (socket)=>{
    //console.log('new user connected');


    socket.on('join', (params, callback) =>{
      if(!isRealString(params.name) || !isRealString(params.room))
      {
        return callback('Name and room are required.');
      }
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);
      io.to(params.room).emit('updateUserList', users.getUserList(params.room));

      //socket.leave('The office Fans');

      //io.emit->io.to('The office Fans').emit //to send everyone forr specific room
      //socket.broadcast.emit->socket.broadcast.to('The office Fans').emit
      //socket.emit->socket.to('The office Fans').emit0

      //message for Admin
      socket.emit("newmsg",generateMessage("Admin", "Welcome to new chat App"));

      //message for Admin if new user join
      socket.broadcast.to(params.room).emit("newmsg",generateMessage("Admin", ""+params.name+" has joined."));


      callback();
    })



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
    socket.on('createmessage', (msg, callback)=>{
      //console.log('Message',msg);
      var user = users.getUser(socket.id);
      if(user && isRealString(msg.text)){
        io.to(user.room).emit('newmsg',generateMessage(user.name, msg.text));
      }
      //io.emit is for broadcasting including him also

      //socket.broadcast.emit is same as io.emit but it exclude himself other than him will get the message
      //socket.broadcast.emit('newmsg',generateMessage(msg.from, msg.text));
      callback();
    });

    socket.on('createLocationMessage',(coords)=>{
      var user = users.getUser(socket.id);
      if(user){
        io.to(user.room).emit('newlocationmsg', generateLocationMessage(user.name, coords.latitude,coords.longitude));
      }
      //io.emit('newlocationmsg', generateLocationMessage('Admin', coords.latitude,coords.longitude));
    });

    socket.on('disconnect',()=>{
      var user = users.removeUser(socket.id);

      if(user){
        io.to(user.room).emit('newmsg', generateMessage('Admin', ""+user.name+" has left."));
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      }
      //console.log('User disConnected');
    });
});
// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })
server.listen(port, function () {
  //console.log('Example app listening on port ${port}!')
})
