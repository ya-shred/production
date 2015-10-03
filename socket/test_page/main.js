socketUserId = document.cookie.split('=')[1] || '8vu6SRFQ5fri1m5EYRijLryT5i9ORny0';
socketClient.init(socketUserId)
    .then(function () {
        console.log(arguments);
        socketClient.listen(console.log.bind(console, 'clien got: '));
    })
    .catch(function () {
        console.log(arguments);
    });