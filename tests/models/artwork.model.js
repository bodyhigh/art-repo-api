import mongoose from 'mongoose';
import Artwork from '../../app/models/artwork.model';
import { expect } from 'chai';
import util from 'util';

describe('## MODEL/ARTWORK ##', function() {
    describe('Field Validation', function() {
        it('Should Pass if not missing required fields', function(done) {
            const newArtwork = new Artwork({
                title: 'some name',
                description: 'some description',
                artistId: mongoose.Types.ObjectId()
            });

            newArtwork.validate(done);
        });

        it('Should fail if missing required fields', function(done) {
            const newArtwork = new Artwork({});
            newArtwork.validate((err) => {
                // console.log('---------------------------------------------');                
                // console.log(util.inspect(Object.keys(err.errors), {colors: true }));
                // console.log(util.inspect(err.errors, {colors: true }));
                // console.log('---------------------------------------------');

                expect(err.errors.title.kind).to.be.equal('required');
                // expect(err.errors.description.kind).to.be.equal('required');
                expect(err.errors.artistId.kind).to.be.equal('required');
                done();
            });
        });
    });
});