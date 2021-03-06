var glob = require('glob'),
    fs = require('fs'),
    async = require('async');

var util = require('./util');

var output = {};

var OUTPUT_PATH = 'eris.json';

module.exports = function ()
{
    glob('*/*.js', {
        ignore: [
            '*/*.*.js',
            '*test/*.js',
            '*testUtil/*.js',
            '*testHtml/*.js',
            '*lib/*.js',
            '*bin/*.js',
            '*npm/*.js'
        ]
    }, function (err, files)
    {
        if (err) return console.log(err);

        async.parallel(genCbs(files), function (err)
        {
            if (err) return console.log(err);

            sortEris();
            outputEris();
        });
    });
};

function genCbs(files)
{
    var ret = [];

    util.each(files, function (file)
    {
        var modName = util.last(file.split('/')).slice(0, -3);

        ret.push(function (cb)
        {
            fs.readFile(file, 'utf-8', function (err, data)
            {
                if (err) return cb(err);

                var desc = 'No description.';

                var comments = util.extractBlockCmts(data);

                if (comments.length > 0) desc = util.trim(comments[0]).split('\n')[0];

                output[modName] = desc;

                cb();
            });
        });
    });

    return ret;
}

function sortEris()
{
    var newOutput = [];

    util.each(output, function (val, key)
    {
        newOutput.push({
            key: key,
            val: val
        });
    });

    newOutput.sort(function (a, b)
    {
        if (a.key < b.key) return -1;
        if (a.key > b.key) return 1;

        return 0;
    });

    output = {};

    util.each(newOutput, function (val)
    {
        output[val.key] = val.val;
    });
}

function outputEris()
{
    fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 4), 'utf-8', function (err)
    {
        if (err) return console.log(err);

        console.log('Index file generated: ' + OUTPUT_PATH);
    });
}