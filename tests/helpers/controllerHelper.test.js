// &amp;lt;script&amp;gt;alert(&amp;#x27;As the Canadians say&amp;#x27;);&amp;lt;&amp;#x2F;script&amp;gt;
import helper from '../../app/helpers/controllerHelper';
import Artwork from '../../app/models/artwork.model';
import { expect } from 'chai';
const htmlEntities = require('html-entities').XmlEntities;
import util from 'util';

describe("## ControllerHelper ##", function() {
    const expected = '<script>alert("GOTCHA");</script>';
    const encodedString = htmlEntities.encode(expected);

    it("Should escape html string", (done) => {
        const testEntity = new Artwork({
            title: expected
        });

        // console.log(util.inspect(testEntity, { colors: true }));
        const result = helper.escapeEntity(testEntity, helper.artworkSanitizeFields);
        expect(result.title).to.be.equal(encodedString);
        done();
    });

    it("Should unescape html encoded string", (done) => {
        const testEntity = {
            _doc: {
                title: encodedString
            }
        };

        const result = helper.unescapeEntity(testEntity, helper.artworkSanitizeFields);
        expect(result._doc.title).to.equal(expected);
        done();
    });
});
