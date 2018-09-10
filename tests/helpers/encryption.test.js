import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Encryption from '../../app/helpers/encryption';

chai.use(chaiAsPromised);
chai.should();

describe('Encryption Methods', () => {
	describe('hashStringAsync()', () => {
		it('Rejected if string parameter undefined', () =>
			Encryption.hashStringAsync(undefined)
				.should.be.rejectedWith('String parameter not provided'));

		it('Rejected if string parameter is not provided', () =>
			Encryption.hashStringAsync()
				.should.be.rejectedWith('String parameter not provided'));

		it('Resolves if string parameter is provided', () =>
			Encryption.hashStringAsync('ThisIsSomeString')
				.should.be.fulfilled);

		it('Original Password should not match Hash Password', () => {
			const original = 'MyPassword';
			Encryption.hashStringAsync(original)
				.then((hashed) => {
					hashed.should.not.be.equal(original);
				});
		});

		it('Comparing hashed string to original string should match', (done) => {
			const original = 'MyPassword';

			const promises = [];
			promises.push(Encryption.hashStringAsync(original));

			Promise.all(promises)
				.then((results) => {
					const results0 = results[0];

					Encryption.compareStringsAsync(original, results0)
						.then((match) => {
							match.should.be.equal(true);
							done();
						})
						.catch(e => done(e));
				})
				.catch(e => done(e));
		});

		it('Comparing hashed string to different string should not match', (done) => {
			const original = 'MyPassword';
			const notOriginal = 'NotMyPassword';

			const promises = [];
			promises.push(Encryption.hashStringAsync(original));

			Promise.all(promises)
				.then((results) => {
					const results0 = results[0];

					Encryption.compareStringsAsync(notOriginal, results0)
						.then((match) => {
							match.should.be.equal(false);
							done();
						})
						.catch(e => done(e));
				})
				.catch(e => done(e));
		});
	});
});
