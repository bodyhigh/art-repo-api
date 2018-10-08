import mongoose from 'mongoose';
import Address from '../../app/models/address.model';
import { sampleAddresses } from '../sample-data/address.sample';
import { expect } from 'chai';
import util from 'util';

describe('## MODEL/ADDRESS ##', () => {
    describe('Field Validation', () => {
        it('Should fail if missing required fields', function(done) {
            const newAddress = new Address();

            newAddress.validate((err) => {
                // console.log(util.inspect(Object.keys(err.errors), {colors: true }));
                expect(Object.keys(err.errors).length).to.be.equal(6);
                expect(err.errors.address1.kind).to.be.equal('required');
                expect(err.errors.city.kind).to.be.equal('required');
                expect(err.errors.stateProvince.kind).to.be.equal('required');
                expect(err.errors.postalCode.kind).to.be.equal('required');
                expect(err.errors.country.kind).to.be.equal('required');
                expect(err.errors.addressType.kind).to.be.equal('required');
                done()
            });
        });

        it('Should pass validation when all required fields are supplied', function(done) {
            const newAddress = new Address(sampleAddresses.addresses[0]);
            newAddress.validate(done);
        });
    });
});