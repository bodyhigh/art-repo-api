import util from 'util';

exports.hasinstanceOf = (testObject, testType) => {
    if (Object.getOwnPropertyNames(testObject).indexOf('hasInstanceOf') === -1) return false;
    
    // console.log('&&&&&&&&&&&&&&&');
    // console.log(util.inspect(Object.keys(testObject), { colors: true }));
    // console.log(testType.name);
    // console.log(testObject.hasInstanceOf.indexOf(testType.name));
    return testObject.hasInstanceOf.indexOf(testType.name) !== -1;
}
