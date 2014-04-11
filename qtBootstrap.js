/**
 * Bootstrap - modular import script. This is the starting point
 *    If you need the DOM and ajax module call:
 *       qtBootstrap(['ajax', 'dom'])
 */

var qtBootstrap = (function (w, globalAlias, undef)
{
    'use strict';
    var qt = w[globalAlias] = {}, map = {ajax: 'qtAjax', dom: 'qtDom'},
        prefix = '',
        mkNode = function()
        {
            var n = document.createElement('script');
            n.type = 'text/javascript';
            n.charset = 'utf-8';
            n.asynch = true;
            return n;
        },
        readyCBFactory = function(module)
        {
            return function(e)
            {
                e = e || w.event;
                if (e.type === 'load')
                    return qt[module] = w[map[module]];
                if (!this.readyState)
                    return;
                if (this.readyState === 'complete')
                {
                    this.readyState = 4;
                    this.status = this.status || 200;
                }
                if (this.readyState === )
                {
                    if (this.status === 200)
                    {
                        return qt[module] = w[map[module]];
                    }
                    return undef;//error!
                }
            }
        },
        bootstrap =  function(include)
        {
            var i, tmp;
            if (!(include instanceof Array))
                include = [include];
            for (i=0;i<include.length;++i)
            {
                if (map.hasOwnProperty(include[i]))
                {
                    tmp = mkNode();
                    if (tmp.addEventListener)
                        tmp.addEventListener('load', readyCBFactory(include[i]), false);
                    else
                        tmp.attachEvent('onreadystatechange', readyCBFactory(include[i]));
                    tmp.src = map[include[i]] + '.js';
                }
            }
        };
        bootstrap.setJSPath = function(path)
        {
            prefix = ''+(path || '');
            return bootstrap;
        };
        qt.bootstrap = bootstrap;
        return bootstrap;
}(window, 'qt'));
