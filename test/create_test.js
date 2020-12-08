//Inde i create_user.js
const assert = require('assert');
//assertion er ikke inkluderet i Mocha, så derfor requires det installerede
const userSchema = require('../usersTest');
//importerer userTest model

//Describe test
describe('Save record to DB', () => {

    //Create test
    it('Creates record in database with fullname, Latte Chokolade', (done) => {
        const user = new userSchema({fullname: 'Latte Chokolade'});
        user.save()//returnerer promise 
        .then(() => {
            assert(user.isNew === false); //hvis Latte er gemt i DB, er han ikke ny
            done();
        });
    });
});
