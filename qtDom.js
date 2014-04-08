/**
 * Simple jQ-like DOM query function.
 * ALWAYS returns element(s) in array, selectors are pretty simple:
 * queryDom('* [class^=foo-]') returns all elements with classes beginning with "foo-"
 * other comparison operators are:
 *  ~= -> does not contain
 *  *= -> substring
 *  |= -> explicit string, translates to \b<string>\b regex
 *  $= -> ends with
 *  =  -> start-to-finish match (^<string>$)
 *  ^= -> starts with, as example above shows
 */

var queryDom = (function(D)
{
    var sp = /([^[:\s]+)\s*(\[([^[~=*^\$|]+)([=^*~$]{1,2})([^\]]+)\])?[^:]*?(\:(.+))?/i,
        indexes = {base: 1,
            attr: 3,
            operator: 4,
            value: 5,
            pseudo: 7},
        makePattern = function(operator, value)
        {
            if (!value)
            {
                value = operator || '';
                operator = '=';
            }
            if (value.indexOf('=') !== -1 || value.length === 0)
                return /.+/i;//error!
            operator = operator.replace('=','');
            switch (operator)
            {
                case '':
                    value = '^' + value + '$';
                case '*':
                    break;
                case '^':
                    value = '^' + value;
                    break;
                case '~':
                    value = '[^' + value.replace(/-/g, '\\-') + ']';
                    break;
                case '|':
                    value = '\\b' + value + '\\b';
                    break;
                case '$':
                    value += '$';
            }
            return new RegExp(value, 'i');
        },
        searchAttr = function(nodes, attr, pattern)
        {
            var i, r=[];
            if (attr === 'class')
                attr += 'Name';
            for (i=0;i<nodes.length;++i)
            {
                if (nodes[i][attr].match(pattern))
                    r.push(nodes[i]);
            }
            return r;
        },
        qDom = function(sel)
        {
            var nodes, base, pattern, pseudo;
            parts = sel.match(sp);
            base = parts[indexes.base];
            if (!base)
                return [];
            if (base.charAt(0) === '#')
                return [document.querySelector(base)];
            nodes = document.querySelectorAll(base);
            if (parts[indexes.attr])
            {
                pattern = makePattern(
                    parts[indexes.operator],
                    parts[indexes.value]
                );
                nodes = searchAttr(nodes, parts[indexes.attr], pattern);
            }
            if (parts[indexes.pseudo])
            {
                pseudo = parts[indexes.pseudo];
                //todo
            }
            return Array.prototype.slice.call(nodes);//return as array
        },
        fb = function (param)
        {
            if (typeof param === 'string')
                return qDom(param);
            return param;//assume node, for foreach $(this) notation to work
        };
	//for jQ compatibility, note: this is REALLY BASIC
        fb.each = function(elems, callback)
        {
            var i;
            for (i=0;i<elems.length;++i)
            {//callback $(this), where $ == this module works as jQ, only it exposes the DOM node directly
                callback.apply(elems[i], [elems[i], i]);
            }
        };
        return fb;
}(document));

