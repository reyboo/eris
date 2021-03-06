/* Concat multiple arrays into a single array.
 *
 * |Name  |Type |Desc              |
 * |------|-----|------------------|
 * |...arr|array|Arrays to concat  |
 * |return|array|Concatenated array|
 *
 * ```javascript
 * concat([1, 2], [3], [4, 5]); // -> [1, 2, 3, 4, 5]
 * ```
 */

_('toArr');

function exports()
{
    var args = toArr(arguments),
        ret = [];

    for (var i = 0, len = args.length; i < len; i++)
    {
        ret = ret.concat(toArr(args[i]));
    }

    return ret;
}