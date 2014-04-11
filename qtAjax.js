/**
 * Initial version of qtAjax. Written off the top of my head
 * Wanted to add it as a reminder, but do not have the real src at hand
 *
 */
 
var qtAjax = (function()
{
    var stringifyObject = function(obj, recursion)
    {
        var ret, i;
        recursion = recursion || false;
        if (typeof obj !== 'object')
        {
            throw new Error('no object provided');
        }
        for (i in obj)
        {
            if (!obj.hasOwnProperty(i) || typeof obj[i] === 'function')
                continue;
            if (recursion)
                ret +='['+i+']';
            else
                ret += (ret.length > 0 ? '&' : '') + i.toString(); 
            if (typeof obj[i] === 'object')
            {
                ret += formalizeObject(obj[i],true);
                continue;
            }
            ret += '='+obj[i].toString();
        }
        if (recursion)
            return ret;
        return encodeURI(ret);
    },
    defaultCB = function()
    {
        if (this.readyState===4)
        {
            if (this.status !== 200)
                throw new Error('Ajax request failed status: ' + this.status);
        }
    },
    ajax = (function()
    {
        var constructor = (function()
        {
            var name = (function()
            {
                try
                {
                    new XMLHttpRequest();
                    return ['XMLHttpRequest',undefined];
                }
                catch (error)
                {
                    try
                    {
                        new ActiveXObject('Msxml2.XMLHTTP');
                        return ['ActiveXObject', 'Msxml2.XMLHTTP']
                    }
                    catch(error)
                    {
                        new ActiveXObject('Microsoft.XMLHTTP');
                        return ['ActiveXObject', 'Microsoft.XMLHTTP']
                    }
                }
                throw new Error('No ajax support?');
            }());
            return function()
            {
                return new window[name[0]](name[1]);
            };
        }()),
        defaultSetup = {url: '',
            type: 'GET',
            dataType: 'data',
            success: defaultCB
        },
        return function(options)
        {
            var p, xhr;
            for (p in defaultSetup)
            {
                if (!options.hasOwnProperty(p))
                    options[p] = defaultSetup[p];
            }
            xhr = constructor();
            xhr.open(
                options.type,
                options.url,
                true
            );//only async here
            xhr.setRequestHeader(
                'X-Requested-With',
                 'XMLHttpRequest'
             );
             xhr.setRequestHeader(
                'Content-type', 
                options.dataType === 'json' ? 'application/json' : 'application/x-www-form-urlencode'
            );
            if (options.success !== defaultCB)
                options.success.bind(xhr);
            xhr.onreadystatechange = options.success;
            if (options.type.toUpperCase() === 'GET')
                return xhr.send(null);
            return xhr.send(
                options.dataType === 'json' ? JSON.stringify(options.data) : stringifyObject(options.data)
            );
        };
    }();
    ajax.setup = function(o)
    {
        for (var p in o)
        {
            if (o.hasOwnProperty(p))
                defaultSetup[p] = o[p];
        }
    };
    return ajax;
}());
