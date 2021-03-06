/* Recursively create directories.
 *
 * |Name       |Type    |Desc               |
 * |-----------|--------|-------------------|
 * |dir        |string  |Directory to create|
 * |[mode=0777]|number  |Directory mode     |
 * |callback   |function|Callback           |
 *
 * ```javascript
 * mkdir('/tmp/foo/bar/baz', function (err)
 * {
 *     if (err) console.log(err);
 *     else console.log('Done');
 * });
 * ```
 */

_('isFn noop');

var fs = require('fs'),
    path = require('path');

var _0777 = parseInt('0777', 8);

function exports(p, mode, cb)
{
    if (isFn(mode))
    {
        cb = mode;
        mode = _0777;
    }
    cb = cb || noop;
    p = path.resolve(p);

    fs.mkdir(p, mode, function (err)
    {
        if (!err) return cb();

        switch (err.code)
        {
            case 'ENOENT':
                exports(path.dirname(p), mode, function (err)
                {
                    if (err) return cb(err);

                    exports(p, mode, cb)
                });
                break;
            default:
                fs.stat(p, function (errStat, stat)
                {
                    if (errStat || !stat.isDirectory()) return cb(errStat);

                    cb();
                });
        }
    });
}