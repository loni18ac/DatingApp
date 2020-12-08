const mongoose = require('mongoose');
//tell mongoose to use es6 implementation of promises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://haITUser:datingapp@datingapp.mpfsc.mongodb.net/mocha?retryWrites=true&w=majority'); 
mongoose.connection
    .once('open', () => console.log('Connected!'))
    .on('error', (error) => {
        console.warn('Error : ',error);
    });
//Called hooks which runs before something.
beforeEach((done) => {
    mongoose.connection.collections.userSchema(
         //this function runs after the drop is completed
        done()); //go ahead everything is done now.
});


