import util from 'util';
import APIError from './APIError';
const htmlEntities = require('html-entities').XmlEntities;

/**
 * Define sanitized fields for our entities
 */
const artworkSanitizeFields = ['title', 'description'];

function validateEntityArtistIdOwnership(entity, req) {
    if (entity === undefined) {
        throw new APIError("validateEntityArtistIdOwnership(): Entity is undefined");
    }

    if (req === undefined) {
        throw new APIError("validateEntityArtistIdOwnership(): req is undefined");
    }

    if (entity.artistId == req.identity.id) return;

    //Cannot access a record belonging to another user
    throw new APIError(errorCodes.INVALID_OWNERSHIP.description, 
        httpStatus.UNAUTHORIZED,
        true,
        [errorCodes.INVALID_OWNERSHIP]);
}

function patchMapping(entity, req) {
    if (entity === undefined) {
        throw new APIError("validateEntityArtistIdOwnership(): Entity is undefined");
    }

    if (req === undefined) {
        throw new APIError("validateEntityArtistIdOwnership(): req is undefined");
    }
    
    const keys = Object.keys(req.body);

	for (let i = 0; i < keys.length; i++) {
        if ((keys[i] == 'id') || (keys[i] == '_id')) continue; // Don't update the id        
		if (req.body[keys[i]] === entity[keys[i]]) continue;  // primitive checking for updated value
		
		entity[keys[i]] = req.body[keys[i]];
    }
    return entity;
}

/**
 * Escapes HTML characters from plain 'ol Json objects where property names
 * are found in sanitizeFields[]
 *
 * @param {*} entity
 * @param {*} sanitizeFields
 * @returns
 */
function escapeJsonEntity(entity, sanitizeFields) {
    if (entity === undefined) {
        throw new APIError("unescapeEntity(): entity is undefined");
    }

    if (sanitizeFields === undefined || sanitizeFields.length === 0) {
        throw new APIError("unescapeEntity(): sanitizeFields is undefined or empty");
    }

    // console.log(util.inspect(entity, { colors: true }));
    const doc = entity;
    const keys = Object.keys(doc);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // console.log(util.inspect(key, { colors: true }));
        if (sanitizeFields.indexOf(key) === -1) continue;
        // if (doc[key] === undefined) continue;

        // console.log('*************** TRANSFORM')
        // console.log(`FROM: ${doc[key]}`);
        doc[key] = htmlEntities.encode(doc[key]);
        // console.log(`TO: ${doc[key]}`);
    }
    // console.log(util.inspect(doc, { colors: true }));
    return doc;
}

function escapeEntity(entity, sanitizeFields) {
    // console.log(util.inspect(entity._doc, { colors: true }));
    if (entity.hasOwnProperty('_doc')) {
        // console.log('!!!!!!!!!!!!!!!!!!!!!!!!! has doc property');
        entity._doc = escapeJsonEntity(entity._doc, sanitizeFields);
    } else {
        // console.log('!!!!!!!!!!!!!!!!!!!!!!!!! does not have doc property');
        entity = escapeJsonEntity(entity, sanitizeFields);
    }
    return entity;
}

function unescapeJsonEntity(entity, sanitizeFields) {
    // console.log(util.inspect(entity, { colors: true }));
    if (entity === undefined) {
        throw new APIError("unescapeEntity(): entity is undefined");
    }

    if (sanitizeFields === undefined || sanitizeFields.length === 0) {
        throw new APIError("unescapeEntity(): sanitizeFields is undefined or empty");
    }

    const doc = entity;
    const keys = Object.keys(doc);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (sanitizeFields.indexOf(key) === -1) continue;
        if (doc[key] === undefined) continue;

        doc[key] = htmlEntities.decode(doc[key]);
    }
    return entity;
}

function unescapeEntity(entity, sanitizeFields) {
    if (entity.hasOwnProperty('_doc')) {
        entity._doc = unescapeJsonEntity(entity._doc, sanitizeFields);
    } else {
        entity = unescapeJsonEntity(entity, sanitizeFields);
    }
    return entity;
}

function unescapeEntityArray(entities, sanitizeFields) {
    if (!Array.isArray(entities)) {
        return unescapeEntity(entities, sanitizeFields);
    } else {
        return entities.map(entity => unescapeEntity(entity, sanitizeFields));
    }
}

/**
 * Will convert a comma delimited string into a string array, if empty will return 'undefined'
 * @param {string} stringField 
 */
function commaDelimitedToTrimArray(stringField) {
    const stringArray = stringField.split(',').reduce((filtered, stringItem) => {
        if (stringItem.trim().length > 0) filtered.push(stringItem.trim());
        return filtered;
    }, []);

    return stringArray.length > 0 ? stringArray : undefined;
}

export default {
    artworkSanitizeFields,
    validateEntityArtistIdOwnership,
    patchMapping,
    // escapeJsonEntity,
    escapeEntity,
    unescapeEntity,
    unescapeEntityArray,
    commaDelimitedToTrimArray
};