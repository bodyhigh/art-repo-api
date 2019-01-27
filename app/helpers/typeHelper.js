import util from 'util';

exports.hasinstanceOf = (testObject, testType) => {
    if (Object.getOwnPropertyNames(testObject).indexOf('hasInstanceOf') === -1) 
        return false;

    return testObject.hasInstanceOf.indexOf(testType.name) !== -1;
}
