import User from '../../app/models/user.model';
import chai, { expect } from 'chai';
import util from 'util';

describe('## MODEL/USER ##', () => {
    describe('Field Validation', () => {
        it('Should fail if missing required fields', (done) => {
            const newUser = new User({});
            newUser.validate((err) => {
                expect(err.errors.firstName.kind).to.be.equal('required');
                expect(err.errors.lastName.kind).to.be.equal('required');
                expect(err.errors.email.kind).to.be.equal('required');
                expect(err.errors.password.kind).to.be.equal('required');
                expect(err.errors.roles.message).to.be.equal('required');
                expect(err.errors.accountStatus.kind).to.be.equal('required');
                // console.log('---------------------------------------------');                
                // // console.log(util.inspect(Object.keys(err.errors), {colors: true }));
                // console.log(util.inspect(err.errors, {colors: true }));
                // console.log('---------------------------------------------');
                
                done();
            });
        });
    });
});