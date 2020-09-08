import fs from 'fs';
import util from 'util'

function fsUnlink(path) {
    const unlink = util.promisify(fs.unlink);
    return unlink(path);
}

export default { fsUnlink };