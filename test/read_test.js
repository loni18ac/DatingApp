//Inde i read_user.js
const assert = require('assert');
//assertion er ikke inkluderet i Mocha, så derfor requires det installerede
const userTestSchema = require('../usersTest');
//importerer User model

beforeEach(() => {
    var user = new userTestSchema({
        fullname: 'Latte Chokolade'
    });
    user.save()
        .then(() => done());
});
//Describe test
describe('Read user details', () => {

    //Create test
    it('finds record in database with fullname, Latte Chokolade', (done) => {
        userTestSchema.findOne({fullname: 'Latte Chokolade'})
        .then(function(user) {
            assert(user.fullname === 'Latte Chokolade');
            done();
        });
    });
});
