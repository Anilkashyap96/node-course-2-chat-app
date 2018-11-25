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
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(msg.from+" "+formattedTime+": "+msg.text);
  jQuery('#messages').append(li);
});

socket.on('newlocationmsg',function(msg){
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Location</a>');
  li.text(msg.from+" "+formattedTime+": ");
  a.attr('href',msg.url);
  li.append(a);
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
      jQuery('[name=message]').val('');
  });

});


var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }
locationButton.attr('disabled','disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function(position){
    //console.log(position);
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  },function(){
    locationButton.attr('disabled','disabled').text('Send location');
    alert('unable.fetch location');
  });
});
