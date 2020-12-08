//Inde i read_user.js
const assert = require('assert');
//assertion er ikke inkluderet i Mocha, så derfor requires det installerede
const userSchema = require('../usersTest');
//importerer userTest model

beforeEach(() => {
    var user = new userSchema({
        fullname: 'Latte Chokolade'
    });
    user.save()
        .then(() => done());
});
//Describe test
describe('Read user details', () => {

    //Create test
    it('finds record in database with fullname, Latte Chokolade', (done) => {
        userSchema.findOne({fullname: 'Latte Chokolade'})
        .then(function(user) {
            assert(user.fullname === 'Latte Chokolade');
            done();
        });
    });
});
