ace.define("ace/snippets",["require","exports","module","ace/lib/dom","ace/lib/oop","ace/lib/event_emitter","ace/lib/lang","ace/range","ace/range_list","ace/keyboard/hash_handler","ace/tokenizer","ace/clipboard","ace/editor"],(function(e,t,n){"use strict";function r(e){var t=(new Date).toLocaleString("en-us",e);return 1==t.length?"0"+t:t}var i=e("./lib/dom"),o=e("./lib/oop"),s=e("./lib/event_emitter").EventEmitter,a=e("./lib/lang"),c=e("./range").Range,p=e("./range_list").RangeList,u=e("./keyboard/hash_handler").HashHandler,l=e("./tokenizer").Tokenizer,h=e("./clipboard"),d={CURRENT_WORD:function(e){return e.session.getTextRange(e.session.getWordRange())},SELECTION:function(e,t,n){var r=e.session.getTextRange();return n?r.replace(/\n\r?([ \t]*\S)/g,"\n"+n+"$1"):r},CURRENT_LINE:function(e){return e.session.getLine(e.getCursorPosition().row)},PREV_LINE:function(e){return e.session.getLine(e.getCursorPosition().row-1)},LINE_INDEX:function(e){return e.getCursorPosition().row},LINE_NUMBER:function(e){return e.getCursorPosition().row+1},SOFT_TABS:function(e){return e.session.getUseSoftTabs()?"YES":"NO"},TAB_SIZE:function(e){return e.session.getTabSize()},CLIPBOARD:function(e){return h.getText&&h.getText()},FILENAME:function(e){return/[^/\\]*$/.exec(this.FILEPATH(e))[0]},FILENAME_BASE:function(e){return/[^/\\]*$/.exec(this.FILEPATH(e))[0].replace(/\.[^.]*$/,"")},DIRECTORY:function(e){return this.FILEPATH(e).replace(/[^/\\]*$/,"")},FILEPATH:function(e){return"/not implemented.txt"},WORKSPACE_NAME:function(){return"Unknown"},FULLNAME:function(){return"Unknown"},BLOCK_COMMENT_START:function(e){var t=e.session.$mode||{};return t.blockComment&&t.blockComment.start||""},BLOCK_COMMENT_END:function(e){var t=e.session.$mode||{};return t.blockComment&&t.blockComment.end||""},LINE_COMMENT:function(e){return(e.session.$mode||{}).lineCommentStart||""},CURRENT_YEAR:r.bind(null,{year:"numeric"}),CURRENT_YEAR_SHORT:r.bind(null,{year:"2-digit"}),CURRENT_MONTH:r.bind(null,{month:"numeric"}),CURRENT_MONTH_NAME:r.bind(null,{month:"long"}),CURRENT_MONTH_NAME_SHORT:r.bind(null,{month:"short"}),CURRENT_DATE:r.bind(null,{day:"2-digit"}),CURRENT_DAY_NAME:r.bind(null,{weekday:"long"}),CURRENT_DAY_NAME_SHORT:r.bind(null,{weekday:"short"}),CURRENT_HOUR:r.bind(null,{hour:"2-digit",hour12:!1}),CURRENT_MINUTE:r.bind(null,{minute:"2-digit"}),CURRENT_SECOND:r.bind(null,{second:"2-digit"})};d.SELECTED_TEXT=d.SELECTION;var g=function(){function e(){this.snippetMap={},this.snippetNameMap={},this.variables=d}return e.prototype.getTokenizer=function(){return e.$tokenizer||this.createTokenizer()},e.prototype.createTokenizer=function(){function t(e){return e=e.substr(1),/^\d+$/.test(e)?[{tabstopId:parseInt(e,10)}]:[{text:e}]}function n(e){return"(?:[^\\\\"+e+"]|\\\\.)"}var r={regex:"/("+n("/")+"+)/",onMatch:function(e,t,n){var r=n[0];return r.fmtString=!0,r.guard=e.slice(1,-1),r.flag="",""},next:"formatString"};return e.$tokenizer=new l({start:[{regex:/\\./,onMatch:function(e,t,n){var r=e[1];return("}"==r&&n.length||-1!="`$\\".indexOf(r))&&(e=r),[e]}},{regex:/}/,onMatch:function(e,t,n){return[n.length?n.shift():e]}},{regex:/\$(?:\d+|\w+)/,onMatch:t},{regex:/\$\{[\dA-Z_a-z]+/,onMatch:function(e,n,r){var i=t(e.substr(1));return r.unshift(i[0]),i},next:"snippetVar"},{regex:/\n/,token:"newline",merge:!1}],snippetVar:[{regex:"\\|"+n("\\|")+"*\\|",onMatch:function(e,t,n){var r=e.slice(1,-1).replace(/\\[,|\\]|,/g,(function(e){return 2==e.length?e[1]:"\0"})).split("\0").map((function(e){return{value:e}}));return n[0].choices=r,[r[0]]},next:"start"},r,{regex:"([^:}\\\\]|\\\\.)*:?",token:"",next:"start"}],formatString:[{regex:/:/,onMatch:function(e,t,n){return n.length&&n[0].expectElse?(n[0].expectElse=!1,n[0].ifEnd={elseEnd:n[0]},[n[0].ifEnd]):":"}},{regex:/\\./,onMatch:function(e,t,n){var r=e[1];return"}"==r&&n.length||-1!="`$\\".indexOf(r)?e=r:"n"==r?e="\n":"t"==r?e="\t":-1!="ulULE".indexOf(r)&&(e={changeCase:r,local:r>"a"}),[e]}},{regex:"/\\w*}",onMatch:function(e,t,n){var r=n.shift();return r&&(r.flag=e.slice(1,-1)),this.next=r&&r.tabstopId?"start":"",[r||e]},next:"start"},{regex:/\$(?:\d+|\w+)/,onMatch:function(e,t,n){return[{text:e.slice(1)}]}},{regex:/\${\w+/,onMatch:function(e,t,n){var r={text:e.slice(2)};return n.unshift(r),[r]},next:"formatStringVar"},{regex:/\n/,token:"newline",merge:!1},{regex:/}/,onMatch:function(e,t,n){var r=n.shift();return this.next=r&&r.tabstopId?"start":"",[r||e]},next:"start"}],formatStringVar:[{regex:/:\/\w+}/,onMatch:function(e,t,n){return n[0].formatFunction=e.slice(2,-1),[n.shift()]},next:"formatString"},r,{regex:/:[\?\-+]?/,onMatch:function(e,t,n){"+"==e[1]&&(n[0].ifEnd=n[0]),"?"==e[1]&&(n[0].expectElse=!0)},next:"formatString"},{regex:"([^:}\\\\]|\\\\.)*:?",token:"",next:"formatString"}]}),e.$tokenizer},e.prototype.tokenizeTmSnippet=function(e,t){return this.getTokenizer().getLineTokens(e,t).tokens.map((function(e){return e.value||e}))},e.prototype.getVariableValue=function(e,t,n){if(/^\d+$/.test(t))return(this.variables.__||{})[t]||"";if(/^[A-Z]\d+$/.test(t))return(this.variables[t[0]+"__"]||{})[t.substr(1)]||"";if(t=t.replace(/^TM_/,""),!this.variables.hasOwnProperty(t))return"";var r=this.variables[t];return"function"==typeof r&&(r=this.variables[t](e,t,n)),null==r?"":r},e.prototype.tmStrFormat=function(e,t,n){if(!t.fmt)return e;var r=t.flag||"",i=t.guard;i=new RegExp(i,r.replace(/[^gim]/g,""));var o="string"==typeof t.fmt?this.tokenizeTmSnippet(t.fmt,"formatString"):t.fmt,s=this,a=e.replace(i,(function(){var e=s.variables.__;s.variables.__=[].slice.call(arguments);for(var t=s.resolveVariables(o,n),r="E",i=0;i<t.length;i++){var a=t[i];if("object"==typeof a)if(t[i]="",a.changeCase&&a.local){var c=t[i+1];c&&"string"==typeof c&&("u"==a.changeCase?t[i]=c[0].toUpperCase():t[i]=c[0].toLowerCase(),t[i+1]=c.substr(1))}else a.changeCase&&(r=a.changeCase);else"U"==r?t[i]=a.toUpperCase():"L"==r&&(t[i]=a.toLowerCase())}return s.variables.__=e,t.join("")}));return a},e.prototype.tmFormatFunction=function(e,t,n){return"upcase"==t.formatFunction?e.toUpperCase():"downcase"==t.formatFunction?e.toLowerCase():e},e.prototype.resolveVariables=function(e,t){function n(t){var n=e.indexOf(t,s+1);-1!=n&&(s=n)}for(var r=[],i="",o=!0,s=0;s<e.length;s++){var a=e[s];if("string"!=typeof a){if(a){if(o=!1,a.fmtString){var c=e.indexOf(a,s+1);-1==c&&(c=e.length),a.fmt=e.slice(s+1,c),s=c}if(a.text){var p=this.getVariableValue(t,a.text,i)+"";a.fmtString&&(p=this.tmStrFormat(p,a,t)),a.formatFunction&&(p=this.tmFormatFunction(p,a,t)),p&&!a.ifEnd?(r.push(p),n(a)):!p&&a.ifEnd&&n(a.ifEnd)}else a.elseEnd?n(a.elseEnd):(null!=a.tabstopId||null!=a.changeCase)&&r.push(a)}}else r.push(a),"\n"==a?(o=!0,i=""):o&&(i=/^\t*/.exec(a)[0],o=/\S/.test(a))}return r},e.prototype.getDisplayTextForSnippet=function(e,t){return f.call(this,e,t).text},e.prototype.insertSnippetForSelection=function(e,t,n){void 0===n&&(n={});var r=f.call(this,e,t,n),i=e.getSelectionRange();n.range&&0===n.range.compareRange(i)&&(i=n.range);var o=e.session.replace(i,r.text),s=new m(e),a=e.inVirtualSelectionMode&&e.selection.index;s.addTabstops(r.tabstops,i.start,o,a)},e.prototype.insertSnippet=function(e,t,n){void 0===n&&(n={});var r=this;if(n.range&&!(n.range instanceof c)&&(n.range=c.fromPoints(n.range.start,n.range.end)),e.inVirtualSelectionMode)return r.insertSnippetForSelection(e,t,n);e.forEachSelection((function(){r.insertSnippetForSelection(e,t,n)}),null,{keepOrder:!0}),e.tabstopManager&&e.tabstopManager.tabNext()},e.prototype.$getScope=function(e){var t=e.session.$mode.$id||"";if("html"===(t=t.split("/").pop())||"php"===t){"php"===t&&!e.session.$mode.inlinePhp&&(t="html");var n=e.getCursorPosition(),r=e.session.getState(n.row);"object"==typeof r&&(r=r[0]),r.substring&&("js-"==r.substring(0,3)?t="javascript":"css-"==r.substring(0,4)?t="css":"php-"==r.substring(0,4)&&(t="php"))}return t},e.prototype.getActiveScopes=function(e){var t=this.$getScope(e),n=[t],r=this.snippetMap;return r[t]&&r[t].includeScopes&&n.push.apply(n,r[t].includeScopes),n.push("_"),n},e.prototype.expandWithTab=function(e,t){var n=this,r=e.forEachSelection((function(){return n.expandSnippetForSelection(e,t)}),null,{keepOrder:!0});return r&&e.tabstopManager&&e.tabstopManager.tabNext(),r},e.prototype.expandSnippetForSelection=function(e,t){var n,r=e.getCursorPosition(),i=e.session.getLine(r.row),o=i.substring(0,r.column),s=i.substr(r.column),a=this.snippetMap;return this.getActiveScopes(e).some((function(e){var t=a[e];return t&&(n=this.findMatchingSnippet(t,o,s)),!!n}),this),!!n&&(t&&t.dryRun||(e.session.doc.removeInLine(r.row,r.column-n.replaceBefore.length,r.column+n.replaceAfter.length),this.variables.M__=n.matchBefore,this.variables.T__=n.matchAfter,this.insertSnippetForSelection(e,n.content),this.variables.M__=this.variables.T__=null),!0)},e.prototype.findMatchingSnippet=function(e,t,n){for(var r=e.length;r--;){var i=e[r];if((!i.startRe||i.startRe.test(t))&&((!i.endRe||i.endRe.test(n))&&(i.startRe||i.endRe)))return i.matchBefore=i.startRe?i.startRe.exec(t):[""],i.matchAfter=i.endRe?i.endRe.exec(n):[""],i.replaceBefore=i.triggerRe?i.triggerRe.exec(t)[0]:"",i.replaceAfter=i.endTriggerRe?i.endTriggerRe.exec(n)[0]:"",i}},e.prototype.register=function(e,t){function n(e){return e&&!/^\^?\(.*\)\$?$|^\\b$/.test(e)&&(e="(?:"+e+")"),e||""}function r(e,t,r){return e=n(e),t=n(t),r?(e=t+e)&&"$"!=e[e.length-1]&&(e+="$"):(e+=t)&&"^"!=e[0]&&(e="^"+e),new RegExp(e)}function i(e){e.scope||(e.scope=t||"_"),t=e.scope,o[t]||(o[t]=[],s[t]={});var n=s[t];if(e.name){var i=n[e.name];i&&c.unregister(i),n[e.name]=e}o[t].push(e),e.prefix&&(e.tabTrigger=e.prefix),!e.content&&e.body&&(e.content=Array.isArray(e.body)?e.body.join("\n"):e.body),e.tabTrigger&&!e.trigger&&(!e.guard&&/^\w/.test(e.tabTrigger)&&(e.guard="\\b"),e.trigger=a.escapeRegExp(e.tabTrigger)),(e.trigger||e.guard||e.endTrigger||e.endGuard)&&(e.startRe=r(e.trigger,e.guard,!0),e.triggerRe=new RegExp(e.trigger),e.endRe=r(e.endTrigger,e.endGuard,!0),e.endTriggerRe=new RegExp(e.endTrigger))}var o=this.snippetMap,s=this.snippetNameMap,c=this;e||(e=[]),Array.isArray(e)?e.forEach(i):Object.keys(e).forEach((function(t){i(e[t])})),this._signal("registerSnippets",{scope:t})},e.prototype.unregister=function(e,t){function n(e){var n=i[e.scope||t];if(n&&n[e.name]){delete n[e.name];var o=r[e.scope||t],s=o&&o.indexOf(e);s>=0&&o.splice(s,1)}}var r=this.snippetMap,i=this.snippetNameMap;e.content?n(e):Array.isArray(e)&&e.forEach(n)},e.prototype.parseSnippetFile=function(e){e=e.replace(/\r/g,"");for(var t,n=[],r={},i=/^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;t=i.exec(e);){if(t[1])try{r=JSON.parse(t[1]),n.push(r)}catch(e){}if(t[4])r.content=t[4].replace(/^\t/gm,""),n.push(r),r={};else{var o=t[2],s=t[3];if("regex"==o){var a=/\/((?:[^\/\\]|\\.)*)|$/g;r.guard=a.exec(s)[1],r.trigger=a.exec(s)[1],r.endTrigger=a.exec(s)[1],r.endGuard=a.exec(s)[1]}else"snippet"==o?(r.tabTrigger=s.match(/^\S*/)[0],r.name||(r.name=s)):o&&(r[o]=s)}}return n},e.prototype.getSnippetByName=function(e,t){var n,r=this.snippetNameMap;return this.getActiveScopes(t).some((function(t){var i=r[t];return i&&(n=i[e]),!!n}),this),n},e}();o.implement(g.prototype,s);var f=function(e,t,n){function r(e){for(var t=[],n=0;n<e.length;n++){var r=e[n];if("object"==typeof r){if(u[r.tabstopId])continue;r=t[e.lastIndexOf(r,n-1)]||{tabstopId:r.tabstopId}}t[n]=r}return t}void 0===n&&(n={});var i=e.getCursorPosition(),o=e.session.getLine(i.row),s=e.session.getTabString(),a=o.match(/^\s*/)[0];i.column<a.length&&(a=a.slice(0,i.column)),t=t.replace(/\r/g,"");var c=this.tokenizeTmSnippet(t);c=(c=this.resolveVariables(c,e)).map((function(e){return"\n"!=e||n.excludeExtraIndent?"string"==typeof e?e.replace(/\t/g,s):e:e+a}));var p=[];c.forEach((function(e,t){if("object"==typeof e){var n=e.tabstopId,r=p[n];if(r||((r=p[n]=[]).index=n,r.value="",r.parents={}),-1===r.indexOf(e)){e.choices&&!r.choices&&(r.choices=e.choices),r.push(e);var i=c.indexOf(e,t+1);if(-1!==i){var o=c.slice(t+1,i),s=o.some((function(e){return"object"==typeof e}));s&&!r.value?r.value=o:o.length&&(!r.value||"string"!=typeof r.value)&&(r.value=o.join(""))}}}})),p.forEach((function(e){e.length=0}));for(var u={},l=0;l<c.length;l++){var h=c[l];if("object"==typeof h){var d=h.tabstopId,g=p[d],f=c.indexOf(h,l+1);if(u[d])u[d]===h&&(delete u[d],Object.keys(u).forEach((function(e){g.parents[e]=!0})));else{u[d]=h;var m=g.value;"string"!=typeof m?m=r(m):h.fmt&&(m=this.tmStrFormat(m,h,e)),c.splice.apply(c,[l+1,Math.max(0,f-l)].concat(m,h)),-1===g.indexOf(h)&&g.push(h)}}}var b=0,v=0,x="";return c.forEach((function(e){if("string"==typeof e){var t=e.split("\n");t.length>1?(v=t[t.length-1].length,b+=t.length-1):v+=e.length,x+=e}else e&&(e.start?e.end={row:b,column:v}:e.start={row:b,column:v})})),{text:x,tabstops:p,tokens:c}},m=function(){function e(e){if(this.index=0,this.ranges=[],this.tabstops=[],e.tabstopManager)return e.tabstopManager;e.tabstopManager=this,this.$onChange=this.onChange.bind(this),this.$onChangeSelection=a.delayedCall(this.onChangeSelection.bind(this)).schedule,this.$onChangeSession=this.onChangeSession.bind(this),this.$onAfterExec=this.onAfterExec.bind(this),this.attach(e)}return e.prototype.attach=function(e){this.$openTabstops=null,this.selectedTabstop=null,this.editor=e,this.session=e.session,this.editor.on("change",this.$onChange),this.editor.on("changeSelection",this.$onChangeSelection),this.editor.on("changeSession",this.$onChangeSession),this.editor.commands.on("afterExec",this.$onAfterExec),this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler)},e.prototype.detach=function(){this.tabstops.forEach(this.removeTabstopMarkers,this),this.ranges.length=0,this.tabstops.length=0,this.selectedTabstop=null,this.editor.off("change",this.$onChange),this.editor.off("changeSelection",this.$onChangeSelection),this.editor.off("changeSession",this.$onChangeSession),this.editor.commands.off("afterExec",this.$onAfterExec),this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler),this.editor.tabstopManager=null,this.session=null,this.editor=null},e.prototype.onChange=function(e){for(var t="r"==e.action[0],n=this.selectedTabstop||{},r=n.parents||{},i=this.tabstops.slice(),o=0;o<i.length;o++){var s=i[o],a=s==n||r[s.index];if(s.rangeList.$bias=a?0:1,"remove"==e.action&&s!==n){var c=s.parents&&s.parents[n.index],p=s.rangeList.pointIndex(e.start,c);p=p<0?-p-1:p+1;var u=s.rangeList.pointIndex(e.end,c);u=u<0?-u-1:u-1;for(var l=s.rangeList.ranges.slice(p,u),h=0;h<l.length;h++)this.removeRange(l[h])}s.rangeList.$onChange(e)}var d=this.session;!this.$inChange&&t&&1==d.getLength()&&!d.getValue()&&this.detach()},e.prototype.updateLinkedFields=function(){var e=this.selectedTabstop;if(e&&e.hasLinkedRanges&&e.firstNonLinked){this.$inChange=!0;for(var n=this.session,r=n.getTextRange(e.firstNonLinked),i=0;i<e.length;i++){var o=e[i];if(o.linked){var s=o.original,a=t.snippetManager.tmStrFormat(r,s,this.editor);n.replace(o,a)}}this.$inChange=!1}},e.prototype.onAfterExec=function(e){e.command&&!e.command.readOnly&&this.updateLinkedFields()},e.prototype.onChangeSelection=function(){if(this.editor){for(var e=this.editor.selection.lead,t=this.editor.selection.anchor,n=this.editor.selection.isEmpty(),r=0;r<this.ranges.length;r++)if(!this.ranges[r].linked){var i=this.ranges[r].contains(e.row,e.column),o=n||this.ranges[r].contains(t.row,t.column);if(i&&o)return}this.detach()}},e.prototype.onChangeSession=function(){this.detach()},e.prototype.tabNext=function(e){var t=this.tabstops.length,n=this.index+(e||1);(n=Math.min(Math.max(n,1),t))==t&&(n=0),this.selectTabstop(n),0===n&&this.detach()},e.prototype.selectTabstop=function(e){this.$openTabstops=null;var t=this.tabstops[this.index];if(t&&this.addTabstopMarkers(t),this.index=e,(t=this.tabstops[this.index])&&t.length){this.selectedTabstop=t;var n=t.firstNonLinked||t;if(t.choices&&(n.cursor=n.start),this.editor.inVirtualSelectionMode)this.editor.selection.fromOrientedRange(n);else{var r=this.editor.multiSelect;r.toSingleRange(n);for(var i=0;i<t.length;i++)t.hasLinkedRanges&&t[i].linked||r.addRange(t[i].clone(),!0)}this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler),this.selectedTabstop&&this.selectedTabstop.choices&&this.editor.execCommand("startAutocomplete",{matches:this.selectedTabstop.choices})}},e.prototype.addTabstops=function(e,t,n){var r=this.useLink||!this.editor.getOption("enableMultiselect");if(this.$openTabstops||(this.$openTabstops=[]),!e[0]){var i=c.fromPoints(n,n);v(i.start,t),v(i.end,t),e[0]=[i],e[0].index=0}var o=[this.index+1,0],s=this.ranges;e.forEach((function(e,n){for(var i=this.$openTabstops[n]||e,a=0;a<e.length;a++){var u=e[a],l=c.fromPoints(u.start,u.end||u.start);b(l.start,t),b(l.end,t),l.original=u,l.tabstop=i,s.push(l),i!=e?i.unshift(l):i[a]=l,u.fmtString||i.firstNonLinked&&r?(l.linked=!0,i.hasLinkedRanges=!0):i.firstNonLinked||(i.firstNonLinked=l)}i.firstNonLinked||(i.hasLinkedRanges=!1),i===e&&(o.push(i),this.$openTabstops[n]=i),this.addTabstopMarkers(i),i.rangeList=i.rangeList||new p,i.rangeList.$bias=0,i.rangeList.addList(i)}),this),o.length>2&&(this.tabstops.length&&o.push(o.splice(2,1)[0]),this.tabstops.splice.apply(this.tabstops,o))},e.prototype.addTabstopMarkers=function(e){var t=this.session;e.forEach((function(e){e.markerId||(e.markerId=t.addMarker(e,"ace_snippet-marker","text"))}))},e.prototype.removeTabstopMarkers=function(e){var t=this.session;e.forEach((function(e){t.removeMarker(e.markerId),e.markerId=null}))},e.prototype.removeRange=function(e){var t=e.tabstop.indexOf(e);-1!=t&&e.tabstop.splice(t,1),-1!=(t=this.ranges.indexOf(e))&&this.ranges.splice(t,1),-1!=(t=e.tabstop.rangeList.ranges.indexOf(e))&&e.tabstop.splice(t,1),this.session.removeMarker(e.markerId),e.tabstop.length||(-1!=(t=this.tabstops.indexOf(e.tabstop))&&this.tabstops.splice(t,1),this.tabstops.length||this.detach())},e}();m.prototype.keyboardHandler=new u,m.prototype.keyboardHandler.bindKeys({Tab:function(e){t.snippetManager&&t.snippetManager.expandWithTab(e)||(e.tabstopManager.tabNext(1),e.renderer.scrollCursorIntoView())},"Shift-Tab":function(e){e.tabstopManager.tabNext(-1),e.renderer.scrollCursorIntoView()},Esc:function(e){e.tabstopManager.detach()}});var b=function(e,t){0==e.row&&(e.column+=t.column),e.row+=t.row},v=function(e,t){e.row==t.row&&(e.column-=t.column),e.row-=t.row};i.importCssString("\n.ace_snippet-marker {\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n    background: rgba(194, 193, 208, 0.09);\n    border: 1px dotted rgba(211, 208, 235, 0.62);\n    position: absolute;\n}","snippets.css",!1),t.snippetManager=new g;var x=e("./editor").Editor;(function(){this.insertSnippet=function(e,n){return t.snippetManager.insertSnippet(this,e,n)},this.expandSnippet=function(e){return t.snippetManager.expandWithTab(this,e)}}).call(x.prototype)})),ace.define("ace/ext/emmet",["require","exports","module","ace/keyboard/hash_handler","ace/editor","ace/snippets","ace/range","ace/config","resources","resources","tabStops","resources","utils","actions"],(function(e,t,n){"use strict";var r,i,o=e("../keyboard/hash_handler").HashHandler,s=e("../editor").Editor,a=e("../snippets").snippetManager,c=e("../range").Range,p=e("../config"),u=function(){function e(){}return e.prototype.setupContext=function(e){this.ace=e,this.indentation=e.session.getTabString(),r||(r=window.emmet),(r.resources||r.require("resources")).setVariable("indentation",this.indentation),this.$syntax=null,this.$syntax=this.getSyntax()},e.prototype.getSelectionRange=function(){var e=this.ace.getSelectionRange(),t=this.ace.session.doc;return{start:t.positionToIndex(e.start),end:t.positionToIndex(e.end)}},e.prototype.createSelection=function(e,t){var n=this.ace.session.doc;this.ace.selection.setRange({start:n.indexToPosition(e),end:n.indexToPosition(t)})},e.prototype.getCurrentLineRange=function(){var e=this.ace,t=e.getCursorPosition().row,n=e.session.getLine(t).length,r=e.session.doc.positionToIndex({row:t,column:0});return{start:r,end:r+n}},e.prototype.getCaretPos=function(){var e=this.ace.getCursorPosition();return this.ace.session.doc.positionToIndex(e)},e.prototype.setCaretPos=function(e){var t=this.ace.session.doc.indexToPosition(e);this.ace.selection.moveToPosition(t)},e.prototype.getCurrentLine=function(){var e=this.ace.getCursorPosition().row;return this.ace.session.getLine(e)},e.prototype.replaceContent=function(e,t,n,r){null==n&&(n=null==t?this.getContent().length:t),null==t&&(t=0);var i=this.ace,o=i.session.doc,s=c.fromPoints(o.indexToPosition(t),o.indexToPosition(n));i.session.remove(s),s.end=s.start,e=this.$updateTabstops(e),a.insertSnippet(i,e)},e.prototype.getContent=function(){return this.ace.getValue()},e.prototype.getSyntax=function(){if(this.$syntax)return this.$syntax;var e=this.ace.session.$modeId.split("/").pop();if("html"==e||"php"==e){var t=this.ace.getCursorPosition(),n=this.ace.session.getState(t.row);"string"!=typeof n&&(n=n[0]),n&&((n=n.split("-")).length>1?e=n[0]:"php"==e&&(e="html"))}return e},e.prototype.getProfileName=function(){var e=r.resources||r.require("resources");switch(this.getSyntax()){case"css":return"css";case"xml":case"xsl":return"xml";case"html":var t=e.getVariable("profile");return t||(t=-1!=this.ace.session.getLines(0,2).join("").search(/<!DOCTYPE[^>]+XHTML/i)?"xhtml":"html"),t;default:var n=this.ace.session.$mode;return n.emmetConfig&&n.emmetConfig.profile||"xhtml"}},e.prototype.prompt=function(e){return prompt(e)},e.prototype.getSelection=function(){return this.ace.session.getTextRange()},e.prototype.getFilePath=function(){return""},e.prototype.$updateTabstops=function(e){var t=0,n=null,i=r.tabStops||r.require("tabStops"),o=(r.resources||r.require("resources")).getVocabulary("user"),s={tabstop:function(e){var r=parseInt(e.group,10),o=0===r;o?r=++t:r+=1e3;var a=e.placeholder;a&&(a=i.processText(a,s));var c="${"+r+(a?":"+a:"")+"}";return o&&(n=[e.start,c]),c},escape:function(e){return"$"==e?"\\$":"\\"==e?"\\\\":e}};if(e=i.processText(e,s),o.variables.insert_final_tabstop&&!/\$\{0\}$/.test(e))e+="${0}";else if(n){e=(r.utils?r.utils.common:r.require("utils")).replaceSubstring(e,"${0}",n[0],n[1])}return e},e}(),l={expand_abbreviation:{mac:"ctrl+alt+e",win:"alt+e"},match_pair_outward:{mac:"ctrl+d",win:"ctrl+,"},match_pair_inward:{mac:"ctrl+j",win:"ctrl+shift+0"},matching_pair:{mac:"ctrl+alt+j",win:"alt+j"},next_edit_point:"alt+right",prev_edit_point:"alt+left",toggle_comment:{mac:"command+/",win:"ctrl+/"},split_join_tag:{mac:"shift+command+'",win:"shift+ctrl+`"},remove_tag:{mac:"command+'",win:"shift+ctrl+;"},evaluate_math_expression:{mac:"shift+command+y",win:"shift+ctrl+y"},increment_number_by_1:"ctrl+up",decrement_number_by_1:"ctrl+down",increment_number_by_01:"alt+up",decrement_number_by_01:"alt+down",increment_number_by_10:{mac:"alt+command+up",win:"shift+alt+up"},decrement_number_by_10:{mac:"alt+command+down",win:"shift+alt+down"},select_next_item:{mac:"shift+command+.",win:"shift+ctrl+."},select_previous_item:{mac:"shift+command+,",win:"shift+ctrl+,"},reflect_css_value:{mac:"shift+command+r",win:"shift+ctrl+r"},encode_decode_data_url:{mac:"shift+ctrl+d",win:"ctrl+'"},expand_abbreviation_with_tab:"Tab",wrap_with_abbreviation:{mac:"shift+ctrl+a",win:"shift+ctrl+a"}},h=new u;for(var d in t.commands=new o,t.runEmmetCommand=function e(n){if("expand_abbreviation_with_tab"==this.action){if(!n.selection.isEmpty())return!1;var i=n.selection.lead,o=n.session.getTokenAt(i.row,i.column);if(o&&/\btag\b/.test(o.type))return!1}try{h.setupContext(n);var s=r.actions||r.require("actions");if("wrap_with_abbreviation"==this.action)return setTimeout((function(){s.run("wrap_with_abbreviation",h)}),0);var a=s.run(this.action,h)}catch(i){if(!r){var c=t.load(e.bind(this,n));return"expand_abbreviation_with_tab"!=this.action&&c}n._signal("changeStatus","string"==typeof i?i:i.message),p.warn(i),a=!1}return a},l)t.commands.addCommand({name:"emmet:"+d,action:d,bindKey:l[d],exec:t.runEmmetCommand,multiSelectAction:"forEach"});t.updateCommands=function(e,n){n?e.keyBinding.addKeyboardHandler(t.commands):e.keyBinding.removeKeyboardHandler(t.commands)},t.isSupportedMode=function(e){if(!e)return!1;if(e.emmetConfig)return!0;var t=e.$id||e;return/css|less|scss|sass|stylus|html|php|twig|ejs|handlebars/.test(t)},t.isAvailable=function(e,n){if(/(evaluate_math_expression|expand_abbreviation)$/.test(n))return!0;var r=e.session.$mode,i=t.isSupportedMode(r);if(i&&r.$modes)try{h.setupContext(e),/js|php/.test(h.getSyntax())&&(i=!1)}catch(e){}return i};var g=function(e,n){var r=n;if(r){var i=t.isSupportedMode(r.session.$mode);!1===e.enableEmmet&&(i=!1),i&&t.load(),t.updateCommands(r,i)}};t.load=function(e){return"string"!=typeof i?(p.warn("script for emmet-core is not loaded"),!1):(p.loadModule(i,(function(){i=null,e&&e()})),!0)},t.AceEmmetEditor=u,p.defineOptions(s.prototype,"editor",{enableEmmet:{set:function(e){this[e?"on":"removeListener"]("changeMode",g),g({enableEmmet:!!e},this)},value:!0}}),t.setCore=function(e){"string"==typeof e?i=e:r=e}})),ace.require(["ace/ext/emmet"],(function(e){"object"==typeof module&&"object"==typeof exports&&module&&(module.exports=e)}));