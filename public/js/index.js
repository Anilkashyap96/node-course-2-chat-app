var socket = io();
console.log(socket);

// To check Server is connected or not
socket.on('connect',function(){
  console.log('connected to Server');

  //createMail is a custom event
  // socket.emit('createMail',{
  //   to: 'kashyapanil159@gmail.com',
  //   text: 'I sent ,ail to You',
  //   createdAt: 101
  // });

  //createmessage is a custom event
  // socket.emit('createmessage', {
  //   from:"9407233844",
  //   text:"Hey"
  // })

});


// To check Server goes disconnectedor not
socket.on('disconnect',function(){
  console.log('disConnected from Server');
});


socket.on('newmsg',function(msg){
  console.log("msg from server Side", msg);

  var li = jQuery('<li></li>');
  li.text(msg.from+": "+msg.text);
  jQuery('#messages').append(li);
});

// socket.emit('createmessage', {
//   from:"Frank",
//   text:"Hi"
// }, function(data){
//   console.log("Got it",data);
// });
// socket.on('newemail', function(email){
//   console.log("Email", email);
// })
jQuery('#message-form').on('submit',function(e){
  e.preventDefault();

  socket.emit('createmessage', {
    from:"User",
    text:jQuery('[name=message]').val()
  },function(){

  });

});
