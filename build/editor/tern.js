(function(root, mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(exports);
  if (typeof define == "function" && define.amd) // AMD
    return define(["exports"], mod);
  mod((root.tern || (root.tern = {})).signal = {}); // Plain browser env
})(this, function(exports) {

  function on(type, f) {
    var handlers = this._handlers || (this._handlers = Object.create(null));
    (handlers[type] || (handlers[type] = [])).push(f);
  }

  function off(type, f) {
    var arr = this._handlers && this._handlers[type];
    if (arr) for (var i = 0; i < arr.length; ++i)
      if (arr[i] == f) { arr.splice(i, 1); break; }
  }

  var noHandlers = [];
  function getHandlers(emitter, type) {
    var arr = emitter._handlers && emitter._handlers[type];
    return arr && arr.length ? arr.slice() : noHandlers;
  }

  function signal(type, a1, a2, a3, a4) {
    var arr = getHandlers(this, type);
    for (var i = 0; i < arr.length; ++i) arr[i].call(this, a1, a2, a3, a4);
  }

  function signalReturnFirst(type, a1, a2, a3, a4) {
    var arr = getHandlers(this, type);
    for (var i = 0; i < arr.length; ++i) {
      var result = arr[i].call(this, a1, a2, a3, a4);
      if (result) return result;
    }
  }

  function hasHandler(type) {
    var arr = this._handlers && this._handlers[type];
    return arr && arr.length > 0 && arr;
  }

  exports.mixin = function(obj) {
    obj.on = on; obj.off = off;
    obj.signal = signal;
    obj.signalReturnFirst = signalReturnFirst;
    obj.hasHandler = hasHandler;
    return obj;
  };
});

// The Tern server object

// A server is a stateful object that manages the analysis for a
// project, and defines an interface for querying the code in the
// project.

(function(root, mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(exports, require("./infer"), require("./signal"),
               require("acorn"), require("acorn-walk"));
  if (typeof define == "function" && define.amd) // AMD
    return define(["exports", "./infer", "./signal", "acorn/dist/acorn", "acorn-walk/dist/walk"], mod);
  mod(root.tern || (root.tern = {}), tern, tern.signal, acorn, acorn.walk); // Plain browser env
})(this, function(exports, infer, signal, acorn, walk) {
  "use strict";

  var plugins = Object.create(null);
  exports.registerPlugin = function(name, init) { plugins[name] = init; };

  var defaultOptions = exports.defaultOptions = {
    debug: false,
    async: false,
    getFile: function(_f, c) { if (this.async) c(null, null); },
    normalizeFilename: function(name) { return name },
    defs: [],
    plugins: {},
    fetchTimeout: 1000,
    dependencyBudget: 20000,
    reuseInstances: true,
    stripCRs: false,
    ecmaVersion: 9,
    projectDir: "/",
    parent: null
  };

  var queryTypes = {
    completions: {
      takesFile: true,
      run: findCompletions
    },
    properties: {
      run: findProperties
    },
    type: {
      takesFile: true,
      run: findTypeAt
    },
    documentation: {
      takesFile: true,
      run: findDocs
    },
    definition: {
      takesFile: true,
      run: findDef
    },
    refs: {
      takesFile: true,
      fullFile: true,
      run: findRefs
    },
    rename: {
      takesFile: true,
      fullFile: true,
      run: buildRename
    },
    files: {
      run: listFiles
    }
  };

  exports.defineQueryType = function(name, desc) { queryTypes[name] = desc; };

  function File(name, parent) {
    this.name = name;
    this.parent = parent;
    this.scope = this.text = this.ast = this.lineOffsets = null;
  }
  File.prototype.asLineChar = function(pos) { return asLineChar(this, pos); };

  function parseFile(srv, file) {
    var options = {
      directSourceFile: file,
      allowReturnOutsideFunction: true,
      allowImportExportEverywhere: true,
      ecmaVersion: srv.options.ecmaVersion,
      allowHashBang: true
    };
    var text = srv.signalReturnFirst("preParse", file.text, options) || file.text;
    var ast = infer.parse(text, options);
    srv.signal("postParse", ast, text);
    return ast;
  }

  var astral = /[\uD800-\uDBFF]/g;

  function updateText(file, text, srv) {
    file.text = srv.options.stripCRs ? text.replace(/\r\n/g, "\n") : text;
    file.hasAstral = astral.test(file.text);
    infer.withContext(srv.cx, function() {
      file.ast = parseFile(srv, file);
    });
    file.lineOffsets = null;
  }

  var Server = exports.Server = function(options) {
    this.cx = null;
    this.options = options || {};
    for (var o in defaultOptions) if (!options.hasOwnProperty(o))
      options[o] = defaultOptions[o];

    this.projectDir = options.projectDir.replace(/\\/g, "/");
    if (!/\/$/.test(this.projectDir)) this.projectDir += "/";

    this.parent = options.parent;
    this.handlers = Object.create(null);
    this.files = [];
    this.fileMap = Object.create(null);
    this.needsPurge = [];
    this.budgets = Object.create(null);
    this.uses = 0;
    this.pending = 0;
    this.asyncError = null;
    this.mod = {};

    this.defs = options.defs.slice(0);
    this.plugins = Object.create(null);
    for (var plugin in options.plugins) if (options.plugins.hasOwnProperty(plugin))
      this.loadPlugin(plugin, options.plugins[plugin]);

    this.reset();
  };
  Server.prototype = signal.mixin({
    addFile: function(name, /*optional*/ text, parent) {
      // Don't crash when sloppy plugins pass non-existent parent ids
      if (parent && !(parent in this.fileMap)) parent = null;
      if (!(name in this.fileMap))
        name = this.normalizeFilename(name);
      ensureFile(this, name, parent, text);
    },
    delFile: function(name) {
      var file = this.findFile(name);
      if (file) {
        this.needsPurge.push(file.name);
        for (var i = 0; i < this.files.length; i++) {
          if (this.files[i] == file) this.files.splice(i--, 1);
          else if (this.files[i].parent == name) this.files[i].parent = null;
        }
        delete this.fileMap[file.name];
      }
    },
    reset: function() {
      this.signal("reset");
      this.cx = new infer.Context(this.defs, this);
      this.uses = 0;
      this.budgets = Object.create(null);
      for (var i = 0; i < this.files.length; ++i) {
        var file = this.files[i];
        if (file.scope) {
          infer.clearScopes(file.ast);
          file.scope = null;
        }
      }
      this.signal("postReset");
    },

    request: function(doc, c) {
      var inv = invalidDoc(doc);
      if (inv) return c(inv);

      var self = this;
      doRequest(this, doc, function(err, data) {
        c(err, data);
        if (self.uses > 40) {
          self.reset();
          analyzeAll(self, null, function(){});
        }
      });
    },

    findFile: function(name) {
      return this.fileMap[this.normalizeFilename(name)];
    },

    flush: function(c) {
      var cx = this.cx;
      analyzeAll(this, null, function(err) {
        if (err) return c(err);
        infer.withContext(cx, c);
      });
    },

    startAsyncAction: function() {
      ++this.pending;
    },
    finishAsyncAction: function(err) {
      if (err) this.asyncError = err;
      if (--this.pending === 0) this.signal("everythingFetched");
    },

    addDefs: function(defs, toFront) {
      if (toFront) this.defs.unshift(defs);
      else this.defs.push(defs);

      if (this.cx) this.reset();
    },

    deleteDefs: function(name) {
      for (var i = 0; i < this.defs.length; i++) if (this.defs[i]["!name"] == name) {
        this.defs.splice(i, 1);
        if (this.cx) this.reset();
        return;
      }
    },

    loadPlugin: function(name, options) {
      if (arguments.length == 1) options = this.options.plugins[name] || true;
      if (name in this.plugins || !(name in plugins) || !options) return;
      this.plugins[name] = true;
      var init = plugins[name](this, options);

      // This is for backwards-compatibilty. Don't rely on it -- use addDef and on directly
      if (!init) return;
      if (init.defs) this.addDefs(init.defs, init.loadFirst);
      if (init.passes) for (var type in init.passes) if (init.passes.hasOwnProperty(type))
        this.on(type, init.passes[type]);
    },

    normalizeFilename: function(name) {
      var norm = this.options.normalizeFilename(name).replace(/\\/g, "/");
      if (norm.indexOf(this.projectDir) == 0) norm = norm.slice(this.projectDir.length);
      return norm;
    }
  });

  function doRequest(srv, doc, c) {
    if (doc.query && !queryTypes.hasOwnProperty(doc.query.type))
      return c("No query type '" + doc.query.type + "' defined");

    var query = doc.query;
    // Respond as soon as possible when this just uploads files
    if (!query) c(null, {});

    var files = doc.files || [];
    if (files.length) ++srv.uses;
    for (var i = 0; i < files.length; ++i) {
      var file = files[i];
      file.name = srv.normalizeFilename(file.name);
      if (file.type == "delete")
        srv.delFile(file.name);
      else
        ensureFile(srv, file.name, null, file.type == "full" ? file.text : null);
    }

    var timeBudget = typeof doc.timeout == "number" ? [doc.timeout] : null;
    if (!query) {
      analyzeAll(srv, timeBudget, function(){});
      return;
    }

    var queryType = queryTypes[query.type];
    if (queryType.takesFile) {
      if (typeof query.file != "string") return c(".query.file must be a string");
      if (!/^#/.test(query.file)) ensureFile(srv, query.file, null);
    }

    analyzeAll(srv, timeBudget, function(err) {
      if (err) return c(err);
      var file = queryType.takesFile && resolveFile(srv, files, query.file);
      if (queryType.fullFile && file.type == "part")
        return c("Can't run a " + query.type + " query on a file fragment");

      infer.resetGuessing();
      infer.withContext(srv.cx, function() {
        var result, run = function() { result = queryType.run(srv, query, file); };
        try {
          if (timeBudget) infer.withTimeout(timeBudget[0], run);
          else run();
        } catch (e) {
          if (srv.options.debug && e.name != "TernError") console.error(e.stack);
          return c(e);
        }
        c(null, result);
      });
    });
  }

  function analyzeFile(srv, file) {
    infer.withContext(srv.cx, function() {
      file.scope = srv.cx.topScope;
      srv.signal("beforeLoad", file);
      infer.analyze(file.ast, file.name, file.scope);
      srv.signal("afterLoad", file);
    });
    return file;
  }

  function ensureFile(srv, name, parent, text) {
    var known = srv.findFile(name);
    if (known) {
      if (text != null) {
        if (known.scope) {
          srv.needsPurge.push(name);
          infer.clearScopes(known.ast);
          known.scope = null;
        }
        updateText(known, text, srv);
      }
      if (parentDepth(srv, known.parent) > parentDepth(srv, parent)) {
        known.parent = parent;
        if (known.excluded) known.excluded = null;
      }
      return;
    }

    var file = new File(name, parent);
    srv.files.push(file);
    srv.fileMap[name] = file;
    if (text != null) {
      updateText(file, text, srv);
    } else if (srv.options.async) {
      srv.startAsyncAction();
      srv.options.getFile(name, function(err, text) {
        updateText(file, text || "", srv);
        srv.finishAsyncAction(err);
      });
    } else {
      updateText(file, srv.options.getFile(name) || "", srv);
    }
  }

  function fetchAll(srv, c) {
    var done = true, returned = false;
    srv.files.forEach(function(file) {
      if (file.text != null) return;
      if (srv.options.async) {
        done = false;
        srv.options.getFile(file.name, function(err, text) {
          if (err && !returned) { returned = true; return c(err); }
          updateText(file, text || "", srv);
          fetchAll(srv, c);
        });
      } else {
        try {
          updateText(file, srv.options.getFile(file.name) || "", srv);
        } catch (e) { return c(e); }
      }
    });
    if (done) c();
  }

  function waitOnFetch(srv, timeBudget, c) {
    var done = function() {
      srv.off("everythingFetched", done);
      clearTimeout(timeout);
      analyzeAll(srv, timeBudget, c);
    };
    srv.on("everythingFetched", done);
    var timeout = setTimeout(done, srv.options.fetchTimeout);
  }

  function analyzeAll(srv, timeBudget, c) {
    if (srv.pending) return waitOnFetch(srv, timeBudget, c);

    var e = srv.fetchError;
    if (e) { srv.fetchError = null; return c(e); }

    if (srv.needsPurge.length > 0) infer.withContext(srv.cx, function() {
      infer.purge(srv.needsPurge);
      srv.needsPurge.length = 0;
    });

    var done = true;
    // The second inner loop might add new files. The outer loop keeps
    // repeating both inner loops until all files have been looked at.
    for (var i = 0; i < srv.files.length;) {
      var toAnalyze = [];
      for (; i < srv.files.length; ++i) {
        var file = srv.files[i];
        if (file.text == null) done = false;
        else if (file.scope == null && !file.excluded) toAnalyze.push(file);
      }
      toAnalyze.sort(function(a, b) {
        return parentDepth(srv, a.parent) - parentDepth(srv, b.parent);
      });
      for (var j = 0; j < toAnalyze.length; j++) {
        var file = toAnalyze[j];
        if (file.parent && !chargeOnBudget(srv, file)) {
          file.excluded = true;
        } else if (timeBudget) {
          var startTime = +new Date;
          try {
            infer.withTimeout(timeBudget[0], function() { analyzeFile(srv, file); });
          } catch(e) {
            if (e instanceof infer.TimedOut) return c(e);
            else throw e;
          }
          timeBudget[0] -= +new Date - startTime;
        } else {
          analyzeFile(srv, file);
        }
      }
    }
    if (done) c();
    else waitOnFetch(srv, timeBudget, c);
  }

  function firstLine(str) {
    var end = str.indexOf("\n");
    if (end < 0) return str;
    return str.slice(0, end);
  }

  function findMatchingPosition(line, file, near) {
    var pos = Math.max(0, near - 500), closest = null;
    if (!/^\s*$/.test(line)) for (;;) {
      var found = file.indexOf(line, pos);
      if (found < 0 || found > near + 500) break;
      if (closest == null || Math.abs(closest - near) > Math.abs(found - near))
        closest = found;
      pos = found + line.length;
    }
    return closest;
  }

  function scopeDepth(s) {
    for (var i = 0; s; ++i, s = s.prev) {}
    return i;
  }

  function ternError(msg) {
    var err = new Error(msg);
    err.name = "TernError";
    return err;
  }

  function resolveFile(srv, localFiles, name) {
    var isRef = name.match(/^#(\d+)$/);
    if (!isRef) return srv.findFile(name);

    var file = localFiles[isRef[1]];
    if (!file || file.type == "delete") throw ternError("Reference to unknown file " + name);
    if (file.type == "full") return srv.fileMap[file.name];

    // This is a partial file

    var realFile = file.backing = srv.fileMap[file.name];
    var offset = resolvePos(realFile, file.offsetLines == null ? file.offset : {line: file.offsetLines, ch: 0}, true);
    var line = firstLine(file.text);
    var foundPos = findMatchingPosition(line, realFile.text, offset);
    var pos = foundPos == null ? Math.max(0, realFile.text.lastIndexOf("\n", offset)) : foundPos;
    var inObject, atFunction;

    infer.withContext(srv.cx, function() {
      infer.purge(file.name, pos, pos + file.text.length);

      var text = file.text, m;
      if (m = text.match(/(?:"([^"]*)"|([\w$]+))\s*:\s*function\b/)) {
        var objNode = walk.findNodeAround(file.backing.ast, pos, "ObjectExpression");
        if (objNode && objNode.node.objType)
          inObject = {type: objNode.node.objType, prop: m[2] || m[1]};
      }
      if (foundPos && (m = line.match(/^(.*?)\bfunction\b/))) {
        var cut = m[1].length, white = "";
        for (var i = 0; i < cut; ++i) white += " ";
        file.text = white + text.slice(cut);
        atFunction = true;
      }

      var scopeStart = infer.scopeAt(realFile.ast, pos, realFile.scope);
      var scopeEnd = infer.scopeAt(realFile.ast, pos + text.length, realFile.scope);
      var scope = file.scope = scopeDepth(scopeStart) < scopeDepth(scopeEnd) ? scopeEnd : scopeStart;
      file.ast = parseFile(srv, file);
      infer.analyze(file.ast, file.name, scope);

      // This is a kludge to tie together the function types (if any)
      // outside and inside of the fragment, so that arguments and
      // return values have some information known about them.
      tieTogether: {
        if (inObject || atFunction) {
          var newInner = infer.scopeAt(file.ast, line.length, scopeStart);
          if (!newInner.fnType) break tieTogether;
          if (inObject) {
            var prop = inObject.type.getProp(inObject.prop);
            prop.addType(newInner.fnType);
          } else if (atFunction) {
            var inner = infer.scopeAt(realFile.ast, pos + line.length, realFile.scope);
            if (inner == scopeStart || !inner.fnType) break tieTogether;
            var fOld = inner.fnType, fNew = newInner.fnType;
            if (!fNew || (fNew.name != fOld.name && fOld.name)) break tieTogether;
            for (var i = 0, e = Math.min(fOld.args.length, fNew.args.length); i < e; ++i)
              fOld.args[i].propagate(fNew.args[i]);
            fOld.self.propagate(fNew.self);
            fNew.retval.propagate(fOld.retval);
          }
        }
      }
    });
    return file;
  }

  // Budget management

  function astSize(node) {
    var size = 0;
    walk.simple(node, {Expression: function() { ++size; }});
    return size;
  }

  function parentDepth(srv, parent) {
    var depth = 0;
    while (parent) {
      parent = srv.fileMap[parent].parent;
      ++depth;
    }
    return depth;
  }

  function budgetName(srv, file) {
    for (;;) {
      var parent = srv.fileMap[file.parent];
      if (!parent.parent) break;
      file = parent;
    }
    return file.name;
  }

  function chargeOnBudget(srv, file) {
    var bName = budgetName(srv, file);
    var size = astSize(file.ast);
    var known = srv.budgets[bName];
    if (known == null)
      known = srv.budgets[bName] = srv.options.dependencyBudget;
    if (known < size) return false;
    srv.budgets[bName] = known - size;
    return true;
  }

  // Query helpers

  function isPosition(val) {
    return typeof val == "number" || typeof val == "object" &&
      typeof val.line == "number" && typeof val.ch == "number";
  }

  // Baseline query document validation
  function invalidDoc(doc) {
    if (doc.query) {
      if (typeof doc.query.type != "string") return ".query.type must be a string";
      if (doc.query.start && !isPosition(doc.query.start)) return ".query.start must be a position";
      if (doc.query.end && !isPosition(doc.query.end)) return ".query.end must be a position";
    }
    if (doc.files) {
      if (!Array.isArray(doc.files)) return "Files property must be an array";
      for (var i = 0; i < doc.files.length; ++i) {
        var file = doc.files[i];
        if (typeof file != "object") return ".files[n] must be objects";
        else if (typeof file.name != "string") return ".files[n].name must be a string";
        else if (file.type == "delete") continue;
        else if (typeof file.text != "string") return ".files[n].text must be a string";
        else if (file.type == "part") {
          if (!isPosition(file.offset) && typeof file.offsetLines != "number")
            return ".files[n].offset must be a position";
        } else if (file.type != "full") return ".files[n].type must be \"full\" or \"part\"";
      }
    }
  }

  var offsetSkipLines = 25;

  function forwardCharacters(file, start, chars) {
    var pos = start + chars, m;
    if (file.hasAstral) {
      astral.lastIndex = start;
      while ((m = astral.exec(file.text)) && m.index < pos) pos++;
    }
    return pos;
  }

  function findLineStart(file, line) {
    var text = file.text, offsets = file.lineOffsets || (file.lineOffsets = [0]);
    var pos = 0, curLine = 0;
    var storePos = Math.min(Math.floor(line / offsetSkipLines), offsets.length - 1);
    var pos = offsets[storePos], curLine = storePos * offsetSkipLines;

    while (curLine < line) {
      ++curLine;
      pos = text.indexOf("\n", pos) + 1;
      if (pos === 0) return null;
      if (curLine % offsetSkipLines === 0) offsets.push(pos);
    }
    return pos;
  }

  var resolvePos = exports.resolvePos = function(file, pos, tolerant) {
    if (typeof pos != "number") {
      var lineStart = findLineStart(file, pos.line);
      if (lineStart == null) {
        if (tolerant) pos = file.text.length;
        else throw ternError("File doesn't contain a line " + pos.line);
      } else {
        pos = forwardCharacters(file, lineStart, pos.ch);
      }
    } else {
      pos = forwardCharacters(file, 0, pos);
    }
    if (pos > file.text.length) {
      if (tolerant) pos = file.text.length;
      else throw ternError("Position " + pos + " is outside of file.");
    }
    return pos;
  };

  function charDistanceBetween(file, start, end) {
    var diff = end - start, m;
    if (file.hasAstral) {
      astral.lastIndex = start;
      while ((m = astral.exec(file.text)) && m.index < end) diff--;
    }
    return diff;
  }

  function asLineChar(file, pos) {
    if (!file) return {line: 0, ch: 0};
    var offsets = file.lineOffsets || (file.lineOffsets = [0]);
    var text = file.text, line, lineStart;
    for (var i = offsets.length - 1; i >= 0; --i) if (offsets[i] <= pos) {
      line = i * offsetSkipLines;
      lineStart = offsets[i];
    }
    for (;;) {
      var eol = text.indexOf("\n", lineStart);
      if (eol >= pos || eol < 0) break;
      lineStart = eol + 1;
      ++line;
    }
    return {line: line, ch: charDistanceBetween(file, lineStart, pos)};
  }

  var outputPos = exports.outputPos = function(query, file, pos) {
    if (query.lineCharPositions) {
      var out = asLineChar(file, pos);
      if (file.type == "part")
        out.line += file.offsetLines != null ? file.offsetLines : asLineChar(file.backing, file.offset).line;
      return out;
    } else {
      return charDistanceBetween(file, 0, pos) + (file.type == "part" ? file.offset : 0);
    }
  };

  // Delete empty fields from result objects
  function clean(obj) {
    for (var prop in obj) if (obj[prop] == null) delete obj[prop];
    return obj;
  }
  function maybeSet(obj, prop, val) {
    if (val != null) obj[prop] = val;
  }

  // Built-in query types

  function compareCompletions(a, b) {
    if (typeof a != "string") { a = a.name; b = b.name; }
    var aUp = /^[A-Z]/.test(a), bUp = /^[A-Z]/.test(b);
    if (aUp == bUp) return a < b ? -1 : a == b ? 0 : 1;
    else return aUp ? 1 : -1;
  }

  function isStringAround(node, start, end) {
    return node.type == "Literal" && typeof node.value == "string" &&
      node.start == start - 1 && node.end <= end + 1;
  }

  function pointInProp(objNode, point) {
    for (var i = 0; i < objNode.properties.length; i++) {
      var curProp = objNode.properties[i];
      if (curProp.key && curProp.key.start <= point && curProp.key.end >= point)
        return curProp;
    }
  }

  var jsKeywords = ("break do instanceof typeof case else new var " +
    "catch finally return void continue for switch while debugger " +
    "function this with default if throw delete in try").split(" ");
  var jsKeywordsES6 = jsKeywords.concat("export class extends const super yield import let static".split(" "));

  var addCompletion = exports.addCompletion = function(query, completions, name, aval, depth) {
    var typeInfo = query.types || query.docs || query.urls || query.origins;
    var wrapAsObjs = typeInfo || query.depths;

    for (var i = 0; i < completions.length; ++i) {
      var c = completions[i];
      if ((wrapAsObjs ? c.name : c) == name) return;
    }
    var rec = wrapAsObjs ? {name: name} : name;
    completions.push(rec);

    if (aval && typeInfo) {
      infer.resetGuessing();
      var type = aval.getType();
      rec.guess = infer.didGuess();
      if (query.types)
        rec.type = infer.toString(aval);
      if (query.docs)
        maybeSet(rec, "doc", parseDoc(query, aval.doc || type && type.doc));
      if (query.urls)
        maybeSet(rec, "url", aval.url || type && type.url);
      if (query.origins)
        maybeSet(rec, "origin", aval.origin || type && type.origin);
    }
    if (query.depths) rec.depth = depth || 0;
    return rec;
  };

  function findCompletions(srv, query, file) {
    if (query.end == null) throw ternError("missing .query.end field");
    var fromPlugin = srv.signalReturnFirst("completion", file, query);
    if (fromPlugin) return fromPlugin;

    var wordStart = resolvePos(file, query.end), wordEnd = wordStart, text = file.text;
    while (wordStart && acorn.isIdentifierChar(text.charCodeAt(wordStart - 1))) --wordStart;
    if (query.expandWordForward !== false)
      while (wordEnd < text.length && acorn.isIdentifierChar(text.charCodeAt(wordEnd))) ++wordEnd;
    var word = text.slice(wordStart, wordEnd), completions = [], ignoreObj;
    if (query.caseInsensitive) word = word.toLowerCase();

    function gather(prop, obj, depth, addInfo) {
      // 'hasOwnProperty' and such are usually just noise, leave them
      // out when no prefix is provided.
      if ((objLit || query.omitObjectPrototype !== false) && obj == srv.cx.protos.Object && !word) return;
      if (query.filter !== false && word &&
          (query.caseInsensitive ? prop.toLowerCase() : prop).indexOf(word) !== 0) return;
      if (ignoreObj && ignoreObj.props[prop]) return;
      var result = addCompletion(query, completions, prop, obj && obj.props[prop], depth);
      if (addInfo && result && typeof result != "string") addInfo(result);
    }

    var hookname, prop, objType, isKey;

    var exprAt = infer.findExpressionAround(file.ast, null, wordStart, file.scope);
    var memberExpr, objLit;
    // Decide whether this is an object property, either in a member
    // expression or an object literal.
    if (exprAt) {
      var exprNode = exprAt.node;

      if (query.inLiteral === false && exprNode.type === "Literal" &&
          (typeof exprNode.value === 'string' || exprNode.regex))
        return {
          start: outputPos(query, file, wordStart),
          end: outputPos(query, file, wordEnd),
          completions: []
        };

      if (exprNode.type == "MemberExpression" && exprNode.object.end < wordStart) {
        memberExpr = exprAt;
      } else if (isStringAround(exprNode, wordStart, wordEnd)) {
        var parent = infer.parentNode(exprNode, file.ast);
        if (parent.type == "MemberExpression" && parent.property == exprNode)
          memberExpr = {node: parent, state: exprAt.state};
      } else if (exprNode.type == "ObjectExpression") {
        var objProp = pointInProp(exprNode, wordEnd);
        if (objProp) {
          objLit = exprAt;
          prop = isKey = objProp.key.name || objProp.key.value;
        } else if (!word && !/:\s*$/.test(file.text.slice(0, wordStart))) {
          objLit = exprAt;
          prop = isKey = true;
        }
      }
    }

    if (objLit) {
      // Since we can't use the type of the literal itself to complete
      // its properties (it doesn't contain the information we need),
      // we have to try asking the surrounding expression for type info.
      objType = infer.typeFromContext(file.ast, objLit);
      ignoreObj = objLit.node.objType;
    } else if (memberExpr) {
      prop = memberExpr.node.property;
      prop = prop.type == "Literal" ? prop.value.slice(1) : prop.name;
      memberExpr.node = memberExpr.node.object;
      objType = infer.expressionType(memberExpr);
    } else if (text.charAt(wordStart - 1) == ".") {
      var pathStart = wordStart - 1;
      while (pathStart && (text.charAt(pathStart - 1) == "." || acorn.isIdentifierChar(text.charCodeAt(pathStart - 1)))) pathStart--;
      var path = text.slice(pathStart, wordStart - 1);
      if (path) {
        objType = infer.def.parsePath(path, file.scope).getObjType();
        prop = word;
      }
    }

    if (prop != null) {
      srv.cx.completingProperty = prop;

      if (objType) infer.forAllPropertiesOf(objType, gather);

      if (!completions.length && query.guess !== false && objType && objType.guessProperties)
        objType.guessProperties(function(p, o, d) {if (p != prop && p != "✖" && p != "<i>") gather(p, o, d);});
      if (!completions.length && word.length >= 2 && query.guess !== false)
        for (var prop in srv.cx.props) gather(prop, srv.cx.props[prop][0], 0);
      hookname = "memberCompletion";
    } else {
      infer.forAllLocalsAt(file.ast, wordStart, file.scope, gather);
      if (query.includeKeywords) {
        (srv.options.ecmaVersion >= 6 ? jsKeywordsES6 : jsKeywords).forEach(function(kw) {
          gather(kw, null, 0, function(rec) { rec.isKeyword = true; });
        });
      }
      hookname = "variableCompletion";
    }
    srv.signal(hookname, file, wordStart, wordEnd, gather);

    if (query.sort !== false) completions.sort(compareCompletions);
    srv.cx.completingProperty = null;

    return {start: outputPos(query, file, wordStart),
            end: outputPos(query, file, wordEnd),
            isProperty: !!prop,
            isObjectKey: !!isKey,
            completions: completions};
  }

  function findProperties(srv, query) {
    var prefix = query.prefix, found = [];
    for (var prop in srv.cx.props)
      if (prop != "<i>" && (!prefix || prop.indexOf(prefix) === 0)) found.push(prop);
    if (query.sort !== false) found.sort(compareCompletions);
    return {completions: found};
  }

  function inBody(node, pos) {
    var body = node.body, start, end;
    if (!body) return false;
    if (Array.isArray(body)) {
      start = body[0].start;
      end = body[body.length - 1].end;
    } else {
      start = body.start;
      end = body.end;
    }
    return start <= pos && end >= pos;
  }

  var findExpr = exports.findQueryExpr = function(file, query, wide) {
    if (query.end == null) throw ternError("missing .query.end field");

    if (query.variable) {
      var scope = infer.scopeAt(file.ast, resolvePos(file, query.end), file.scope);
      return {node: {type: "Identifier", name: query.variable, start: query.end, end: query.end + 1},
              state: scope};
    } else {
      var start = query.start && resolvePos(file, query.start), end = resolvePos(file, query.end);
      var expr = infer.findExpressionAt(file.ast, start, end, file.scope);
      if (!expr) {
        var span = infer.findClosestExpression(file.ast, start, end, file.scope);
        if (span && !inBody(span.node, end) &&
            (wide || (start == null ? end : start) - span.node.start < 20 || span.node.end - end < 20))
          expr = span;
      }
      if (!expr) {
        var around = infer.findExpressionAround(file.ast, start, end, file.scope);
        if (around && !inBody(around.node, end) &&
            (around.node.type == "ObjectExpression" || wide ||
             (start == null ? end : start) - around.node.start < 20 || around.node.end - end < 20))
          expr = around;
      }
      return expr;
    }
  };

  function findExprAround(file, query, wide) {
    var start = query.start && resolvePos(file, query.start), end = resolvePos(file, query.end);
    var expr = null;
    var around = infer.findExpressionAround(file.ast, start, end, file.scope);
    if (around && !inBody(around.node, end) &&
        (around.node.type == "ObjectExpression" || wide ||
         (start == null ? end : start) - around.node.start < 20 || around.node.end - end < 20))
      expr = around;
    return expr;
  }

  function findExprOrThrow(file, query, wide) {
    var expr = findExpr(file, query, wide);
    if (expr) return expr;
    throw ternError("No expression at the given position.");
  }

  function ensureObj(tp) {
    if (!tp || !(tp = tp.getType()) || !(tp instanceof infer.Obj)) return null;
    return tp;
  }

  function findExprType(srv, query, file, expr) {
    var type;
    if (expr) {
      infer.resetGuessing();
      type = infer.expressionType(expr);
    }
    var typeHandlers = srv.hasHandler("typeAt");
    if (typeHandlers) {
      var pos = resolvePos(file, query.end);
      for (var i = 0; i < typeHandlers.length; i++)
        type = typeHandlers[i](file, pos, expr, type);
    }
    if (!type) throw ternError("No type found at the given position.");

    var objProp;
    if (expr.node.type == "ObjectExpression" && query.end != null &&
        (objProp = pointInProp(expr.node, resolvePos(file, query.end)))) {
      var name = objProp.key.name;
      var fromCx = ensureObj(infer.typeFromContext(file.ast, expr));
      if (fromCx && fromCx.hasProp(name)) {
        type = fromCx.hasProp(name);
      } else {
        var fromLocal = ensureObj(type);
        if (fromLocal && fromLocal.hasProp(name))
          type = fromLocal.hasProp(name);
      }
    }
    return type;
  }

  function findTypeAtExpr(srv, query, file, expr) {
    var exprName, exprType;
    var type = findExprType(srv, query, file, expr), exprType = type;
    if (query.preferFunction)
      type = type.getFunctionType() || type.getType();
    else
      type = type.getType();

    if (expr) {
      if (expr.node.type == "Identifier")
        exprName = expr.node.name;
      else if (expr.node.type == "MemberExpression" && !expr.node.computed)
        exprName = expr.node.property.name;
      else if (expr.node.type == "MethodDefinition" && !expr.node.computed)
        exprName = expr.node.key.name;
    }

    if (query.depth != null && typeof query.depth != "number")
      throw ternError(".query.depth must be a number");

    return [type, exprName, exprType];
  }

  function findTypeAt(srv, query, file) {
    var type, exprName, exprType;
    var expr = findExpr(file, query);
    var typeResult = findTypeAtExpr(srv, query, file, expr);
    type = typeResult[0];
    if (!type) {
      expr = findExprAround(file, query);
      typeResult = findTypeAtExpr(srv, query, file, expr);
      type = typeResult[0];
    }
    exprName = typeResult[1];
    exprType = typeResult[2];

    var result = {guess: infer.didGuess(),
                  type: infer.toString(exprType, query.depth),
                  name: type && type.name,
                  exprName: exprName,
                  doc: exprType.doc,
                  url: exprType.url};
    if (type) storeTypeDocs(query, type, result);

    return clean(result);
  }

  function parseDoc(query, doc) {
    if (!doc) return null;
    if (query.docFormat == "full") return doc;
    var parabreak = /.\n[\s@\n]/.exec(doc);
    if (parabreak) doc = doc.slice(0, parabreak.index + 1);
    doc = doc.replace(/\n\s*/g, " ");
    if (doc.length < 100) return doc;
    var sentenceEnd = /[\.!?] [A-Z]/g;
    sentenceEnd.lastIndex = 80;
    var found = sentenceEnd.exec(doc);
    if (found) doc = doc.slice(0, found.index + 1);
    return doc;
  }

  function findDocs(srv, query, file) {
    var expr = findExpr(file, query);
    var type = findExprType(srv, query, file, expr);
    var inner = type.getType();
    if (!inner) {
      expr = findExprAround(file, query);
      type = findExprType(srv, query, file, expr);
      inner = type.getType();
    }
    var result = {url: type.url, doc: parseDoc(query, type.doc), type: infer.toString(type)};
    if (inner) storeTypeDocs(query, inner, result);
    return clean(result);
  }

  function storeTypeDocs(query, type, out) {
    if (!out.url) out.url = type.url;
    if (!out.doc) out.doc = parseDoc(query, type.doc);
    if (!out.origin) out.origin = type.origin;
    var ctor, boring = infer.cx().protos;
    if (!out.url && !out.doc && type.proto && (ctor = type.proto.hasCtor) &&
        type.proto != boring.Object && type.proto != boring.Function && type.proto != boring.Array) {
      out.url = ctor.url;
      out.doc = parseDoc(query, ctor.doc);
    }
  }

  var getSpan = exports.getSpan = function(obj) {
    if (!obj.origin) return;
    if (obj.originNode) {
      var node = obj.originNode;
      if (/^Function/.test(node.type) && node.id) node = node.id;
      return {origin: obj.origin, node: node};
    }
    if (obj.span) return {origin: obj.origin, span: obj.span};
  };

  var storeSpan = exports.storeSpan = function(srv, query, span, target) {
    target.origin = span.origin;
    if (span.span) {
      var m = /^(\d+)\[(\d+):(\d+)\]-(\d+)\[(\d+):(\d+)\]$/.exec(span.span);
      target.start = query.lineCharPositions ? {line: Number(m[2]), ch: Number(m[3])} : Number(m[1]);
      target.end = query.lineCharPositions ? {line: Number(m[5]), ch: Number(m[6])} : Number(m[4]);
    } else {
      var file = srv.fileMap[span.origin];
      target.start = outputPos(query, file, span.node.start);
      target.end = outputPos(query, file, span.node.end);
    }
  };

  function findDef(srv, query, file) {
    var expr = findExpr(file, query);
    var type = findExprType(srv, query, file, expr);
    if (infer.didGuess()) return {};

    var span = getSpan(type);
    var result = {url: type.url, doc: parseDoc(query, type.doc), origin: type.origin};

    if (type.types) for (var i = type.types.length - 1; i >= 0; --i) {
      var tp = type.types[i];
      storeTypeDocs(query, tp, result);
      if (!span) span = getSpan(tp);
    }

    if (span && span.node) { // refers to a loaded file
      var spanFile = span.node.sourceFile || srv.fileMap[span.origin];
      var start = outputPos(query, spanFile, span.node.start), end = outputPos(query, spanFile, span.node.end);
      result.start = start; result.end = end;
      result.file = span.origin;
      var cxStart = Math.max(0, span.node.start - 50);
      result.contextOffset = span.node.start - cxStart;
      result.context = spanFile.text.slice(cxStart, cxStart + 50);
    } else if (span) { // external
      result.file = span.origin;
      storeSpan(srv, query, span, result);
    }
    return clean(result);
  }

  function findRefsToVariable(srv, query, file, expr, isRename) {
    var name = expr.node.name;

    for (var scope = expr.state; scope && !(name in scope.props); scope = scope.prev) {}
    if (!scope) throw ternError("Could not find a definition for " + name);

    var type, refs = [];
    function storeRef(file) {
      return function(node, scopeHere, ancestors) {
        var value = {file: file.name,
                     start: outputPos(query, file, node.start),
                     end: outputPos(query, file, node.end)};
        if (isRename) {
          for (var s = scopeHere; s != scope; s = s.prev) {
            var exists = s.hasProp(isRename);
            if (exists)
              throw ternError("Renaming `" + name + "` to `" + isRename + "` would make a variable at line " +
                              (asLineChar(file, node.start).line + 1) + " point to the definition at line " +
                              (asLineChar(file, exists.name.start).line + 1));
          }
          var parent = ancestors[ancestors.length - 2];
          if (parent && parent.type == "Property" && parent.key == parent.value)
            value.isShorthand = true;
        }
        refs.push(value);
      };
    }

    if (scope.originNode) {
      type = "local";
      if (isRename) {
        for (var prev = scope.prev; prev; prev = prev.prev)
          if (isRename in prev.props) break;
        if (prev) infer.findRefs(scope.originNode, scope, isRename, prev, function(node) {
          throw ternError("Renaming `" + name + "` to `" + isRename + "` would shadow the definition used at line " +
                          (asLineChar(file, node.start).line + 1));
        });
      }
      infer.findRefs(scope.originNode, scope, name, scope, storeRef(file));
    } else {
      type = "global";
      if (query.onlySourceFile) {
        infer.findRefs(file.ast, file.scope, name, scope, storeRef(file));
      } else {
        for (var i = 0; i < srv.files.length; ++i) {
          var cur = srv.files[i];
          infer.findRefs(cur.ast, cur.scope, name, scope, storeRef(cur));
        }
      }
    }

    return {refs: refs, type: type, name: name};
  }

  function findRefsToProperty(srv, query, sourceFile, expr, prop) {
    var exprType = infer.expressionType(expr);
    if (expr.node.type == "MethodDefinition") {
      exprType = exprType.propertyOf;
    }
    var objType = exprType.getObjType();
    if (!objType) throw ternError("Couldn't determine type of base object.");

    var refs = [];
    function storeRef(file) {
      return function(node) {
        refs.push({file: file.name,
                   start: outputPos(query, file, node.start),
                   end: outputPos(query, file, node.end)});
      };
    }

    if (query.onlySourceFile) {
        infer.findPropRefs(sourceFile.ast, sourceFile.scope, objType, prop.name, storeRef(sourceFile));
    } else {
      for (var i = 0; i < srv.files.length; ++i) {
        var cur = srv.files[i];
        infer.findPropRefs(cur.ast, cur.scope, objType, prop.name, storeRef(cur));
      }
    }

    return {refs: refs, name: prop.name};
  }

  function findRefs(srv, query, file) {
    var expr = findExprOrThrow(file, query, true);
    if (expr && expr.node.type == "Identifier") {
      return findRefsToVariable(srv, query, file, expr);
    } else if (expr && expr.node.type == "MemberExpression" && !expr.node.computed) {
      var p = expr.node.property;
      expr.node = expr.node.object;
      return findRefsToProperty(srv, query, file, expr, p);
    } else if (expr && expr.node.type == "ObjectExpression") {
      var pos = resolvePos(file, query.end);
      for (var i = 0; i < expr.node.properties.length; ++i) {
        var k = expr.node.properties[i].key;
        if (k.start <= pos && k.end >= pos)
          return findRefsToProperty(srv, query, file, expr, k);
      }
    } else if (expr && expr.node.type == "MethodDefinition") {
      var p = expr.node.key;
      return findRefsToProperty(srv, query, file, expr, p);
    }
    throw ternError("Not at a variable or property name.");
  }

  function buildRename(srv, query, file) {
    if (typeof query.newName != "string") throw ternError(".query.newName should be a string");
    var expr = findExprOrThrow(file, query);
    if (!expr || expr.node.type != "Identifier") throw ternError("Not at a variable.");

    var data = findRefsToVariable(srv, query, file, expr, query.newName), refs = data.refs;
    delete data.refs;
    data.files = srv.files.map(function(f){return f.name;});

    var changes = data.changes = [];
    for (var i = 0; i < refs.length; ++i) {
      var use = refs[i];
      if (use.isShorthand) use.text = expr.node.name + ": " + query.newName;
      else use.text = query.newName;
      changes.push(use);
    }

    return data;
  }

  function listFiles(srv) {
    return {files: srv.files.map(function(f){return f.name;})};
  }

  exports.version = "0.24.3";
});

// Type description parser
//
// Type description JSON files (such as ecmascript.json and browser.json)
// are used to
//
// A) describe types that come from native code
//
// B) to cheaply load the types for big libraries, or libraries that
//    can't be inferred well

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return exports.init = mod;
  if (typeof define == "function" && define.amd) // AMD
    return define({init: mod});
  tern.def = {init: mod};
})(function(exports, infer) {
  "use strict";

  function hop(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  var TypeParser = exports.TypeParser = function(spec, start, base, forceNew) {
    this.pos = start || 0;
    this.spec = spec;
    this.base = base;
    this.forceNew = forceNew;
  };

  function unwrapType(type, self, args) {
    return type.call ? type(self, args) : type;
  }

  function extractProp(type, prop) {
    if (prop == "!ret") {
      if (type.retval) return type.retval;
      var rv = new infer.AVal;
      type.propagate(new infer.IsCallee(infer.ANull, [], null, rv));
      return rv;
    } else {
      return type.getProp(prop);
    }
  }

  function computedFunc(name, args, retType, generator) {
    return function(self, cArgs) {
      var realArgs = [];
      for (var i = 0; i < args.length; i++) realArgs.push(unwrapType(args[i], self, cArgs));
      return new infer.Fn(name, infer.ANull, realArgs, unwrapType(retType, self, cArgs), generator);
    };
  }
  function computedUnion(types) {
    return function(self, args) {
      var union = new infer.AVal;
      for (var i = 0; i < types.length; i++) unwrapType(types[i], self, args).propagate(union);
      union.maxWeight = 1e5;
      return union;
    };
  }
  function computedArray(inner) {
    return function(self, args) {
      return new infer.Arr(inner(self, args));
    };
  }
  function computedTuple(types) {
    return function(self, args) {
      return new infer.Arr(types.map(function(tp) { return unwrapType(tp, self, args) }));
    };
  }
  function computedObject(names, types) {
    return function(self, args) {
      var obj = new infer.Obj;
      names.forEach(function (prop, i) {
        obj.defProp(prop).addType(unwrapType(types[i], self, args));
      });
      return obj;
    };
  }

  TypeParser.prototype = {
    eat: function(str) {
      if (str.length == 1 ? this.spec.charAt(this.pos) == str : this.spec.indexOf(str, this.pos) == this.pos) {
        this.pos += str.length;
        return true;
      }
    },
    word: function(re) {
      var word = "", ch, re = re || /[\w$]/;
      while ((ch = this.spec.charAt(this.pos)) && re.test(ch)) { word += ch; ++this.pos; }
      return word;
    },
    error: function() {
      throw new Error("Unrecognized type spec: " + this.spec + " (at " + this.pos + ")");
    },
    parseFnType: function(comp, name, top, generator) {
      var args = [], names = [], computed = false;
      if (!this.eat(")")) for (var i = 0; ; ++i) {
        var colon = this.spec.indexOf(": ", this.pos), argname;
        if (colon != -1) {
          argname = this.spec.slice(this.pos, colon);
          if (/^(\.\.\.)?[$\w?]+$/.test(argname))
            this.pos = colon + 2;
          else
            argname = null;
        }
        names.push(argname);
        var argType = this.parseType(comp);
        if (argType.call) computed = true;
        args.push(argType);
        if (!this.eat(", ")) {
          this.eat(")") || this.error();
          break;
        }
      }
      var retType, computeRet, computeRetStart, fn;
      if (this.eat(" -> ")) {
        var retStart = this.pos;
        retType = this.parseType(true);
        if (retType.call && !computed) {
          computeRet = retType;
          retType = infer.ANull;
          computeRetStart = retStart;
        }
      } else {
        retType = infer.ANull;
      }
      if (computed) return computedFunc(name, args, retType, generator);

      if (top && (fn = this.base))
        infer.Fn.call(this.base, name, infer.ANull, args, names, retType, generator);
      else
        fn = new infer.Fn(name, infer.ANull, args, names, retType, generator);
      if (computeRet) fn.computeRet = computeRet;
      if (computeRetStart != null) fn.computeRetSource = this.spec.slice(computeRetStart, this.pos);
      return fn;
    },
    parseType: function(comp, name, top) {
      var main = this.parseTypeMaybeProp(comp, name, top);
      if (!this.eat("|")) return main;
      var types = [main], computed = main.call;
      for (;;) {
        var next = this.parseTypeMaybeProp(comp, name, top);
        types.push(next);
        if (next.call) computed = true;
        if (!this.eat("|")) break;
      }
      if (computed) return computedUnion(types);
      var union = new infer.AVal;
      for (var i = 0; i < types.length; i++) types[i].propagate(union);
      union.maxWeight = 1e5;
      return union;
    },
    parseTypeMaybeProp: function(comp, name, top) {
      var result = this.parseTypeInner(comp, name, top);
      while (comp && this.eat(".")) result = this.extendWithProp(result);
      return result;
    },
    extendWithProp: function(base) {
      var propName = this.word(/[\w<>$!:]/) || this.error();
      if (base.apply) return function(self, args) {
        return extractProp(base(self, args), propName);
      };
      return extractProp(base, propName);
    },
    parseTypeInner: function(comp, name, top) {
      var gen;
      if (this.eat("fn(") || (gen = this.eat("fn*("))) {
        return this.parseFnType(comp, name, top, gen);
      } else if (this.eat("[")) {
        var inner = this.parseType(comp), types, computed = inner.call;
        while (this.eat(", ")) {
          if (!types) types = [inner];
          var next = this.parseType(comp);
          types.push(next);
          computed = computed || next.call;
        }
        this.eat("]") || this.error();
        if (computed) return types ? computedTuple(types) : computedArray(inner);
        if (top && this.base) {
          infer.Arr.call(this.base, types || inner);
          return this.base;
        }
        return new infer.Arr(types || inner);
      } else if (this.eat("{")) {
        var types = [], names = [], computed = false;
        if (!this.eat("}")) {
          for (var i = 0; ; ++i) {
            var colon = this.spec.indexOf(": ", this.pos), propName;
            if (colon != -1) {
              propName = this.spec.slice(this.pos, colon);
              if (/^[$\w?]+$/.test(propName))
                this.pos = colon + 2;
              else
                propName = null;
            }
            var propType = this.parseType(comp);
            if (propType.call) computed = true;
            names.push(propName);
            types.push(propType);
            if (!this.eat(", ")) {
              this.eat("}") || this.error();
              break;
            }
          }
        }
        if (computed) return computedObject(names, types);
        var obj = new infer.Obj;
        names.forEach(function (prop, i) {
          obj.defProp(prop).addType(types[i]);
        });
        return obj;
      } else if (this.eat("+")) {
        var path = this.word(/[\w$<>\.:!]/);
        var base = infer.cx().localDefs[path + ".prototype"];
        if (!base) {
          var base = parsePath(path);
          if (!(base instanceof infer.Obj)) return base;
          var proto = descendProps(base, ["prototype"]);
          if (proto && (proto = proto.getObjType()))
            base = proto;
        }
        if (comp && this.eat("[")) return this.parsePoly(base);
        if (top && this.base) {
          this.base.proto = base;
          var name = base.hasCtor && base.hasCtor.name || base.name;
          if (name) this.base.name = name;
          return this.base;
        }
        if (top && this.forceNew) return new infer.Obj(base);
        return infer.getInstance(base);
      } else if (this.eat(":")) {
        var name = this.word(/[\w$\.]/);
        return infer.getSymbol(name);
      } else if (comp && this.eat("!")) {
        var arg = this.word(/\d/);
        if (arg) {
          arg = Number(arg);
          return function(_self, args) {return args[arg] || infer.ANull;};
        } else if (this.eat("this")) {
          return function(self) {return self;};
        } else if (this.eat("custom:")) {
          var fname = this.word(/[\w$]/);
          return customFunctions[fname] || function() { return infer.ANull; };
        } else {
          return this.fromWord("!" + this.word(/[\w$<>\.!:]/));
        }
      } else if (this.eat("?")) {
        return infer.ANull;
      } else {
        return this.fromWord(this.word(/[\w$<>\.!:`]/));
      }
    },
    fromWord: function(spec) {
      var cx = infer.cx();
      switch (spec) {
      case "number": return cx.num;
      case "string": return cx.str;
      case "bool": return cx.bool;
      case "<top>": return cx.topScope;
      }
      if (cx.localDefs && spec in cx.localDefs) return cx.localDefs[spec];
      return parsePath(spec);
    },
    parsePoly: function(base) {
      var propName = "<i>", match;
      if (match = this.spec.slice(this.pos).match(/^\s*([\w$:]+)\s*=\s*/)) {
        propName = match[1];
        this.pos += match[0].length;
      }
      var value = this.parseType(true);
      if (!this.eat("]")) this.error();
      if (value.call) return function(self, args) {
        var instance = new infer.Obj(base);
        value(self, args).propagate(instance.defProp(propName));
        return instance;
      };
      var instance = new infer.Obj(base);
      value.propagate(instance.defProp(propName));
      return instance;
    }
  };

  function addArgCallEffects(type) {
    if (type instanceof infer.Fn && type.args) for (var i = 0; i < type.args.length; ++i) {
      var arg = type.args[i];
      if (arg instanceof infer.Fn && arg.args && arg.args.length) addArgCallEffect(type, i);
    }
  }

  function addArgCallEffect(type, argNum) {
    addEffect(type, function(_self, args) {
      if (args[argNum]) args[argNum].propagate(
        new infer.IsCallee(infer.cx().topScope, type.args[argNum].args, null, infer.ANull));
    });
  }

  function parseType(spec, name, base, forceNew) {
    var type = new TypeParser(spec, null, base, forceNew).parseType(false, name, true);
    if (type instanceof infer.AVal) type.types.forEach(addArgCallEffects);
    else addArgCallEffects(type);
    return type;
  }

  function addEffect(fn, handler, replaceRet) {
    var oldCmp = fn.computeRet, rv = fn.retval;
    fn.computeRet = function(self, args, argNodes) {
      var handled = handler(self, args, argNodes);
      var old = oldCmp ? oldCmp(self, args, argNodes) : rv;
      return replaceRet ? handled : old;
    };
  }

  var parseEffect = exports.parseEffect = function(effect, fn) {
    var m;
    if (effect.indexOf("propagate ") == 0) {
      var p = new TypeParser(effect, 10);
      var origin = p.parseType(true);
      if (!p.eat(" ")) p.error();
      var target = p.parseType(true);
      addEffect(fn, function(self, args) {
        unwrapType(origin, self, args).propagate(unwrapType(target, self, args));
      });
    } else if (effect.indexOf("call ") == 0) {
      var andRet = effect.indexOf("and return ", 5) == 5;
      var p = new TypeParser(effect, andRet ? 16 : 5);
      var getCallee = p.parseType(true), getSelf = null, getArgs = [];
      if (p.eat(" this=")) getSelf = p.parseType(true);
      while (p.eat(" ")) getArgs.push(p.parseType(true));
      addEffect(fn, function(self, args) {
        var callee = unwrapType(getCallee, self, args);
        var slf = getSelf ? unwrapType(getSelf, self, args) : infer.ANull, as = [];
        for (var i = 0; i < getArgs.length; ++i) as.push(unwrapType(getArgs[i], self, args));
        var result = andRet ? new infer.AVal : infer.ANull;
        callee.propagate(new infer.IsCallee(slf, as, null, result));
        return result;
      }, andRet);
    } else if (m = effect.match(/^custom (\S+)\s*(.*)/)) {
      var customFunc = customFunctions[m[1]];
      if (customFunc) addEffect(fn, m[2] ? customFunc(m[2]) : customFunc);
    } else if (effect.indexOf("copy ") == 0) {
      var p = new TypeParser(effect, 5);
      var getFrom = p.parseType(true);
      p.eat(" ");
      var getTo = p.parseType(true);
      addEffect(fn, function(self, args) {
        var from = unwrapType(getFrom, self, args), to = unwrapType(getTo, self, args);
        from.forAllProps(function(prop, val, local) {
          if (local && prop != "<i>")
            to.propagate(new infer.DefProp(prop, val));
        });
      });
    } else {
      throw new Error("Unknown effect type: " + effect);
    }
  };

  var currentTopScope;

  var parsePath = exports.parsePath = function(path, scope) {
    var cx = infer.cx(), cached = cx.paths[path], origPath = path;
    if (cached != null) return cached;
    cx.paths[path] = infer.ANull;

    var base = scope || currentTopScope || cx.topScope;

    if (cx.localDefs) for (var name in cx.localDefs) {
      if (path.indexOf(name) == 0) {
        if (path == name) return cx.paths[path] = cx.localDefs[path];
        if (path.charAt(name.length) == ".") {
          base = cx.localDefs[name];
          path = path.slice(name.length + 1);
          break;
        }
      }
    }

    var result = descendProps(base, path.split("."));
    // Uncomment this to get feedback on your poorly written .json files
    // if (result == infer.ANull) console.error("bad path: " + origPath + " (" + cx.curOrigin + ")")
    cx.paths[origPath] = result == infer.ANull ? null : result;
    return result;
  };

  function descendProps(base, parts) {
    for (var i = 0; i < parts.length && base != infer.ANull; ++i) {
      var prop = parts[i];
      if (prop.charAt(0) == "!") {
        if (prop == "!proto") {
          base = (base instanceof infer.Obj && base.proto) || infer.ANull;
        } else {
          var fn = base.getFunctionType();
          if (!fn) {
            base = infer.ANull;
          } else if (prop == "!ret") {
            base = fn.retval && fn.retval.getType(false) || infer.ANull;
          } else {
            var arg = fn.args && fn.args[Number(prop.slice(1))];
            base = (arg && arg.getType(false)) || infer.ANull;
          }
        }
      } else if (base instanceof infer.Obj &&
                 (prop == "prototype" && base instanceof infer.Fn || base.hasProp(prop))) {
        var propVal = base.getProp(prop);
        if (!propVal || propVal.isEmpty())
          base = infer.ANull;
        else
          base = propVal.types[0];
      } else {
        base = infer.ANull;
      }
    }
    return base;
  }

  function emptyObj(ctor) {
    var empty = Object.create(ctor.prototype);
    empty.props = Object.create(null);
    empty.isShell = true;
    return empty;
  }

  function isSimpleAnnotation(spec) {
    if (!spec["!type"] || /^(fn\(|\[|\+)/.test(spec["!type"])) return false;
    for (var prop in spec)
      if (prop != "!type" && prop != "!doc" && prop != "!url" && prop != "!span" && prop != "!data")
        return false;
    return true;
  }

  function passOne(base, spec, path) {
    if (!base) {
      var tp = spec["!type"];
      if (tp) {
        if (/^fn\(/.test(tp)) base = emptyObj(infer.Fn);
        else if (tp.charAt(0) == "[") base = emptyObj(infer.Arr);
        else if (tp.charAt(0) == "+") base = emptyObj(infer.Obj);
        else throw new Error("Invalid !type spec: " + tp);
      } else if (spec["!stdProto"]) {
        base = infer.cx().protos[spec["!stdProto"]];
      } else {
        base = emptyObj(infer.Obj);
      }
      base.name = path;
    }

    for (var name in spec) if (hop(spec, name) && name.charCodeAt(0) != 33) {
      var inner = spec[name];
      if (typeof inner == "string" || isSimpleAnnotation(inner)) continue;
      var prop = base.defProp(name);
      passOne(prop.getObjType(), inner, path ? path + "." + name : name).propagate(prop);
    }
    return base;
  }

  function passTwo(base, spec, path) {
    if (base.isShell) {
      delete base.isShell;
      var tp = spec["!type"];
      if (tp) {
        parseType(tp, path, base);
      } else {
        var proto = spec["!proto"] && parseType(spec["!proto"]);
        infer.Obj.call(base, proto instanceof infer.Obj ? proto : true, path);
      }
    }

    var effects = spec["!effects"];
    if (effects && base instanceof infer.Fn) for (var i = 0; i < effects.length; ++i)
      parseEffect(effects[i], base);
    copyInfo(spec, base);

    for (var name in spec) if (hop(spec, name) && name.charCodeAt(0) != 33) {
      var inner = spec[name], known = base.defProp(name), innerPath = path ? path + "." + name : name;
      if (typeof inner == "string") {
        if (known.isEmpty()) parseType(inner, innerPath).propagate(known);
      } else {
        if (!isSimpleAnnotation(inner))
          passTwo(known.getObjType(), inner, innerPath);
        else if (known.isEmpty())
          parseType(inner["!type"], innerPath, null, true).propagate(known);
        else
          continue;
        if (inner["!doc"]) known.doc = inner["!doc"];
        if (inner["!url"]) known.url = inner["!url"];
        if (inner["!span"]) known.span = inner["!span"];
      }
    }
    return base;
  }

  function copyInfo(spec, type) {
    if (spec["!doc"]) type.doc = spec["!doc"];
    if (spec["!url"]) type.url = spec["!url"];
    if (spec["!span"]) type.span = spec["!span"];
    if (spec["!data"]) type.metaData = spec["!data"];
  }

  function doLoadEnvironment(data, scope) {
    var cx = infer.cx(), server = cx.parent;

    infer.addOrigin(cx.curOrigin = data["!name"] || "env#" + cx.origins.length);
    cx.localDefs = cx.definitions[cx.curOrigin] = Object.create(null);

    if (server) server.signal("preLoadDef", data);

    passOne(scope, data);

    var def = data["!define"];
    if (def) {
      for (var name in def) {
        var spec = def[name];
        cx.localDefs[name] = typeof spec == "string" ? parsePath(spec) : passOne(null, spec, name);
      }
      for (var name in def) {
        var spec = def[name];
        if (typeof spec != "string") passTwo(cx.localDefs[name], def[name], name);
      }
    }

    passTwo(scope, data);

    if (server) server.signal("postLoadDef", data);

    cx.curOrigin = cx.localDefs = null;
  }

  exports.load = function(data, scope) {
    if (!scope) scope = infer.cx().topScope;
    var oldScope = currentTopScope;
    currentTopScope = scope;
    try {
      doLoadEnvironment(data, scope);
    } finally {
      currentTopScope = oldScope;
    }
  };

  exports.parse = function(data, origin, path) {
    var cx = infer.cx();
    if (origin) {
      cx.origin = origin;
      cx.localDefs = cx.definitions[origin];
    }

    try {
      if (typeof data == "string")
        return parseType(data, path);
      else
        return passTwo(passOne(null, data, path), data, path);
    } finally {
      if (origin) cx.origin = cx.localDefs = null;
    }
  };

  // Used to register custom logic for more involved effect or type
  // computation.
  var customFunctions = Object.create(null);
  infer.registerFunction = function(name, f) { customFunctions[name] = f; };

  var IsCreated = infer.constraint({
    construct: function(created, target, spec) {
      this.created = created;
      this.target = target;
      this.spec = spec;
    },
    addType: function(tp) {
      if (tp instanceof infer.Obj && this.created++ < 5) {
        var derived = new infer.Obj(tp), spec = this.spec;
        if (spec instanceof infer.AVal) spec = spec.getObjType(false);
        if (spec instanceof infer.Obj) for (var prop in spec.props) {
          var cur = spec.props[prop].types[0];
          var p = derived.defProp(prop);
          if (cur && cur instanceof infer.Obj && cur.props.value) {
            var vtp = cur.props.value.getType(false);
            if (vtp) p.addType(vtp);
          }
        }
        this.target.addType(derived);
      }
    }
  });

  infer.registerFunction("Object_create", function(_self, args, argNodes) {
    if (argNodes && argNodes.length && argNodes[0].type == "Literal" && argNodes[0].value == null)
      return new infer.Obj();

    var result = new infer.AVal;
    if (args[0]) args[0].propagate(new IsCreated(0, result, args[1]));
    return result;
  });

  var PropSpec = infer.constraint({
    construct: function(target) { this.target = target; },
    addType: function(tp) {
      if (!(tp instanceof infer.Obj)) return;
      if (tp.hasProp("value"))
        tp.getProp("value").propagate(this.target);
      else if (tp.hasProp("get"))
        tp.getProp("get").propagate(new infer.IsCallee(infer.ANull, [], null, this.target));
    }
  });

  infer.registerFunction("Object_defineProperty", function(_self, args, argNodes) {
    if (argNodes && argNodes.length >= 3 && argNodes[1].type == "Literal" &&
        typeof argNodes[1].value == "string") {
      var obj = args[0], connect = new infer.AVal;
      obj.propagate(new infer.DefProp(argNodes[1].value, connect, argNodes[1]));
      args[2].propagate(new PropSpec(connect));
    }
    return infer.ANull;
  });

  infer.registerFunction("Object_defineProperties", function(_self, args, argNodes) {
    if (args.length >= 2) {
      var obj = args[0];
      args[1].forAllProps(function(prop, val, local) {
        if (!local) return;
        var connect = new infer.AVal;
        obj.propagate(new infer.DefProp(prop, connect, argNodes && argNodes[1]));
        val.propagate(new PropSpec(connect));
      });
    }
    return infer.ANull;
  });

  var IsBound = infer.constraint({
    construct: function(self, args, target) {
      this.self = self; this.args = args; this.target = target;
    },
    addType: function(tp) {
      if (!(tp instanceof infer.Fn)) return;
      this.target.addType(new infer.Fn(tp.name, infer.ANull, tp.args.slice(this.args.length),
                                       tp.argNames.slice(this.args.length), tp.retval, tp.generator));
      this.self.propagate(tp.self);
      for (var i = 0; i < Math.min(tp.args.length, this.args.length); ++i)
        this.args[i].propagate(tp.args[i]);
    }
  });

  infer.registerFunction("Function_bind", function(self, args) {
    if (!args.length) return infer.ANull;
    var result = new infer.AVal;
    self.propagate(new IsBound(args[0], args.slice(1), result));
    return result;
  });

  infer.registerFunction("Array_ctor", function(_self, args) {
    var arr = new infer.Arr;
    if (args.length != 1 || !args[0].hasType(infer.cx().num)) {
      var content = arr.getProp("<i>");
      for (var i = 0; i < args.length; ++i) args[i].propagate(content);
    }
    return arr;
  });

  function makePromise() {
    var defs = infer.cx().definitions.ecmascript;
    return defs && new infer.Obj(defs["Promise.prototype"]);
  }

  infer.registerFunction("Promise_ctor", function(_self, args, argNodes) {
    var self = makePromise();
    if (!self || args.length < 1) return infer.ANull;
    var valProp = self.defProp(":t", argNodes && argNodes[0]);
    var valArg = new infer.AVal;
    valArg.propagate(valProp);
    var exec = new infer.Fn("execute", infer.ANull, [valArg], ["value"], infer.ANull);
    var reject = infer.cx().definitions.ecmascript.Promise_reject;
    args[0].propagate(new infer.IsCallee(infer.ANull, [exec, reject], null, infer.ANull));
    return self;
  });

  // Definition for Promise.resolve()
  // The behavior is different for Promise and non-Promise arguments, so we
  // need a custom definition to handle the different cases properly.
  infer.registerFunction("Promise_resolve", function(_self, args, argNodes) {
    var self = makePromise();
    if (!self) return infer.ANull;
    if (args.length) {
      var valProp = self.defProp(":t", argNodes && argNodes[0]);
      var valArg = new infer.AVal;
      valArg.propagate(valProp);
      args[0].propagate(new PromiseResolvesTo(valArg));
    }
    return self;
  });

  var PromiseResolvesTo = infer.constraint({
    construct: function(output) { this.output = output; },
    addType: function(tp) {
      if (tp.constructor == infer.Obj && tp.name == "Promise" && tp.hasProp(":t"))
        tp.getProp(":t").propagate(this.output);
      else
        tp.propagate(this.output);
    }
  });

  var WG_PROMISE_KEEP_VALUE = 50;

  infer.registerFunction("Promise_then", function(self, args, argNodes) {
    var fn = args.length && args[0].getFunctionType();
    var defs = infer.cx().definitions.ecmascript;
    if (!fn || !defs) return self;

    var result = new infer.Obj(defs["Promise.prototype"]);
    var value = result.defProp(":t", argNodes && argNodes[0]), ty;
    if (fn.retval.isEmpty() && (ty = self.getType()) instanceof infer.Obj && ty.hasProp(":t"))
      ty.getProp(":t").propagate(value, WG_PROMISE_KEEP_VALUE);
    fn.retval.propagate(new PromiseResolvesTo(value));
    return result;
  });

  infer.registerFunction("getOwnPropertySymbols", function(_self, args) {
    if (!args.length) return infer.ANull;
    var result = new infer.AVal;
    args[0].forAllProps(function(prop, _val, local) {
      if (local && prop.charAt(0) == ":") result.addType(infer.getSymbol(prop.slice(1)));
    });
    return result;
  });

  infer.registerFunction("getSymbol", function(_self, _args, argNodes) {
    if (argNodes && argNodes.length && argNodes[0].type == "Literal" && typeof argNodes[0].value == "string")
      return infer.getSymbol(argNodes[0].value);
    else
      return infer.ANull;
  });

  return exports;
});

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(exports);
  if (typeof define == "function" && define.amd) // AMD
    return define(["exports"], mod);
  mod(tern.comment || (tern.comment = {}));
})(function(exports) {
  function isSpace(ch) {
    return (ch < 14 && ch > 8) || ch === 32 || ch === 160;
  }

  function onOwnLine(text, pos) {
    for (; pos > 0; --pos) {
      var ch = text.charCodeAt(pos - 1);
      if (ch == 10) break;
      if (!isSpace(ch)) return false;
    }
    return true;
  }

  // Gather comments directly before a function
  exports.commentsBefore = function(text, pos) {
    var found = null, emptyLines = 0, topIsLineComment;
    out: while (pos > 0) {
      var prev = text.charCodeAt(pos - 1);
      if (prev == 10) {
        for (var scan = --pos, sawNonWS = false; scan > 0; --scan) {
          prev = text.charCodeAt(scan - 1);
          if (prev == 47 && text.charCodeAt(scan - 2) == 47) {
            if (!onOwnLine(text, scan - 2)) break out;
            var content = text.slice(scan, pos);
            if (!emptyLines && topIsLineComment) found[0] = content + "\n" + found[0];
            else (found || (found = [])).unshift(content);
            topIsLineComment = true;
            emptyLines = 0;
            pos = scan - 2;
            break;
          } else if (prev == 10) {
            if (!sawNonWS && ++emptyLines > 1) break out;
            break;
          } else if (!sawNonWS && !isSpace(prev)) {
            sawNonWS = true;
          }
        }
      } else if (prev == 47 && text.charCodeAt(pos - 2) == 42) {
        for (var scan = pos - 2; scan > 1; --scan) {
          if (text.charCodeAt(scan - 1) == 42 && text.charCodeAt(scan - 2) == 47) {
            if (!onOwnLine(text, scan - 2)) break out;
            (found || (found = [])).unshift(text.slice(scan, pos - 2));
            topIsLineComment = false;
            emptyLines = 0;
            break;
          }
        }
        pos = scan - 2;
      } else if (isSpace(prev)) {
        --pos;
      } else {
        break;
      }
    }
    return found;
  };

  exports.commentAfter = function(text, pos) {
    while (pos < text.length) {
      var next = text.charCodeAt(pos);
      if (next == 47) {
        var after = text.charCodeAt(pos + 1), end;
        if (after == 47) // line comment
          end = text.indexOf("\n", pos + 2);
        else if (after == 42) // block comment
          end = text.indexOf("*/", pos + 2);
        else
          return;
        return text.slice(pos + 2, end < 0 ? text.length : end);
      } else if (isSpace(next)) {
        ++pos;
      }
    }
  };

  exports.ensureCommentsBefore = function(text, node) {
    if (node.hasOwnProperty("commentsBefore")) return node.commentsBefore;
    return node.commentsBefore = exports.commentsBefore(text, node.start);
  };
});

// Main type inference engine

// Walks an AST, building up a graph of abstract values and constraints
// that cause types to flow from one node to another. Also defines a
// number of utilities for accessing ASTs and scopes.

// Analysis is done in a context, which is tracked by the dynamically
// bound cx variable. Use withContext to set the current context.

// For memory-saving reasons, individual types export an interface
// similar to abstract values (which can hold multiple types), and can
// thus be used in place abstract values that only ever contain a
// single type.

(function(root, mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(exports, require("acorn"), require("acorn-loose"), require("acorn-walk"),
               require("./def"), require("./signal"));
  if (typeof define == "function" && define.amd) // AMD
    return define(["exports", "acorn/dist/acorn", "acorn-loose/dist/acorn-loose", "acorn-walk/dist/walk", "./def", "./signal"], mod);
  mod(root.tern || (root.tern = {}), acorn, acorn.loose, acorn.walk, tern.def, tern.signal); // Plain browser env
})(this, function(exports, acorn, acorn_loose, walk, def, signal) {
  "use strict";

  var toString = exports.toString = function(type, maxDepth, parent) {
    if (!type || type == parent || maxDepth && maxDepth < -3) return "?";
    return type.toString(maxDepth, parent);
  };

  // A variant of AVal used for unknown, dead-end values. Also serves
  // as prototype for AVals, Types, and Constraints because it
  // implements 'empty' versions of all the methods that the code
  // expects.
  var ANull = exports.ANull = signal.mixin({
    addType: function() {},
    propagate: function() {},
    getProp: function() { return ANull; },
    forAllProps: function() {},
    hasType: function() { return false; },
    isEmpty: function() { return true; },
    getFunctionType: function() {},
    getObjType: function() {},
    getSymbolType: function() {},
    getType: function() {},
    gatherProperties: function() {},
    propagatesTo: function() {},
    typeHint: function() {},
    propHint: function() {},
    toString: function() { return "?"; }
  });

  function extend(proto, props) {
    var obj = Object.create(proto);
    if (props) for (var prop in props) obj[prop] = props[prop];
    return obj;
  }

  // ABSTRACT VALUES

  var WG_DEFAULT = 100, WG_NEW_INSTANCE = 90, WG_MADEUP_PROTO = 10,
      WG_MULTI_MEMBER = 6, WG_CATCH_ERROR = 6,
      WG_PHANTOM_OBJ = 1,
      WG_GLOBAL_THIS = 90, WG_SPECULATIVE_THIS = 2, WG_SPECULATIVE_PROTO_THIS = 4;

  var AVal = exports.AVal = function() {
    this.types = [];
    this.forward = null;
    this.maxWeight = 0;
  };
  AVal.prototype = extend(ANull, {
    addType: function(type, weight) {
      weight = weight || WG_DEFAULT;
      if (this.maxWeight < weight) {
        this.maxWeight = weight;
        if (this.types.length == 1 && this.types[0] == type) return;
        this.types.length = 0;
      } else if (this.maxWeight > weight || this.types.indexOf(type) > -1) {
        return;
      }

      this.signal("addType", type);
      this.types.push(type);
      var forward = this.forward;
      if (forward) withWorklist(function(add) {
        for (var i = 0; i < forward.length; ++i) add(type, forward[i], weight);
      });
    },

    propagate: function(target, weight) {
      if (target == ANull || (target instanceof Type && this.forward && this.forward.length > 2)) return;
      if (weight && weight != WG_DEFAULT) target = new Muffle(target, weight);
      (this.forward || (this.forward = [])).push(target);
      var types = this.types;
      if (types.length) withWorklist(function(add) {
        for (var i = 0; i < types.length; ++i) add(types[i], target, weight);
      });
    },

    getProp: function(prop) {
      if (ignoredProp(prop)) return ANull;
      var found = (this.props || (this.props = Object.create(null)))[prop];
      if (!found) {
        found = this.props[prop] = new AVal;
        this.propagate(new GetProp(prop, found));
      }
      return found;
    },

    forAllProps: function(c) {
      this.propagate(new ForAllProps(c));
    },

    hasType: function(type) {
      return this.types.indexOf(type) > -1;
    },
    isEmpty: function() { return this.types.length === 0; },
    getFunctionType: function() {
      for (var i = this.types.length - 1; i >= 0; --i)
        if (this.types[i] instanceof Fn) return this.types[i];
    },
    getObjType: function() {
      var seen = null;
      for (var i = this.types.length - 1; i >= 0; --i) {
        var type = this.types[i];
        if (!(type instanceof Obj)) continue;
        if (type.name) return type;
        if (!seen) seen = type;
      }
      return seen;
    },

    getSymbolType: function() {
      for (var i = this.types.length - 1; i >= 0; --i)
        if (this.types[i] instanceof Sym) return this.types[i];
    },

    getType: function(guess) {
      if (this.types.length === 0 && guess !== false) return this.makeupType();
      if (this.types.length === 1) return this.types[0];
      return canonicalType(this.types);
    },

    toString: function(maxDepth, parent) {
      if (this.types.length == 0) return toString(this.makeupType(), maxDepth, parent);
      if (this.types.length == 1) return toString(this.types[0], maxDepth, parent);
      var simplified = simplifyTypes(this.types);
      if (simplified.length > 2) return "?";
      return simplified.map(function(tp) { return toString(tp, maxDepth, parent); }).join("|");
    },

    makeupPropType: function(obj) {
      var propName = this.propertyName;

      var protoProp = obj.proto && obj.proto.hasProp(propName);
      if (protoProp) {
        var fromProto = protoProp.getType();
        if (fromProto) return fromProto;
      }

      if (propName != "<i>") {
        var computedProp = obj.hasProp("<i>");
        if (computedProp) return computedProp.getType();
      } else if (obj.props["<i>"] != this) {
        for (var prop in obj.props) {
          var val = obj.props[prop];
          if (!val.isEmpty()) return val.getType();
        }
      }
    },

    makeupType: function() {
      var computed = this.propertyOf && this.makeupPropType(this.propertyOf);
      if (computed) return computed;

      if (!this.forward) return null;
      for (var i = this.forward.length - 1; i >= 0; --i) {
        var hint = this.forward[i].typeHint();
        if (hint && !hint.isEmpty()) {guessing = true; return hint;}
      }

      var props = Object.create(null), foundProp = null;
      for (var i = 0; i < this.forward.length; ++i) {
        var prop = this.forward[i].propHint();
        if (prop && prop != "length" && prop != "<i>" && prop != "✖" && prop != cx.completingProperty) {
          props[prop] = true;
          foundProp = prop;
        }
      }
      if (!foundProp) return null;

      var objs = objsWithProp(foundProp);
      if (objs) {
        var matches = [];
        search: for (var i = 0; i < objs.length; ++i) {
          var obj = objs[i];
          for (var prop in props) if (!obj.hasProp(prop)) continue search;
          if (obj.hasCtor) obj = getInstance(obj);
          matches.push(obj);
        }
        var canon = canonicalType(matches);
        if (canon) {guessing = true; return canon;}
      }
    },

    typeHint: function() { return this.types.length ? this.getType() : null; },
    propagatesTo: function() { return this; },

    gatherProperties: function(f, depth) {
      for (var i = 0; i < this.types.length; ++i)
        this.types[i].gatherProperties(f, depth);
    },

    guessProperties: function(f) {
      if (this.forward) for (var i = 0; i < this.forward.length; ++i) {
        var prop = this.forward[i].propHint();
        if (prop) f(prop, null, 0);
      }
      var guessed = this.makeupType();
      if (guessed) guessed.gatherProperties(f);
    }
  });

  function similarAVal(a, b, depth) {
    var typeA = a.getType(false), typeB = b.getType(false);
    if (!typeA || !typeB) return true;
    return similarType(typeA, typeB, depth);
  }

  function similarType(a, b, depth) {
    if (!a || depth >= 5) return b;
    if (!a || a == b) return a;
    if (!b) return a;
    if (a.constructor != b.constructor) return false;
    if (a.constructor == Arr) {
      var innerA = a.getProp("<i>").getType(false);
      if (!innerA) return b;
      var innerB = b.getProp("<i>").getType(false);
      if (!innerB || similarType(innerA, innerB, depth + 1)) return b;
    } else if (a.constructor == Obj) {
      var propsA = 0, propsB = 0, same = 0;
      for (var prop in a.props) {
        propsA++;
        if (prop in b.props && similarAVal(a.props[prop], b.props[prop], depth + 1))
          same++;
      }
      for (var prop in b.props) propsB++;
      if (propsA && propsB && same < Math.max(propsA, propsB) / 2) return false;
      return propsA > propsB ? a : b;
    } else if (a.constructor == Fn) {
      if (a.args.length != b.args.length ||
          !a.args.every(function(tp, i) { return similarAVal(tp, b.args[i], depth + 1); }) ||
          !similarAVal(a.retval, b.retval, depth + 1) || !similarAVal(a.self, b.self, depth + 1))
        return false;
      return a;
    } else {
      return false;
    }
  }

  var simplifyTypes = exports.simplifyTypes = function(types) {
    var found = [];
    outer: for (var i = 0; i < types.length; ++i) {
      var tp = types[i];
      for (var j = 0; j < found.length; j++) {
        var similar = similarType(tp, found[j], 0);
        if (similar) {
          found[j] = similar;
          continue outer;
        }
      }
      found.push(tp);
    }
    return found;
  };

  function canonicalType(types) {
    var arrays = 0, fns = 0, objs = 0, prim = null;
    for (var i = 0; i < types.length; ++i) {
      var tp = types[i];
      if (tp instanceof Arr) ++arrays;
      else if (tp instanceof Fn) ++fns;
      else if (tp instanceof Obj) ++objs;
      else if (tp instanceof Prim) {
        if (prim && tp.name != prim.name) return null;
        prim = tp;
      }
    }
    var kinds = (arrays && 1) + (fns && 1) + (objs && 1) + (prim && 1);
    if (kinds > 1) return null;
    if (prim) return prim;

    var maxScore = 0, maxTp = null;
    for (var i = 0; i < types.length; ++i) {
      var tp = types[i], score = 0;
      if (arrays) {
        score = tp.getProp("<i>").isEmpty() ? 1 : 2;
      } else if (fns) {
        score = 1;
        for (var j = 0; j < tp.args.length; ++j) if (!tp.args[j].isEmpty()) ++score;
        if (!tp.retval.isEmpty()) ++score;
      } else if (objs) {
        score = tp.name ? 100 : 2;
      }
      if (score >= maxScore) { maxScore = score; maxTp = tp; }
    }
    return maxTp;
  }

  // PROPAGATION STRATEGIES

  var constraint = exports.constraint = function(methods) {
    var ctor = function() {
      this.origin = cx.curOrigin;
      this.construct.apply(this, arguments);
    };
    ctor.prototype = Object.create(ANull);
    for (var m in methods) if (methods.hasOwnProperty(m)) ctor.prototype[m] = methods[m];
    return ctor;
  };

  var GetProp = constraint({
    construct: function(prop, target) {
      this.prop = prop; this.target = target;
    },
    addType: function(type, weight) {
      if (type.getProp)
        type.getProp(this.prop).propagate(this.target, weight);
    },
    propHint: function() { return this.prop; },
    propagatesTo: function() {
      if (this.prop == "<i>" || !/[^\w_]/.test(this.prop))
        return {target: this.target, pathExt: "." + this.prop};
    }
  });

  var DefProp = exports.PropHasSubset = exports.DefProp = constraint({
    construct: function(prop, type, originNode) {
      this.prop = prop; this.type = type; this.originNode = originNode;
    },
    addType: function(type, weight) {
      if (!(type instanceof Obj)) return;
      var prop = type.defProp(this.prop, this.originNode);
      if (!prop.origin) prop.origin = this.origin;
      this.type.propagate(prop, weight);
    },
    propHint: function() { return this.prop; }
  });

  var ForAllProps = constraint({
    construct: function(c) { this.c = c; },
    addType: function(type) {
      if (!(type instanceof Obj)) return;
      type.forAllProps(this.c);
    }
  });

  function withDisabledComputing(fn, body) {
    cx.disabledComputing = {fn: fn, prev: cx.disabledComputing};
    var result = body();
    cx.disabledComputing = cx.disabledComputing.prev;
    return result;
  }
  var IsCallee = exports.IsCallee = constraint({
    construct: function(self, args, argNodes, retval) {
      this.self = self; this.args = args; this.argNodes = argNodes; this.retval = retval;
      this.disabled = cx.disabledComputing;
    },
    addType: function(fn, weight) {
      if (!(fn instanceof Fn)) return;
      for (var i = 0; i < this.args.length; ++i) {
        if (i < fn.args.length) this.args[i].propagate(fn.args[i], weight);
        if (fn.arguments) this.args[i].propagate(fn.arguments, weight);
      }
      if (!fn.isArrowFn())
        this.self.propagate(fn.self, this.self == cx.topScope ? WG_GLOBAL_THIS : weight);
      var compute = fn.computeRet, result = fn.retval;
      if (compute) for (var d = this.disabled; d; d = d.prev)
        if (d.fn == fn || fn.originNode && d.fn.originNode == fn.originNode) compute = null;
      if (compute) {
        var old = cx.disabledComputing;
        cx.disabledComputing = this.disabled;
        result = compute(this.self, this.args, this.argNodes);
        cx.disabledComputing = old;
      }
      if (fn.async && !fn.generator) {
        var tp = result.getType();
        if (!(tp && tp.constructor == Obj && tp.name == "Promise")) {
          var defs = cx.definitions.ecmascript;
          var rtnval = defs && new Obj(defs["Promise.prototype"]);
          if (rtnval) {
            rtnval.getType().propagate(new DefProp(':t', result));
            result = rtnval;            
          }
        }
      }
      maybeIterator(fn, result).propagate(this.retval, weight);
    },
    typeHint: function() {
      var names = [];
      for (var i = 0; i < this.args.length; ++i) names.push("?");
      return new Fn(null, this.self, this.args, names, ANull);
    },
    propagatesTo: function() {
      return {target: this.retval, pathExt: ".!ret"};
    }
  });

  var HasMethodCall = constraint({
    construct: function(propName, args, argNodes, retval) {
      this.propName = propName; this.args = args; this.argNodes = argNodes; this.retval = retval;
      this.disabled = cx.disabledComputing;
    },
    addType: function(obj, weight) {
      var callee = new IsCallee(obj, this.args, this.argNodes, this.retval);
      callee.disabled = this.disabled;
      obj.getProp(this.propName).propagate(callee, weight);
    },
    propHint: function() { return this.propName; }
  });

  var IsCtor = exports.IsCtor = constraint({
    construct: function(target, noReuse) {
      this.target = target; this.noReuse = noReuse;
    },
    addType: function(f, weight) {
      if (!(f instanceof Fn)) return;
      if (cx.parent && !cx.parent.options.reuseInstances) this.noReuse = true;
      f.getProp("prototype").propagate(new IsProto(this.noReuse ? false : f, this.target), weight);
    }
  });

  var getInstance = exports.getInstance = function(obj, ctor) {
    if (ctor === false) return new Obj(obj);

    if (!ctor) ctor = obj.hasCtor;
    if (!obj.instances) obj.instances = [];
    for (var i = 0; i < obj.instances.length; ++i) {
      var cur = obj.instances[i];
      if (cur.ctor == ctor) return cur.instance;
    }
    var instance = new Obj(obj, ctor && ctor.name);
    instance.origin = obj.origin;
    obj.instances.push({ctor: ctor, instance: instance});
    return instance;
  };

  var IsProto = exports.IsProto = constraint({
    construct: function(ctor, target) {
      this.ctor = ctor; this.target = target;
    },
    addType: function(o, _weight) {
      if (!(o instanceof Obj)) return;
      if ((this.count = (this.count || 0) + 1) > 8) return;
      if (o == cx.protos.Array)
        this.target.addType(new Arr);
      else
        this.target.addType(getInstance(o, this.ctor));
    }
  });

  var FnPrototype = constraint({
    construct: function(fn) { this.fn = fn; },
    addType: function(o, _weight) {
      if (o instanceof Obj && !o.hasCtor) {
        o.hasCtor = this.fn;
        var adder = new SpeculativeThis(o, this.fn);
        adder.addType(this.fn);
        o.forAllProps(function(_prop, val, local) {
          if (local) val.propagate(adder);
        });
      }
    }
  });

  var IsAdded = constraint({
    construct: function(other, target) {
      this.other = other; this.target = target;
    },
    addType: function(type, weight) {
      if (type == cx.str)
        this.target.addType(cx.str, weight);
      else if (type == cx.num && this.other.hasType(cx.num))
        this.target.addType(cx.num, weight);
    },
    typeHint: function() { return this.other; }
  });

  var IfObj = exports.IfObj = constraint({
    construct: function(target) { this.target = target; },
    addType: function(t, weight) {
      if (t instanceof Obj) this.target.addType(t, weight);
    },
    propagatesTo: function() { return this.target; }
  });

  var SpeculativeThis = constraint({
    construct: function(obj, ctor) { this.obj = obj; this.ctor = ctor; },
    addType: function(tp) {
      if (tp instanceof Fn && tp.self)
        tp.self.addType(getInstance(this.obj, this.ctor), WG_SPECULATIVE_PROTO_THIS);
    }
  });

  var HasProto = constraint({
    construct: function(obj) { this.obj = obj },
    addType: function(tp) {
      if (tp instanceof Obj && this.obj.proto == cx.protos.Object)
        this.obj.replaceProto(tp);
    }
  });

  var Muffle = constraint({
    construct: function(inner, weight) {
      this.inner = inner; this.weight = weight;
    },
    addType: function(tp, weight) {
      this.inner.addType(tp, Math.min(weight, this.weight));
    },
    propagatesTo: function() { return this.inner.propagatesTo(); },
    typeHint: function() { return this.inner.typeHint(); },
    propHint: function() { return this.inner.propHint(); }
  });

  // TYPE OBJECTS

  var Type = exports.Type = function() {};
  Type.prototype = extend(ANull, {
    constructor: Type,
    propagate: function(c, w) { c.addType(this, w); },
    hasType: function(other) { return other == this; },
    isEmpty: function() { return false; },
    typeHint: function() { return this; },
    getType: function() { return this; }
  });

  var Prim = exports.Prim = function(proto, name) { this.name = name; this.proto = proto; };
  Prim.prototype = extend(Type.prototype, {
    constructor: Prim,
    toString: function() { return this.name; },
    getProp: function(prop) {return this.proto.hasProp(prop) || ANull;},
    gatherProperties: function(f, depth) {
      if (this.proto) this.proto.gatherProperties(f, depth);
    }
  });

  function isInteger(str) {
    var c0 = str.charCodeAt(0);
    if (c0 >= 48 && c0 <= 57) return !/\D/.test(str);
    else return false;
  }

  var Obj = exports.Obj = function(proto, name) {
    if (!this.props) this.props = Object.create(null);
    this.proto = proto === true ? cx.protos.Object : proto;
    if (proto && proto != cx.protos.Object && !name && proto.name && !(this instanceof Fn)) {
      var match = /^(.*)\.prototype$/.exec(this.proto.name);
      if (match) name = match[1];
    }
    this.name = name;
    this.maybeProps = null;
    this.origin = cx.curOrigin;
  };
  Obj.prototype = extend(Type.prototype, {
    constructor: Obj,
    toString: function(maxDepth) {
      if (maxDepth == null) maxDepth = 0;
      if (maxDepth <= 0 && this.name) return this.name;
      var props = [], etc = false;
      for (var prop in this.props) if (prop != "<i>") {
        if (props.length > 5) { etc = true; break; }
        if (maxDepth)
          props.push(prop + ": " + toString(this.props[prop], maxDepth - 1, this));
        else
          props.push(prop);
      }
      props.sort();
      if (etc) props.push("...");
      return "{" + props.join(", ") + "}";
    },
    hasProp: function(prop, searchProto) {
      if (isInteger(prop)) prop = this.normalizeIntegerProp(prop);
      var found = this.props[prop];
      if (searchProto !== false)
        for (var p = this.proto; p && !found; p = p.proto) found = p.props[prop];
      return found;
    },
    defProp: function(prop, originNode) {
      var found = this.hasProp(prop, false);
      if (found) {
        if (originNode && !found.originNode) found.originNode = originNode;
        return found;
      }
      if (ignoredProp(prop)) return ANull;
      if (isInteger(prop)) prop = this.normalizeIntegerProp(prop);

      var av = this.maybeProps && this.maybeProps[prop];
      if (av) {
        delete this.maybeProps[prop];
        this.maybeUnregProtoPropHandler();
      } else {
        av = new AVal;
        av.propertyOf = this;
        av.propertyName = prop;
      }

      this.props[prop] = av;
      av.originNode = originNode;
      av.origin = cx.curOrigin;
      this.broadcastProp(prop, av, true);
      return av;
    },
    getProp: function(prop) {
      var found = this.hasProp(prop, true) || (this.maybeProps && this.maybeProps[prop]);
      if (found) return found;
      if (ignoredProp(prop)) return ANull;
      if (isInteger(prop)) prop = this.normalizeIntegerProp(prop);
      var av = this.ensureMaybeProps()[prop] = new AVal;
      av.propertyOf = this;
      av.propertyName = prop;
      return av;
    },
    normalizeIntegerProp: function(_) { return "<i>" },
    broadcastProp: function(prop, val, local) {
      if (local) {
        this.signal("addProp", prop, val);
        // If this is a scope, it shouldn't be registered
        if (!(this instanceof Scope)) registerProp(prop, this);
      }

      if (this.onNewProp) for (var i = 0; i < this.onNewProp.length; ++i) {
        var h = this.onNewProp[i];
        h.onProtoProp ? h.onProtoProp(prop, val, local) : h(prop, val, local);
      }
    },
    onProtoProp: function(prop, val, _local) {
      var maybe = this.maybeProps && this.maybeProps[prop];
      if (maybe) {
        delete this.maybeProps[prop];
        this.maybeUnregProtoPropHandler();
        this.proto.getProp(prop).propagate(maybe);
      }
      this.broadcastProp(prop, val, false);
    },
    replaceProto: function(proto) {
      for (var o = proto; o; o = o.proto)
        if (o == this) return;
      if (this.proto && this.maybeProps)
        this.proto.unregPropHandler(this);
      this.proto = proto;
      if (this.maybeProps)
        this.proto.forAllProps(this);
    },
    ensureMaybeProps: function() {
      if (!this.maybeProps) {
        if (this.proto) this.proto.forAllProps(this);
        this.maybeProps = Object.create(null);
      }
      return this.maybeProps;
    },
    removeProp: function(prop) {
      var av = this.props[prop];
      delete this.props[prop];
      this.ensureMaybeProps()[prop] = av;
      av.types.length = 0;
    },
    forAllProps: function(c) {
      if (!this.onNewProp) {
        this.onNewProp = [];
        if (this.proto) this.proto.forAllProps(this);
      }
      this.onNewProp.push(c);
      for (var o = this; o; o = o.proto) for (var prop in o.props) {
        if (c.onProtoProp)
          c.onProtoProp(prop, o.props[prop], o == this);
        else
          c(prop, o.props[prop], o == this);
      }
    },
    maybeUnregProtoPropHandler: function() {
      if (this.maybeProps) {
        for (var _n in this.maybeProps) return;
        this.maybeProps = null;
      }
      if (!this.proto || this.onNewProp && this.onNewProp.length) return;
      this.proto.unregPropHandler(this);
    },
    unregPropHandler: function(handler) {
      for (var i = 0; i < this.onNewProp.length; ++i)
        if (this.onNewProp[i] == handler) { this.onNewProp.splice(i, 1); break; }
      this.maybeUnregProtoPropHandler();
    },
    gatherProperties: function(f, depth) {
      for (var prop in this.props) if (prop != "<i>" && prop.charAt(0) != ":")
        f(prop, this, depth);
      if (this.proto) this.proto.gatherProperties(f, depth + 1);
    },
    getObjType: function() { return this; }
  });

  var geckoIterators = typeof StopIteration != "undefined";
  function ignoredProp(name) {
    return name == "__proto__" || name == "✖" || geckoIterators && name == "__iterator__";
  }

  var Fn = exports.Fn = function(name, self, args, argNames, retval, generator, async) {
    Obj.call(this, cx.protos.Function, name);
    this.self = self;
    this.args = args;
    this.argNames = argNames;
    this.retval = retval;
    this.generator = generator;
    this.async = async;
  };
  Fn.prototype = extend(Obj.prototype, {
    constructor: Fn,
    toString: function(maxDepth) {
      if (maxDepth == null) maxDepth = 0;
      var str = this.generator ? "fn*(" : "fn(";
      for (var i = 0; i < this.args.length; ++i) {
        if (i) str += ", ";
        var name = this.argNames[i];
        if (name && name != "?") str += name + ": ";
        str += maxDepth > -3 ? toString(this.args[i], maxDepth - 1, this) : "?";
      }
      str += ")";
      if (!this.retval.isEmpty())
        str += " -> " + (maxDepth > -3 ? toString(this.retval, maxDepth - 1, this) : "?");
      return str;
    },
    getProp: function(prop) {
      if (prop == "prototype") {
        var known = this.hasProp(prop, false);
        if (!known) {
          known = this.defProp(prop);
          var proto = new Obj(true, this.name && this.name + ".prototype");
          proto.origin = this.origin;
          known.addType(proto, WG_MADEUP_PROTO);
        }
        return known;
      }
      return Obj.prototype.getProp.call(this, prop);
    },
    defProp: function(prop, originNode) {
      if (prop == "prototype") {
        var found = this.hasProp(prop, false);
        if (found) return found;
        found = Obj.prototype.defProp.call(this, prop, originNode);
        found.origin = this.origin;
        found.propagate(new FnPrototype(this));
        return found;
      }
      return Obj.prototype.defProp.call(this, prop, originNode);
    },
    getFunctionType: function() { return this; },
    isArrowFn: function() { return this.originNode && this.originNode.type == "ArrowFunctionExpression" }
  });

  var Arr = exports.Arr = function(contentType) {
    Obj.call(this, cx.protos.Array);
    var content = this.defProp("<i>");
    if (Array.isArray(contentType)) {
      this.tuple = contentType.length;
      for (var i = 0; i < contentType.length; i++) {
        var prop = this.defProp(String(i));
        contentType[i].propagate(prop);
        prop.propagate(content);
      }
    } else if (contentType) {
      this.tuple = 0;
      contentType.propagate(content);
    }
  };
  Arr.prototype = extend(Obj.prototype, {
    constructor: Arr,
    toString: function(maxDepth) {
      if (maxDepth == null) maxDepth = 0;
      if (maxDepth <= -3) return "[?]";
      var content = "";
      if (this.tuple) {
        var similar;
        for (var i = 0; i in this.props; i++) {
          var type = toString(this.getProp(String(i)), maxDepth - 1, this);
          if (similar == null)
            similar = type;
          else if (similar != type)
            similar = false;
          else
            similar = type;
          content += (content ? ", " : "") + type;
        }
        if (similar) content = similar;
      } else {
        content = toString(this.getProp("<i>"), maxDepth - 1, this);
      }
      return "[" + content + "]";
    },
    normalizeIntegerProp: function(prop) {
      if (+prop < this.tuple) return prop;
      else return "<i>";
    }
  });

  var Sym = exports.Sym = function(name, originNode) {
    Prim.call(this, cx.protos.Symbol, "Symbol");
    this.symName = name;
    this.originNode = originNode;
  };
  Sym.prototype = extend(Prim.prototype, {
    constructor: Sym,
    asPropName: function() { return ":" + this.symName },
    getSymbolType: function() { return this }
  });

  exports.getSymbol = function(name, originNode) {
    var cleanName = name.replace(/[^\w$\.]/g, "_");
    var known = cx.symbols[cleanName];
    if (known) {
      if (originNode && !known.originNode) known.originNode = originNode;
      return known;
    }
    return cx.symbols[cleanName] = new Sym(cleanName, originNode);
  };

  // THE PROPERTY REGISTRY

  function registerProp(prop, obj) {
    var data = cx.props[prop] || (cx.props[prop] = []);
    data.push(obj);
  }

  function objsWithProp(prop) {
    return cx.props[prop];
  }

  // INFERENCE CONTEXT

  exports.Context = function(defs, parent) {
    this.parent = parent;
    this.props = Object.create(null);
    this.protos = Object.create(null);
    this.origins = [];
    this.curOrigin = "ecmascript";
    this.paths = Object.create(null);
    this.definitions = Object.create(null);
    this.purgeGen = 0;
    this.workList = null;
    this.disabledComputing = null;
    this.curSuperCtor = this.curSuper = null;
    this.symbols = Object.create(null);

    exports.withContext(this, function() {
      cx.protos.Object = new Obj(null, "Object.prototype");
      cx.topScope = new Scope();
      cx.topScope.name = "<top>";
      cx.protos.Array = new Obj(true, "Array.prototype");
      cx.protos.Function = new Fn("Function.prototype", ANull, [], [], ANull);
      cx.protos.Function.proto = cx.protos.Object;
      cx.protos.RegExp = new Obj(true, "RegExp.prototype");
      cx.protos.String = new Obj(true, "String.prototype");
      cx.protos.Number = new Obj(true, "Number.prototype");
      cx.protos.Boolean = new Obj(true, "Boolean.prototype");
      cx.protos.Symbol = new Obj(true, "Symbol.prototype");
      cx.str = new Prim(cx.protos.String, "string");
      cx.bool = new Prim(cx.protos.Boolean, "bool");
      cx.num = new Prim(cx.protos.Number, "number");
      cx.curOrigin = null;

      if (defs) for (var i = 0; i < defs.length; ++i)
        def.load(defs[i]);
    });
  };

  exports.Context.prototype.startAnalysis = function() {
    this.disabledComputing = this.workList = this.curSuperCtor = this.curSuper = null;
  };

  var cx = null;
  exports.cx = function() { return cx; };

  exports.withContext = function(context, f) {
    var old = cx;
    cx = context;
    try { return f(); }
    finally { cx = old; }
  };

  exports.TimedOut = function() {
    this.message = "Timed out";
    this.stack = (new Error()).stack;
  };
  exports.TimedOut.prototype = Object.create(Error.prototype);
  exports.TimedOut.prototype.name = "infer.TimedOut";

  var timeout;
  exports.withTimeout = function(ms, f) {
    var end = +new Date + ms;
    var oldEnd = timeout;
    if (oldEnd && oldEnd < end) return f();
    timeout = end;
    try { return f(); }
    finally { timeout = oldEnd; }
  };

  exports.addOrigin = function(origin) {
    if (cx.origins.indexOf(origin) < 0) cx.origins.push(origin);
  };

  var baseMaxWorkDepth = 20, reduceMaxWorkDepth = 0.0001;
  function withWorklist(f) {
    if (cx.workList) return f(cx.workList);

    var list = [], depth = 0;
    var add = cx.workList = function(type, target, weight) {
      if (depth < baseMaxWorkDepth - reduceMaxWorkDepth * list.length)
        list.push(type, target, weight, depth);
    };
    var ret = f(add);
    for (var i = 0; i < list.length; i += 4) {
      if (timeout && +new Date >= timeout)
        throw new exports.TimedOut();
      depth = list[i + 3] + 1;
      list[i + 1].addType(list[i], list[i + 2]);
    }
    cx.workList = null;
    return ret;
  }

  function withSuper(ctor, obj, f) {
    var oldCtor = cx.curSuperCtor, oldObj = cx.curSuper;
    cx.curSuperCtor = ctor; cx.curSuper = obj;
    var result = f();
    cx.curSuperCtor = oldCtor; cx.curSuper = oldObj;
    return result;
  }

  // SCOPES

  var Scope = exports.Scope = function(prev, originNode, isBlock, isCatch) {
    Obj.call(this, prev || true);
    this.prev = prev;
    this.originNode = originNode;
    this.isBlock = !!isBlock;
    this.isCatch = !!isCatch;
  };
  Scope.prototype = extend(Obj.prototype, {
    constructor: Scope,
    defVar: function(name, originNode) {
      for (var s = this; ; s = s.proto) {
        var found = s.props[name];
        if (found) return found;
        if (!s.prev) return s.defProp(name, originNode);
      }
    }
  });

  function functionScope(scope, arrow) {
    while (scope.isBlock || scope.isCatch || (arrow === false && scope.fnType && scope.fnType.isArrowFn()))
      scope = scope.prev;
    return scope;
  }


  // RETVAL COMPUTATION HEURISTICS

  function maybeInstantiate(scope, score) {
    var fn = functionScope(scope).fnType;
    if (fn) fn.instantiateScore = (fn.instantiateScore || 0) + score;
  }

  var NotSmaller = {};
  function nodeSmallerThan(node, n) {
    try {
      walk.simple(node, {Expression: function() { if (--n <= 0) throw NotSmaller; }});
      return true;
    } catch(e) {
      if (e == NotSmaller) return false;
      throw e;
    }
  }

  function maybeTagAsInstantiated(node, fn) {
    var score = fn.instantiateScore;
    if (!cx.disabledComputing && score && fn.args.length && nodeSmallerThan(node, score * 5)) {
      maybeInstantiate(functionScope(fn.originNode.scope.prev), score / 2);
      setFunctionInstantiated(node, fn);
      return true;
    } else {
      fn.instantiateScore = null;
    }
  }

  function setFunctionInstantiated(node, fn) {
    // Disconnect the arg avals, so that we can add info to them without side effects
    var refScope = node.scope;
    for (var i = 0; i < fn.args.length; ++i) fn.args[i] = new AVal;
    fn.self = new AVal;
    fn.computeRet = function(self, args) {
      // Prevent recursion
      return withDisabledComputing(fn, function() {
        var oldOrigin = cx.curOrigin;
        cx.curOrigin = fn.origin;
        var scope = node.scope ? node.scope : refScope;
        var scopeCopy = new Scope(scope.prev, scope.originNode);
        for (var v in scope.props) {
          var local = scopeCopy.defProp(v, scope.props[v].originNode);
          for (var i = 0; i < args.length; ++i) if (fn.argNames[i] == v && i < args.length)
            args[i].propagate(local);
        }
        var argNames = fn.argNames.length != args.length ? fn.argNames.slice(0, args.length) : fn.argNames;
        while (argNames.length < args.length) argNames.push("?");
        scopeCopy.fnType = new Fn(fn.name, self, args, argNames, ANull, fn.generator, fn.async);
        scopeCopy.fnType.originNode = fn.originNode;
        if (fn.arguments) {
          var argset = scopeCopy.fnType.arguments = new AVal;
          scopeCopy.defProp("arguments").addType(new Arr(argset));
          for (var i = 0; i < args.length; ++i) args[i].propagate(argset);
        }
        node.scope = scopeCopy;
        walk.recursive(node.body, scopeCopy, null, scopeGatherer);
        walk.recursive(node.body, scopeCopy, null, inferWrapper);
        cx.curOrigin = oldOrigin;
        return scopeCopy.fnType.retval;
      });
    };
  }

  function maybeTagAsGeneric(fn) {
    var target = fn.retval;
    if (target == ANull || fn.isArrowFn()) return;
    var targetInner, asArray;
    if (!target.isEmpty() && (targetInner = target.getType()) instanceof Arr)
      target = asArray = targetInner.getProp("<i>");

    function explore(aval, path, depth) {
      if (depth > 3 || !aval.forward) return;
      for (var i = 0; i < aval.forward.length; ++i) {
        var prop = aval.forward[i].propagatesTo();
        if (!prop) continue;
        var newPath = path, dest;
        if (prop instanceof AVal) {
          dest = prop;
        } else if (prop.target instanceof AVal) {
          newPath += prop.pathExt;
          dest = prop.target;
        } else continue;
        if (dest == target) return newPath;
        var found = explore(dest, newPath, depth + 1);
        if (found) return found;
      }
    }

    var foundPath = explore(fn.self, "!this", 0);
    for (var i = 0; !foundPath && i < fn.args.length; ++i)
      foundPath = explore(fn.args[i], "!" + i, 0);

    if (foundPath) {
      if (asArray) foundPath = "[" + foundPath + "]";
      var p = new def.TypeParser(foundPath);
      var parsed = p.parseType(true);
      fn.computeRet = parsed.apply ? parsed : function() { return parsed; };
      fn.computeRetSource = foundPath;
      return true;
    }
  }

  // SCOPE GATHERING PASS

  function addVar(scope, nameNode) {
    return scope.defProp(nameNode.name, nameNode);
  }
  function patternName(node) {
    if (node.type == "Identifier") return node.name;
    if (node.type == "AssignmentPattern") return patternName(node.left);
    if (node.type == "ObjectPattern") return "{" + node.properties.map(function(e) { return patternName(e.type === 'RestElement' ? e : e.value) }).join(", ") + "}";
    if (node.type == "ArrayPattern") return "[" + node.elements.map(function(e) { return e ? patternName(e) : "" }).join(", ") + "]";
    if (node.type == "RestElement") return "..." + patternName(node.argument);
    return "_";
  }

  function isBlockScopedDecl(node) {
    return node.type == "VariableDeclaration" && node.kind != "var" ||
      node.type == "FunctionDeclaration" ||
      node.type == "ClassDeclaration";
  }

  function patternScopes(inner, outer) {
    return {inner: inner, outer: outer || inner};
  }

  var scopeGatherer = exports.scopeGatherer = walk.make({
    VariablePattern: function(node, scopes) {
      if (scopes.inner) addVar(scopes.inner, node);
    },
    AssignmentPattern: function(node, scopes, c) {
      c(node.left, scopes, "Pattern");
      c(node.right, scopes.outer, "Expression");
    },
    AssignmentExpression: function(node, scope, c) {
      if (node.left.type == "MemberExpression")
        c(node.left, scope, "Expression");
      else
        c(node.left, patternScopes(false, scope), "Pattern");
      c(node.right, scope, "Expression");
    },
    MemberPattern: function(node, scope, c) {
      c(node, scope.outer);
    },
    Function: function(node, scope, c) {
      var inner = node.scope = new Scope(scope, node);
      var argVals = [], argNames = [];
      for (var i = 0; i < node.params.length; ++i) {
        var param = node.params[i];
        argNames.push(patternName(param));
        if (param.type == "Identifier") {
          argVals.push(addVar(inner, param));
        } else {
          var arg = new AVal;
          argVals.push(arg);
          arg.originNode = param;
          c(param, patternScopes(inner), "Pattern");
        }
      }
      inner.fnType = new Fn(node.id && node.id.name, new AVal, argVals, argNames, ANull, node.generator, node.async);
      inner.fnType.originNode = node;
      if (node.id) {
        var decl = node.type == "FunctionDeclaration";
        addVar(decl ? scope : inner, node.id);
      }
      c(node.body, inner, node.expression ? "Expression" : "Statement");
    },
    BlockStatement: function(node, scope, c) {
      if (!node.scope && node.body.some(isBlockScopedDecl))
        scope = node.scope = new Scope(scope, node, true);
      walk.base.BlockStatement(node, scope, c);
    },
    CatchClause: function(node, scope, c) {
      if (!node.param) { return; }
      scope = node.scope = new Scope(scope, node, false, true);
      if (node.param.type == "Identifier") {
        var v = addVar(scope, node.param);
        c(node.body, scope, "Statement");
        var ecma = cx.definitions.ecmascript;
        if (ecma && v.isEmpty()) getInstance(ecma["Error.prototype"]).propagate(v, WG_CATCH_ERROR);
      } else {
        c(node.param, patternScopes(scope), "Pattern");
      }
    },
    VariableDeclaration: function(node, scope, c) {
      var targetScope = node.kind == "var" ? functionScope(scope) : scope;
      for (var i = 0; i < node.declarations.length; ++i) {
        var decl = node.declarations[i];
        c(decl.id, patternScopes(targetScope, scope), "Pattern");
        if (decl.init) c(decl.init, scope, "Expression");
      }
    },
    ClassDeclaration: function(node, scope, c) {
      if (node.id) addVar(scope, node.id);
      if (node.superClass) c(node.superClass, scope, "Expression");
      for (var i = 0; i < node.body.body.length; i++)
        c(node.body.body[i], scope);
    },
    ForInStatement: function(node, scope, c) {
      if (!node.scope && isBlockScopedDecl(node.left))
        scope = node.scope = new Scope(scope, node, true);
      walk.base.ForInStatement(node, scope, c);
    },
    ForStatement: function(node, scope, c) {
      if (!node.scope && node.init && isBlockScopedDecl(node.init))
        scope = node.scope = new Scope(scope, node, true);
      walk.base.ForStatement(node, scope, c);
    },
    ImportDeclaration: function(node, scope) {
      for (var i = 0; i < node.specifiers.length; i++)
        addVar(scope, node.specifiers[i].local);
    }
  });
  scopeGatherer.ForOfStatement = scopeGatherer.ForInStatement;

  function rmScope(node) { if (node.scope) node.scope = null }
  var scopeClearer = {BlockStatement: rmScope, Function: rmScope, CatchClause: rmScope,
                      ForInStateMent: rmScope, ForStatement: rmScope};
  exports.clearScopes = function(ast) {
    walk.simple(ast, scopeClearer);
  };

  // CONSTRAINT GATHERING PASS

  var propName = exports.propName = function(node, inferInScope) {
    var key = node.property || node.key;
    if (!node.computed && key.type == "Identifier") return key.name;
    if (key.type == "Literal") {
      if (typeof key.value == "string") return key.value;
      if (typeof key.value == "number") return String(key.value);
    }
    if (inferInScope) {
      var symName = symbolName(infer(key, inferInScope));
      if (symName) return node.propName = symName;
    } else if (node.propName) {
      return node.propName;
    }
    return "<i>";
  };
  function symbolName(val) {
    var sym = val.getSymbolType();
    if (sym) return sym.asPropName();
  }

  function unopResultType(op) {
    switch (op) {
    case "+": case "-": case "~": return cx.num;
    case "!": return cx.bool;
    case "typeof": return cx.str;
    case "void": case "delete": return ANull;
    }
  }
  function binopIsBoolean(op) {
    switch (op) {
    case "==": case "!=": case "===": case "!==": case "<": case ">": case ">=": case "<=":
    case "in": case "instanceof": return true;
    }
  }
  function literalType(node) {
    if (node.regex) return getInstance(cx.protos.RegExp);
    switch (typeof node.value) {
    case "boolean": return cx.bool;
    case "number": return cx.num;
    case "string": return cx.str;
    case "object":
    case "function":
      if (!node.value) return ANull;
      return getInstance(cx.protos.RegExp);
    }
  }

  function join(a, b) {
    if (a == b || b == ANull) return a;
    if (a == ANull) return b;
    var joined = new AVal;
    a.propagate(joined);
    b.propagate(joined);
    return joined;
  }

  function connectParams(node, scope) {
    for (var i = 0; i < node.params.length; i++) {
      var param = node.params[i];
      if (param.type == "Identifier") continue;
      connectPattern(param, scope, node.scope.fnType.args[i]);
    }
  }

  function ensureVar(node, scope) {
    return scope.hasProp(node.name) || cx.topScope.defProp(node.name, node);
  }

  var inferPatternVisitor = exports.inferPatternVisitor = {
    Identifier: function(node, scope, source) {
      source.propagate(ensureVar(node, scope));
    },
    MemberExpression: function(node, scope, source) {
      var obj = infer(node.object, scope);
      var pName = propName(node, scope);
      obj.propagate(new DefProp(pName, source, node.property));
    },
    RestElement: function(node, scope, source) {
      connectPattern(node.argument, scope, new Arr(source));
    },
    ObjectPattern: function(node, scope, source) {
      for (var i = 0; i < node.properties.length; ++i) {
        var prop = node.properties[i];
        if (prop.type == 'RestElement') { continue; }
        connectPattern(prop.value, scope, source.getProp(propName(prop)));
      }
    },
    ArrayPattern: function(node, scope, source) {
      for (var i = 0; i < node.elements.length; i++)
        if (node.elements[i])
          connectPattern(node.elements[i], scope, source.getProp(String(i)));
    },
    AssignmentPattern: function(node, scope, source) {
      connectPattern(node.left, scope, join(source, infer(node.right, scope)));
    }
  };

  function connectPattern(node, scope, source) {
    var connecter = inferPatternVisitor[node.type];
    if (connecter) connecter(node, scope, source);
  }

  function getThis(scope) {
    var fnScope = functionScope(scope);
    return fnScope.fnType ? fnScope.fnType.self : fnScope;
  }

  function maybeAddPhantomObj(obj) {
    if (!obj.isEmpty() || !obj.propertyOf) return;
    obj.propertyOf.getProp(obj.propertyName).addType(new Obj, WG_PHANTOM_OBJ);
    maybeAddPhantomObj(obj.propertyOf);
  }

  function inferClass(node, scope, name) {
    if (!name && node.id) name = node.id.name;

    var sup = cx.protos.Object, supCtor, delayed;
    if (node.superClass) {
      if (node.superClass.type == "Literal" && node.superClass.value == null) {
        sup = null;
      } else {
        var supVal = infer(node.superClass, scope), supProto;
        supCtor = supVal.getFunctionType();
        if (supCtor && (supProto = supCtor.getProp("prototype").getObjType())) {
          sup = supProto;
        } else {
          supCtor = supVal;
          delayed = supVal.getProp("prototype");
        }
      }
    }
    var proto = new Obj(sup, name && name + ".prototype");
    if (delayed) delayed.propagate(new HasProto(proto));

    return withSuper(supCtor, delayed || sup, function() {
      var ctor, body = node.body.body;
      for (var i = 0; i < body.length; i++)
        if (body[i].kind == "constructor") ctor = body[i].value;
      var fn = node.objType = ctor ? infer(ctor, scope) : new Fn(name, ANull, [], null, ANull);
      fn.originNode = node.id || ctor || node;

      var inst = getInstance(proto, fn);
      fn.self.addType(inst);
      fn.defProp("prototype", node).addType(proto);
      for (var i = 0; i < body.length; i++) {
        var method = body[i], target;
        if (method.kind == "constructor") continue;
        var pName = propName(method, scope);
        if (pName == "<i>" || method.kind == "set") {
          target = ANull;
        } else {
          target = (method.static ? fn : proto).defProp(pName, method.key);
          target.initializer = true;
          if (method.kind == "get") target = new IsCallee(inst, [], null, target);
        }
        infer(method.value, scope, target);
        var methodFn = target.getFunctionType();
        if (methodFn) methodFn.self.addType(inst);
      }
      return fn;
    });
  }

  function arrayLiteralType(elements, scope, inner) {
    var tuple = elements.length > 1 && elements.length < 6;
    if (tuple) {
      var homogenous = true, litType;
      for (var i = 0; i < elements.length; i++) {
        var elt = elements[i];
        if (!elt)
          tuple = false;
        else if (elt.type != "Literal" || (litType && litType != typeof elt.value))
          homogenous = false;
        else
          litType = typeof elt.value;
      }
      if (homogenous) tuple = false;
    }

    if (tuple) {
      var types = [];
      for (var i = 0; i < elements.length; ++i)
        types.push(inner(elements[i], scope));
      return new Arr(types);
    } else if (elements.length < 2) {
      return new Arr(elements[0] && inner(elements[0], scope));
    } else {
      var eltVal = new AVal;
      for (var i = 0; i < elements.length; i++)
        if (elements[i]) inner(elements[i], scope).propagate(eltVal);
      return new Arr(eltVal);
    }
  }

  function ret(f) {
    return function(node, scope, out, name) {
      var r = f(node, scope, name);
      if (out) r.propagate(out);
      return r;
    };
  }
  function fill(f) {
    return function(node, scope, out, name) {
      if (!out) out = new AVal;
      f(node, scope, out, name);
      return out;
    };
  }

  var inferExprVisitor = exports.inferExprVisitor = {
    ArrayExpression: ret(function(node, scope) {
      return arrayLiteralType(node.elements, scope, infer);
    }),
    ObjectExpression: ret(function(node, scope, name) {
      var proto = cx.protos.Object, waitForProto;
      for (var i = 0; i < node.properties.length; ++i) {
        var prop = node.properties[i];
        if (prop.type == 'SpreadElement') { continue; }
        if (prop.key.name == "__proto__") {
          if (prop.value.type == "Literal" && prop.value.value == null) {
            proto = null;
          } else {
            var protoVal = infer(prop.value, scope), known = protoVal.getObjType();
            if (known) proto = known;
            else waitForProto = protoVal;
          }
        }
      }

      var obj = node.objType = new Obj(proto, name);
      if (waitForProto) waitForProto.propagate(new HasProto(obj));
      obj.originNode = node;

      withSuper(null, waitForProto || proto, function() {
        for (var i = 0; i < node.properties.length; ++i) {
          var prop = node.properties[i], key = prop.key;
          if (prop.type == 'SpreadElement' || ignoredProp(prop.key.name)) continue;

          var name = propName(prop, scope), target;
          if (name == "<i>" || prop.kind == "set") {
            target = ANull;
          } else {
            target = obj.defProp(name, key);
            var val = target;
            val.initializer = true;
            if (prop.kind == "get")
              target = new IsCallee(obj, [], null, val);
          }
          infer(prop.value, scope, target, name);
          if (prop.value.type == "FunctionExpression")
            prop.value.scope.fnType.self.addType(obj, WG_SPECULATIVE_THIS);
        }
      });
      return obj;
    }),
    FunctionExpression: ret(function(node, scope, name) {
      var inner = node.scope, fn = inner.fnType;
      if (name && !fn.name) fn.name = name;
      connectParams(node, inner);
      if (node.expression)
        infer(node.body, inner, inner.fnType.retval = new AVal);
      else
        walk.recursive(node.body, inner, null, inferWrapper, "Statement");
      if (node.type == "ArrowFunctionExpression")
        getThis(scope).propagate(fn.self);
      maybeTagAsInstantiated(node, fn) || maybeTagAsGeneric(fn);
      if (node.id) inner.getProp(node.id.name).addType(fn);
      return fn;
    }),
    ClassExpression: ret(inferClass),
    SequenceExpression: ret(function(node, scope) {
      for (var i = 0, l = node.expressions.length - 1; i < l; ++i)
        infer(node.expressions[i], scope, ANull);
      return infer(node.expressions[l], scope);
    }),
    UnaryExpression: ret(function(node, scope) {
      infer(node.argument, scope, ANull);
      return unopResultType(node.operator);
    }),
    UpdateExpression: ret(function(node, scope) {
      infer(node.argument, scope, ANull);
      return cx.num;
    }),
    BinaryExpression: ret(function(node, scope) {
      if (node.operator == "+") {
        var lhs = infer(node.left, scope);
        var rhs = infer(node.right, scope);
        if (lhs.hasType(cx.str) || rhs.hasType(cx.str)) return cx.str;
        if (lhs.hasType(cx.num) && rhs.hasType(cx.num)) return cx.num;
        var result = new AVal;
        lhs.propagate(new IsAdded(rhs, result));
        rhs.propagate(new IsAdded(lhs, result));
        return result;
      } else {
        infer(node.left, scope, ANull);
        infer(node.right, scope, ANull);
        return binopIsBoolean(node.operator) ? cx.bool : cx.num;
      }
    }),
    AssignmentExpression: ret(function(node, scope, name) {
      var rhs, pName;
      if (node.left.type == "MemberExpression") {
        pName = propName(node.left, scope);
        if (!name)
          name = node.left.object.type == "Identifier" ? node.left.object.name + "." + pName : pName;
      } else if (!name && node.left.type == "Identifier") {
        name = node.left.name;
      }

      if (node.operator && node.operator != "=" && node.operator != "+=") {
        infer(node.right, scope, ANull);
        rhs = cx.num;
      } else {
        rhs = infer(node.right, scope, null, name);
      }

      if (node.left.type == "MemberExpression") {
        var obj = infer(node.left.object, scope);
        if (pName == "prototype") maybeInstantiate(scope, 20);
        if (pName == "<i>") {
          // This is a hack to recognize for/in loops that copy
          // properties, and do the copying ourselves, insofar as we
          // manage, because such loops tend to be relevant for type
          // information.
          var v = node.left.property.name, local = scope.props[v], over = local && local.iteratesOver;
          if (over) {
            maybeInstantiate(scope, 20);
            var fromRight = node.right.type == "MemberExpression" && node.right.computed && node.right.property.name == v;
            over.forAllProps(function(prop, val, local) {
              if (local && prop != "prototype" && prop != "<i>")
                obj.propagate(new DefProp(prop, fromRight ? val : ANull));
            });
            return rhs;
          }
        }

        obj.propagate(new DefProp(pName, rhs, node.left.property));
        maybeAddPhantomObj(obj);
        if (node.right.type == "FunctionExpression")
          obj.propagate(node.right.scope.fnType.self, WG_SPECULATIVE_THIS);
      } else {
        connectPattern(node.left, scope, rhs);
      }
      return rhs;
    }),
    LogicalExpression: fill(function(node, scope, out) {
      infer(node.left, scope, out);
      infer(node.right, scope, out);
    }),
    ConditionalExpression: fill(function(node, scope, out) {
      infer(node.test, scope, ANull);
      infer(node.consequent, scope, out);
      infer(node.alternate, scope, out);
    }),
    NewExpression: fill(function(node, scope, out, name) {
      if (node.callee.type == "Identifier" && node.callee.name in scope.props)
        maybeInstantiate(scope, 20);

      for (var i = 0, args = []; i < node.arguments.length; ++i)
        args.push(infer(node.arguments[i], scope));
      var callee = infer(node.callee, scope);
      var self = new AVal;
      callee.propagate(new IsCtor(self, name && /\.prototype$/.test(name)));
      self.propagate(out, WG_NEW_INSTANCE);
      callee.propagate(new IsCallee(self, args, node.arguments, new IfObj(out)));
    }),
    CallExpression: fill(function(node, scope, out) {
      for (var i = 0, args = []; i < node.arguments.length; ++i)
        args.push(infer(node.arguments[i], scope));
      var outerFn = functionScope(scope).fnType;
      if (node.callee.type == "MemberExpression") {
        var self = infer(node.callee.object, scope);
        var pName = propName(node.callee, scope);
        if (outerFn && (pName == "call" || pName == "apply") &&
            outerFn.args.indexOf(self) > -1)
          maybeInstantiate(scope, 30);
        self.propagate(new HasMethodCall(pName, args, node.arguments, out));
      } else if (node.callee.type == "Super" && cx.curSuperCtor) {
        node.callee.superType = cx.curSuperCtor;
        cx.curSuperCtor.propagate(new IsCallee(getThis(scope), args, node.arguments, out));
        getThis(scope).propagate(out, WG_NEW_INSTANCE);
      } else {
        var callee = infer(node.callee, scope);
        if (outerFn && outerFn.args.indexOf(callee) > -1)
          maybeInstantiate(scope, 30);
        var knownFn = callee.getFunctionType();
        if (knownFn && knownFn.instantiateScore && outerFn)
          maybeInstantiate(scope, knownFn.instantiateScore / 5);
        callee.propagate(new IsCallee(cx.topScope, args, node.arguments, out));
      }
    }),
    AwaitExpression: fill(function(node, scope, out, name) {
      var arg = infer(node.argument, scope, null, name);
      var tp = arg.getType();
      if (tp && tp.constructor == Obj && tp.name == "Promise") {
        if (tp.hasProp(":t")) {
          tp.getProp(":t").propagate(out);
        }
      } else {
        arg.propagate(out);
      }
    }),
    MemberExpression: fill(function(node, scope, out) {
      var name = propName(node), wg;
      if (name == "<i>") {
        var propType = infer(node.property, scope);
        var symName = symbolName(propType);
        if (symName)
          name = node.propName = symName;
        else if (!propType.hasType(cx.num))
          wg = WG_MULTI_MEMBER;
      }
      infer(node.object, scope).getProp(name).propagate(out, wg);
    }),
    Identifier: ret(function(node, scope) {
      if (node.name == "arguments") {
        var fnScope = functionScope(scope, false);
        if (fnScope.fnType && !(node.name in fnScope.props))
          fnScope.defProp(node.name, fnScope.fnType.originNode)
            .addType(new Arr(fnScope.fnType.arguments = new AVal));
      }
      return scope.getProp(node.name);
    }),
    ThisExpression: ret(function(_node, scope) {
      return getThis(scope);
    }),
    Super: ret(function(node) {
      return node.superType = cx.curSuper || ANull;
    }),
    Literal: ret(function(node) {
      return literalType(node);
    }),
    TemplateLiteral: ret(function(node, scope) {
      for (var i = 0; i < node.expressions.length; ++i)
        infer(node.expressions[i], scope, ANull);
      return cx.str;
    }),
    TaggedTemplateExpression: fill(function(node, scope, out) {
      var args = [new Arr(cx.str)];
      for (var i = 0; i < node.quasi.expressions.length; ++i)
        args.push(infer(node.quasi.expressions[i], scope));
      infer(node.tag, scope, new IsCallee(cx.topScope, args, node.quasi.expressions, out));
    }),
    YieldExpression: ret(function(node, scope) {
      var output = ANull, fn = functionScope(scope).fnType;
      if (fn) {
        if (fn.retval == ANull) fn.retval = new AVal;
        if (!fn.yieldval) fn.yieldval = new AVal;
        output = fn.retval;
      }
      if (node.argument) {
        if (node.delegate) {
          infer(node.argument, scope, new HasMethodCall("next", [], null,
                                                        new GetProp("value", output)));
        } else {
          infer(node.argument, scope, output);
        }
      }
      return fn ? fn.yieldval : ANull;
    })
  };
  inferExprVisitor.ArrowFunctionExpression = inferExprVisitor.FunctionExpression;

  function infer(node, scope, out, name) {
    var handler = inferExprVisitor[node.type];
    return handler ? handler(node, scope, out, name) : ANull;
  }

  function loopPattern(init) {
    return init.type == "VariableDeclaration" ? init.declarations[0].id : init;
  }

  var inferWrapper = exports.inferWrapper = walk.make({
    Expression: function(node, scope) {
      infer(node, node.scope || scope, ANull);
    },

    ObjectExpression: function(node, scope) {
      infer(node, node.scope || scope, ANull);
    },

    FunctionDeclaration: function(node, scope, c) {
      var inner = node.scope, fn = inner.fnType;
      connectParams(node, inner);
      c(node.body, inner, "Statement");
      maybeTagAsInstantiated(node, fn) || maybeTagAsGeneric(fn);
      if (node.id) scope.getProp(node.id.name).addType(fn);
    },

    Statement: function(node, scope, c) {
      c(node, node.scope || scope);
    },

    ExportDefaultDeclaration: function(node, scope, c) {
      c(node.declaration, node.scope || scope);
    },

    VariableDeclaration: function(node, scope) {
      for (var i = 0; i < node.declarations.length; ++i) {
        var decl = node.declarations[i];
        if (decl.id.type == "Identifier") {
          var prop = scope.getProp(decl.id.name);
          if (decl.init)
            infer(decl.init, scope, prop, decl.id.name);
        } else if (decl.init) {
          connectPattern(decl.id, scope, infer(decl.init, scope));
        }
      }
    },

    ClassDeclaration: function(node, scope) {
      if (!node.id) inferClass(node, scope);
      else scope.getProp(node.id.name).addType(inferClass(node, scope, node.id.name));
    },

    ReturnStatement: function(node, scope) {
      if (!node.argument) return;
      var output = ANull, fn = functionScope(scope).fnType;
      if (fn) {
        if (fn.retval == ANull) fn.retval = new AVal;
        output = fn.retval;
      }
      infer(node.argument, scope, output);
    },

    ForInStatement: function(node, scope, c) {
      var source = infer(node.right, scope);
      if ((node.right.type == "Identifier" && node.right.name in scope.props) ||
          (node.right.type == "MemberExpression" && node.right.property.name == "prototype")) {
        maybeInstantiate(scope, 5);
        var pattern = loopPattern(node.left);
        if (pattern.type == "Identifier") {
          if (pattern.name in scope.props)
            scope.getProp(pattern.name).iteratesOver = source;
          source.getProp("<i>").propagate(ensureVar(pattern, scope));
        } else {
          connectPattern(pattern, scope, source.getProp("<i>"));
        }
      }
      c(node.body, scope, "Statement");
    },

    ForOfStatement: function(node, scope, c) {
      var pattern = loopPattern(node.left), target;
      if (pattern.type == "Identifier")
        target = ensureVar(pattern, scope);
      else
        connectPattern(pattern, scope, target = new AVal);

      if (node.await) {
        infer(node.right, scope, new HasMethodCall(":Symbol.asyncIterator", [], null,
                                                   new HasMethodCall("next", [], null,
                                                                     new GetProp(":t",
                                                                                 new GetProp("value", target)))));
      } else {
        infer(node.right, scope, new HasMethodCall(":Symbol.iterator", [], null,
                                                   new HasMethodCall("next", [], null,
                                                                     new GetProp("value", target))));
      }
      c(node.body, scope, "Statement");
    }
  });

  // PARSING

  var parse = exports.parse = function(text, options, thirdArg) {
    if (!options || Array.isArray(options)) options = thirdArg;
    var ast;
    try { ast = acorn.parse(text, options); }
    catch(e) { ast = acorn_loose.parse(text, options); }
    return ast;
  };

  // ANALYSIS INTERFACE

  exports.analyze = function(ast, name, scope) {
    if (typeof ast == "string") ast = parse(ast);

    if (!name) name = "file#" + cx.origins.length;
    exports.addOrigin(cx.curOrigin = name);

    if (!scope) scope = cx.topScope;
    cx.startAnalysis();

    walk.recursive(ast, scope, null, scopeGatherer);
    if (cx.parent) cx.parent.signal("preInfer", ast, scope);
    walk.recursive(ast, scope, null, inferWrapper);
    if (cx.parent) cx.parent.signal("postInfer", ast, scope);

    cx.curOrigin = null;
  };

  // PURGING

  exports.purge = function(origins, start, end) {
    var test = makePredicate(origins, start, end);
    ++cx.purgeGen;
    cx.topScope.purge(test);
    for (var prop in cx.props) {
      var list = cx.props[prop];
      for (var i = 0; i < list.length; ++i) {
        var obj = list[i], av = obj.props[prop];
        if (!av || test(av, av.originNode)) list.splice(i--, 1);
      }
      if (!list.length) delete cx.props[prop];
    }
  };

  function makePredicate(origins, start, end) {
    var arr = Array.isArray(origins);
    if (arr && origins.length == 1) { origins = origins[0]; arr = false; }
    if (arr) {
      if (end == null) return function(n) { return origins.indexOf(n.origin) > -1; };
      return function(n, pos) { return pos && pos.start >= start && pos.end <= end && origins.indexOf(n.origin) > -1; };
    } else {
      if (end == null) return function(n) { return n.origin == origins; };
      return function(n, pos) { return pos && pos.start >= start && pos.end <= end && n.origin == origins; };
    }
  }

  AVal.prototype.purge = function(test) {
    if (this.purgeGen == cx.purgeGen) return;
    this.purgeGen = cx.purgeGen;
    for (var i = 0; i < this.types.length; ++i) {
      var type = this.types[i];
      if (test(type, type.originNode))
        this.types.splice(i--, 1);
      else
        type.purge(test);
    }
    if (!this.types.length) this.maxWeight = 0;

    if (this.forward) for (var i = 0; i < this.forward.length; ++i) {
      var f = this.forward[i];
      if (test(f)) {
        this.forward.splice(i--, 1);
        if (this.props) this.props = null;
      } else if (f.purge) {
        f.purge(test);
      }
    }
  };
  ANull.purge = function() {};
  Obj.prototype.purge = function(test) {
    if (this.purgeGen == cx.purgeGen) return true;
    this.purgeGen = cx.purgeGen;
    for (var p in this.props) {
      var av = this.props[p];
      if (test(av, av.originNode))
        this.removeProp(p);
      av.purge(test);
    }
  };
  Fn.prototype.purge = function(test) {
    if (Obj.prototype.purge.call(this, test)) return;
    this.self.purge(test);
    this.retval.purge(test);
    for (var i = 0; i < this.args.length; ++i) this.args[i].purge(test);
  };

  // EXPRESSION TYPE DETERMINATION

  function findByPropertyName(name) {
    guessing = true;
    var found = objsWithProp(name);
    if (found) for (var i = 0; i < found.length; ++i) {
      var val = found[i].getProp(name);
      if (!val.isEmpty()) return val;
    }
    return ANull;
  }

  function generatorResult(input, output, async) {
    var defs = cx.definitions.ecmascript;
    var valObj = new Obj(true);
    valObj.defProp("done").addType(cx.bool);
    output.propagate(valObj.defProp("value"));
    var retObj = valObj;
    if (async && defs) {
      retObj = new Obj(defs["Promise.prototype"]);
      retObj.getType().propagate(new DefProp(':t', valObj));
    }
    var method = new Fn(null, ANull, input ? [input] : [], input ? ["?"] : [], retObj);
    var result = new Obj(defs ? async ? defs.async_generator_prototype : defs.generator_prototype : true);
    result.defProp("next").addType(method);
    return result;
  }

  function maybeIterator(fn, output) {
    if (!fn.generator) return output;
    if (!fn.computeRet) { // Reuse iterator objects for non-computed return types
      if (fn.generator === true) fn.generator = generatorResult(fn.yieldval, output, fn.async);
      return fn.generator;
    }
    return generatorResult(fn.yieldval, output, fn.async);
  }

  function computeReturnType(funcNode, argNodes, scope) {
    var fn = findType(funcNode, scope).getFunctionType();
    if (!fn) return ANull;
    var result = fn.retval;
    if (fn.computeRet) {
      for (var i = 0, args = []; i < argNodes.length; ++i)
        args.push(findType(argNodes[i], scope));
      var self = ANull;
      if (funcNode.type == "MemberExpression")
        self = findType(funcNode.object, scope);
      result = fn.computeRet(self, args, argNodes);
    }
    return maybeIterator(fn, result);
  }

  var typeFinder = exports.typeFinder = {
    ArrayExpression: function(node, scope) {
      return arrayLiteralType(node.elements, scope, findType);
    },
    ObjectExpression: function(node) {
      return node.objType;
    },
    ClassDeclaration: function(node) {
      return node.objType;
    },
    ClassExpression: function(node) {
      return node.objType;
    },
    FunctionDeclaration: function(node) {
      return node.scope.fnType;
    },
    FunctionExpression: function(node) {
      return node.scope.fnType;
    },
    ArrowFunctionExpression: function(node) {
      return node.scope.fnType;
    },
    SequenceExpression: function(node, scope) {
      return findType(node.expressions[node.expressions.length-1], scope);
    },
    UnaryExpression: function(node) {
      return unopResultType(node.operator);
    },
    UpdateExpression: function() {
      return cx.num;
    },
    BinaryExpression: function(node, scope) {
      if (binopIsBoolean(node.operator)) return cx.bool;
      if (node.operator == "+") {
        var lhs = findType(node.left, scope);
        var rhs = findType(node.right, scope);
        if (lhs.hasType(cx.str) || rhs.hasType(cx.str)) return cx.str;
      }
      return cx.num;
    },
    AssignmentExpression: function(node, scope) {
      return findType(node.right, scope);
    },
    LogicalExpression: function(node, scope) {
      var lhs = findType(node.left, scope);
      return lhs.isEmpty() ? findType(node.right, scope) : lhs;
    },
    ConditionalExpression: function(node, scope) {
      var lhs = findType(node.consequent, scope);
      return lhs.isEmpty() ? findType(node.alternate, scope) : lhs;
    },
    NewExpression: function(node, scope) {
      var f = findType(node.callee, scope).getFunctionType();
      var proto = f && f.getProp("prototype").getObjType();
      if (!proto) return ANull;
      return getInstance(proto, f);
    },
    CallExpression: function(node, scope) {
      return computeReturnType(node.callee, node.arguments, scope);
    },
    MemberExpression: function(node, scope) {
      var propN = propName(node), obj = findType(node.object, scope).getType();
      if (obj) return obj.getProp(propN);
      if (propN == "<i>") return ANull;
      return findByPropertyName(propN);
    },
    MethodDefinition: function(node) {
      var propN = propName(node), obj = getThis(node.value.scope).getType();
      if (obj) return obj.getProp(propN);
      return ANull;
    },
    Identifier: function(node, scope) {
      return scope.hasProp(node.name) || ANull;
    },
    ThisExpression: function(_node, scope) {
      return getThis(scope);
    },
    Literal: function(node) {
      return literalType(node);
    },
    Super: ret(function(node) {
      return node.superType;
    }),
    TemplateLiteral: function() {
      return cx.str;
    },
    TaggedTemplateExpression: function(node, scope) {
      return computeReturnType(node.tag, node.quasi.expressions, scope);
    },
    YieldExpression: function(_node, scope) {
      var fn = functionScope(scope).fnType;
      return fn ? fn.yieldval : ANull;
    }
  };

  function findType(node, scope) {
    var finder = typeFinder[node.type];
    return finder ? finder(node, scope) : ANull;
  }

  var searchVisitor = exports.searchVisitor = walk.make({
    Function: function(node, _st, c) {
      walk.base.Function(node, node.scope, c);
    },
    CatchClause: function(node, _st, c) {
      walk.base.CatchClause(node, node.scope, c);
    },
    Property: function(node, st, c) {
      if (node.computed) c(node.key, st, "Expression");
      if (node.key != node.value) c(node.value, st, "Expression");
    },
    Statement: function(node, st, c) {
      c(node, node.scope || st);
    },
    ImportSpecifier: function(node, st, c) {
      c(node.local, st);
    },
    ImportDefaultSpecifier: function(node, st, c) {
      c(node.local, st);
    },
    ImportNamespaceSpecifier: function(node, st, c) {
      c(node.local, st);
    }
  });
  var searchExprVisitor = exports.searchExprVisitor = walk.make({
    MemberExpression: function(node, st, c) {
      c(node.object, st, "Expression");
      if (node.computed) { c(node.property, st, "Expression"); }
    },
    Property: function(node, st, c) {
      if (node.computed) c(node.key, st, "Expression");
      c(node.value, st, "Expression");
    }
  }, searchVisitor);
  exports.fullVisitor = walk.make({
    MemberExpression: function(node, st, c) {
      c(node.object, st, "Expression");
      c(node.property, st, node.computed ? "Expression" : null);
    },
    Property: function(node, st, c) {
      if (node.computed) c(node.key, st, "Expression");
      c(node.value, st, "Expression");
    }
  }, searchVisitor);

  exports.findExpressionAt = function(ast, start, end, defaultScope, filter) {
    var test = filter || function(_t, node) {
      if (node.type == "Identifier" && node.name == "✖") return false;
      return typeFinder.hasOwnProperty(node.type);
    };
    return walk.findNodeAt(ast, start, end, test, searchExprVisitor, defaultScope || cx.topScope);
  };
  exports.findClosestExpression = function(ast, start, end, defaultScope, filter) {
    var test = filter || function(_t, node) {
      if (start != null && node.start > start) return false;
      if (node.type == "Identifier" && node.name == "✖") return false;
      return typeFinder.hasOwnProperty(node.type);
    };
    return walk.findNodeAround(ast, end, test, searchExprVisitor, defaultScope || cx.topScope);
  };

  exports.findExpressionAround = function(ast, start, end, defaultScope, filter) {
    var test = filter || function(_t, node) {
      if (start != null && node.start > start) return false;
      if (node.type == "Identifier" && node.name == "✖") return false;
      return typeFinder.hasOwnProperty(node.type);
    };
    return walk.findNodeAround(ast, end, test, searchVisitor, defaultScope || cx.topScope);
  };

  exports.expressionType = function(found) {
    return findType(found.node, found.state);
  };

  // Finding the expected type of something, from context

  exports.parentNode = function(child, ast) {
    var stack = [];
    function c(node, st, override) {
      if (node.start <= child.start && node.end >= child.end) {
        var top = stack[stack.length - 1];
        if (node == child) throw {found: top};
        if (top != node) stack.push(node);
        walk.base[override || node.type](node, st, c);
        if (top != node) stack.pop();
      }
    }
    try {
      c(ast, null);
    } catch (e) {
      if (e.found) return e.found;
      throw e;
    }
  };

  var findTypeFromContext = exports.findTypeFromContext = {
    ArrayExpression: function(parent, _, get) { return get(parent, true).getProp("<i>"); },
    ObjectExpression: function(parent, node, get) {
      for (var i = 0; i < parent.properties.length; ++i) {
        var prop = node.properties[i];
        if (prop.value == node)
          return get(parent, true).getProp(propName(prop));
      }
    },
    UnaryExpression: function(parent) { return unopResultType(parent.operator); },
    UpdateExpression: function() { return cx.num; },
    BinaryExpression: function(parent) { return binopIsBoolean(parent.operator) ? cx.bool : cx.num; },
    AssignmentExpression: function(parent, _, get) { return get(parent.left); },
    LogicalExpression: function(parent, _, get) { return get(parent, true); },
    ConditionalExpression: function(parent, node, get) {
      if (parent.consequent == node || parent.alternate == node) return get(parent, true);
    },
    CallExpression: function(parent, node, get) {
      for (var i = 0; i < parent.arguments.length; i++) {
        var arg = parent.arguments[i];
        if (arg == node) {
          var calleeType = get(parent.callee).getFunctionType();
          if (calleeType instanceof Fn)
            return calleeType.args[i];
          break;
        }
      }
    },
    ReturnStatement: function(_parent, node, get) {
      // tweaking search position to avoid endless recursion
      // when looking for definition of key in fn ( return fn ( return object ) )
      // see ternjs/tern#777
      var fnNode = walk.findNodeAround(node.sourceFile.ast, node.start - 1, "Function");
      if (fnNode) {
        var fnType = fnNode.node.type != "FunctionDeclaration"
          ? get(fnNode.node, true).getFunctionType()
          : fnNode.node.scope.fnType;
        if (fnType) return fnType.retval.getType();
      }
    },
    VariableDeclarator: function(parent, node, get) {
      if (parent.init == node) return get(parent.id);
    }
  };
  findTypeFromContext.NewExpression = findTypeFromContext.CallExpression;

  exports.typeFromContext = function(ast, found) {
    var parent = exports.parentNode(found.node, ast);
    var type = null;
    if (findTypeFromContext.hasOwnProperty(parent.type)) {
      var finder = findTypeFromContext[parent.type];
      type = finder && finder(parent, found.node, function(node, fromContext) {
        var obj = {node: node, state: found.state};
        var tp = fromContext ? exports.typeFromContext(ast, obj) : exports.expressionType(obj);
        return tp || ANull;
      });
    }
    return type || exports.expressionType(found);
  };

  // Flag used to indicate that some wild guessing was used to produce
  // a type or set of completions.
  var guessing = false;

  exports.resetGuessing = function(val) { guessing = val; };
  exports.didGuess = function() { return guessing; };

  exports.forAllPropertiesOf = function(type, f) {
    type.gatherProperties(f, 0);
  };

  exports.findRefs = function(ast, baseScope, name, refScope, f) {
    function handleId(node, scope, ancestors) {
      var parent = ancestors[ancestors.length - 2];
      if (parent.type == "MemberExpression" && !parent.computed && !!node.object) return;
      if (node.name != name ||
          (node == ast.id && ast.type == "FunctionDeclaration")) return;
      if (parent.property === node) return;
      for (var s = scope; s; s = s.prev) {
        if (s == refScope) f(node, scope, ancestors);
        if (name in s.props) return;
      }
    }
    walk.ancestor(ast, {Identifier: handleId, VariablePattern: handleId},
                  exports.fullVisitor, baseScope);
  };

  var simpleWalker = walk.make({
    Function: function(node, _scope, c) {
      c(node.body, node.scope, node.expression ? "Expression" : "Statement");
    },
    Statement: function(node, scope, c) {
      c(node, node.scope || scope);
    }
  });

  exports.findPropRefs = function(ast, scope, objType, name, f) {
    // Find the type which owns the property in hierarchy
    while (objType && !objType.props[name] && !(objType.maybeProps && objType.maybeProps[name])) {
      objType = objType.proto;
    }
    if (!objType) throw new Error("Couldn't locate property in the base object type.");

    function isObjTypeProto(type) {
      // Check whether the found type has objType in its hierarchy
      while (type && type != objType) {
        // Ff property is overriden higher in the hierarchy, return false
        if (type.props[name] || (type.maybeProps && type.maybeProps[name])) {
          return false;
        }
        type = type.proto;
      }
      return type;
    }

    walk.simple(ast, {
      MemberExpression: function(node, scope) {
        if (node.computed || propName(node) != name) return;
        if (isObjTypeProto(findType(node.object, scope).getType())) f(node.property, scope);
      },
      ObjectExpression: function(node, scope) {
        if (findType(node, scope).getType() != objType) return;
        for (var i = 0; i < node.properties.length; ++i)
          if (propName(node.properties[i]) == name) f(node.properties[i].key, scope);
      },
      MethodDefinition: function(node) {
        if (propName(node) != name) return;
        if (node.value && isObjTypeProto(getThis(node.value.scope).getType())) f(node.key, node.value.scope);
      }
    }, simpleWalker, scope);
  };

  // LOCAL-VARIABLE QUERIES

  var scopeAt = exports.scopeAt = function(ast, pos, defaultScope) {
    var found = walk.findNodeAround(ast, pos, function(_, node) {
      return node.scope;
    });
    if (found) return found.node.scope;
    else return defaultScope || cx.topScope;
  };

  exports.forAllLocalsAt = function(ast, pos, defaultScope, f) {
    var scope = scopeAt(ast, pos, defaultScope);
    scope.gatherProperties(f, 0);
  };

  // INIT DEF MODULE

  // Delayed initialization because of cyclic dependencies.
  def = exports.def = def.init({}, exports);
});

// Parses comments above variable declarations, function declarations,
// and object properties as docstrings and JSDoc-style type
// annotations.

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    return mod(require("../lib/infer"), require("../lib/tern"), require("../lib/comment"),
               require("acorn"), require("acorn-walk"));
  if (typeof define == "function" && define.amd) // AMD
    return define(["../lib/infer", "../lib/tern", "../lib/comment", "acorn/dist/acorn", "acorn-walk/dist/walk"], mod);
  mod(tern, tern, tern.comment, acorn, acorn.walk);
})(function(infer, tern, comment, acorn, walk) {
  "use strict";

  var WG_MADEUP = 1, WG_STRONG = 101;

  tern.registerPlugin("doc_comment", function(server, options) {
    server.mod.jsdocTypedefs = Object.create(null);
    server.on("reset", function() {
      server.mod.jsdocTypedefs = Object.create(null);
    });
    server.mod.docComment = {
      weight: options && options.strong ? WG_STRONG : undefined,
      fullDocs: options && options.fullDocs
    };

    server.on("postParse", postParse);
    server.on("postInfer", postInfer);
    server.on("postLoadDef", postLoadDef);
  });

  function postParse(ast, text) {
    function attachComments(node) { comment.ensureCommentsBefore(text, node); }

    walk.simple(ast, {
      VariableDeclaration: attachComments,
      FunctionDeclaration: attachComments,
      MethodDefinition: attachComments,
      Property: attachComments,
      AssignmentExpression: function(node) {
        if (node.operator == "=") attachComments(node);
      },
      CallExpression: function(node) {
        if (isDefinePropertyCall(node)) attachComments(node);
      },
      ExportNamedDeclaration: attachComments,
      ExportDefaultDeclaration: attachComments,
      ClassDeclaration: attachComments
    });
  }

  function isDefinePropertyCall(node) {
    return node.callee.type == "MemberExpression" &&
      node.callee.object.name == "Object" &&
      node.callee.property.name == "defineProperty" &&
      node.arguments.length >= 3 &&
      typeof node.arguments[1].value == "string";
  }

  function postInfer(ast, scope) {
    jsdocParseTypedefs(ast.sourceFile.text, scope);

    walk.simple(ast, {
      VariableDeclaration: function(node, scope) {
        var decl = node.declarations[0].id;
        if (node.commentsBefore && decl.type == "Identifier")
          interpretComments(node, node.commentsBefore, scope,
                            scope.getProp(node.declarations[0].id.name));
      },
      FunctionDeclaration: function(node, scope) {
        if (node.commentsBefore)
          interpretComments(node, node.commentsBefore, scope,
                            scope.getProp(node.id.name),
                            node.scope.fnType);
      },
      ClassDeclaration: function(node, scope) {
        if (node.commentsBefore)
          interpretComments(node, node.commentsBefore, scope,
                            scope.getProp(node.id.name),
                            node.objType);
      },
      AssignmentExpression: function(node, scope) {
        if (node.commentsBefore)
          interpretComments(node, node.commentsBefore, scope,
                            infer.expressionType({node: node.left, state: scope}));
      },
      ObjectExpression: function(node, scope) {
        for (var i = 0; i < node.properties.length; ++i) {
          var prop = node.properties[i];
          if (prop.type == 'SpreadElement') { continue; }
          var name = infer.propName(prop);
          if (name != "<i>" && prop.commentsBefore)
            interpretComments(prop, prop.commentsBefore, scope, node.objType.getProp(name));
        }
      },
      Class: function(node, scope) {
        if (!node.objType) return;
        var proto = node.objType.getProp("prototype").getObjType();
        if (!proto) return;
        for (var i = 0; i < node.body.body.length; i++) {
          var method = node.body.body[i], name;
          if (!method.commentsBefore) continue;
          if (method.kind == "constructor")
            interpretComments(method, method.commentsBefore, scope, node.objType);
          else if ((name = infer.propName(method)) != "<i>")
            interpretComments(method, method.commentsBefore, scope, proto.getProp(name));
        }
      },
      CallExpression: function(node, scope) {
        if (node.commentsBefore && isDefinePropertyCall(node)) {
          var type = infer.expressionType({node: node.arguments[0], state: scope}).getObjType();
          if (type && type instanceof infer.Obj) {
            var prop = type.props[node.arguments[1].value];
            if (prop) interpretComments(node, node.commentsBefore, scope, prop);
          }
        }
      },
      ExportNamedDeclaration: function(node, scope) {
        if (node.commentsBefore && node.declaration && node.declaration.type === 'FunctionDeclaration') {
          interpretComments(node.declaration, node.commentsBefore, scope,
                            scope.getProp(node.declaration.id.name),
                            node.declaration.scope.fnType);
        }
      },
      ExportDefaultDeclaration: function(node, scope) {
        if (node.commentsBefore && node.declaration && node.declaration.type === 'FunctionDeclaration') {
          interpretComments(node.declaration, node.commentsBefore, scope,
                            scope.getProp(node.declaration.id.name),
                            node.declaration.scope.fnType);
        }
      }
    }, infer.searchVisitor, scope);
  }

  function postLoadDef(data) {
    var defs = data["!typedef"];
    var cx = infer.cx(), orig = data["!name"];
    if (defs) for (var name in defs)
      cx.parent.mod.jsdocTypedefs[name] =
        maybeInstance(infer.def.parse(defs[name], orig, name), name);
  }

  // COMMENT INTERPRETATION

  function stripLeadingChars(lines) {
    for (var head, i = 1; i < lines.length; i++) {
      var line = lines[i], lineHead = line.match(/^[\s\*]*/)[0];
      if (lineHead != line) {
        if (head == null) {
          head = lineHead;
        } else {
          var same = 0;
          while (same < head.length && head.charCodeAt(same) == lineHead.charCodeAt(same)) ++same;
          if (same < head.length) head = head.slice(0, same);
        }
      }
    }
    lines = lines.map(function(line, i) {
      line = line.replace(/\s+$/, "");
      if (i == 0 && head != null) {
        for (var j = 0; j < head.length; j++) {
          var found = line.indexOf(head.slice(j));
          if (found == 0) return line.slice(head.length - j);
        }
      }
      if (head == null || i == 0) return line.replace(/^[\s\*]*/, "");
      if (line.length < head.length) return "";
      return line.slice(head.length);
    });
    while (lines.length && !lines[lines.length - 1]) lines.pop();
    while (lines.length && !lines[0]) lines.shift();
    return lines;
  }

  function interpretComments(node, comments, scope, aval, type) {
    jsdocInterpretComments(node, scope, aval, comments);
    var cx = infer.cx();

    if (!type && aval instanceof infer.AVal && aval.types.length) {
      type = aval.types[aval.types.length - 1];
      if (!(type instanceof infer.Obj) || type.origin != cx.curOrigin || type.doc)
        type = null;
    }

    for (var i = comments.length - 1; i >= 0; i--) {
      var text = stripLeadingChars(comments[i].split(/\r\n?|\n/)).join("\n");
      if (text) {
        if (aval instanceof infer.AVal) aval.doc = text;
        if (type) type.doc = text;
        break;
      }
    }
  }

  // Parses a subset of JSDoc-style comments in order to include the
  // explicitly defined types in the analysis.

  function skipSpace(str, pos) {
    while (/\s/.test(str.charAt(pos))) ++pos;
    return pos;
  }

  function isIdentifier(string) {
    if (!acorn.isIdentifierStart(string.charCodeAt(0))) return false;
    for (var i = 1; i < string.length; i++)
      if (!acorn.isIdentifierChar(string.charCodeAt(i))) return false;
    return true;
  }

  function parseLabelList(scope, str, pos, close) {
    var labels = [], types = [], madeUp = false;
    for (var first = true; ; first = false) {
      pos = skipSpace(str, pos);
      if (first && str.charAt(pos) == close) break;
      var colon = str.indexOf(":", pos);
      if (colon < 0) return null;
      var label = str.slice(pos, colon);
      if (!isIdentifier(label)) return null;
      labels.push(label);
      pos = colon + 1;
      var type = parseType(scope, str, pos);
      if (!type) return null;
      pos = type.end;
      madeUp = madeUp || type.madeUp;
      types.push(type.type);
      pos = skipSpace(str, pos);
      var next = str.charAt(pos);
      ++pos;
      if (next == close) break;
      if (next != ",") return null;
    }
    return {labels: labels, types: types, end: pos, madeUp: madeUp};
  }

  function parseTypeAtom(scope, str, pos) {
    var result = parseTypeInner(scope, str, pos);
    if (!result) return null;
    if (str.slice(result.end, result.end + 2) == "[]")
      return {madeUp: result.madeUp, end: result.end + 2, type: new infer.Arr(result.type)};
    else return result;
  }

  function parseType(scope, str, pos) {
    var type, union = false, madeUp = false;
    for (;;) {
      var inner = parseTypeAtom(scope, str, pos);
      if (!inner) return null;
      madeUp = madeUp || inner.madeUp;
      if (union) inner.type.propagate(union);
      else type = inner.type;
      pos = skipSpace(str, inner.end);
      if (str.charAt(pos) != "|") break;
      pos++;
      if (!union) {
        union = new infer.AVal;
        type.propagate(union);
        type = union;
      }
    }
    var isOptional = false;
    if (str.charAt(pos) == "=") {
      ++pos;
      isOptional = true;
    }
    return {type: type, end: pos, isOptional: isOptional, madeUp: madeUp};
  }

  function parseTypeInner(scope, str, pos) {
    pos = skipSpace(str, pos);
    if (/[?!]/.test(str.charAt(pos))) pos++;
    var type, madeUp = false;

    if (str.indexOf("function(", pos) == pos) {
      var args = parseLabelList(scope, str, pos + 9, ")"), ret = infer.ANull;
      if (!args) return null;
      pos = skipSpace(str, args.end);
      if (str.charAt(pos) == ":") {
        ++pos;
        var retType = parseType(scope, str, pos + 1);
        if (!retType) return null;
        pos = retType.end;
        ret = retType.type;
        madeUp = retType.madeUp;
      }
      type = new infer.Fn(null, infer.ANull, args.types, args.labels, ret);
    } else if (str.charAt(pos) == "[") {
      var inner = parseType(scope, str, pos + 1);
      if (!inner) return null;
      pos = skipSpace(str, inner.end);
      madeUp = inner.madeUp;
      if (str.charAt(pos) != "]") return null;
      ++pos;
      type = new infer.Arr(inner.type);
    } else if (str.charAt(pos) == "{") {
      var fields = parseLabelList(scope, str, pos + 1, "}");
      if (!fields) return null;
      type = new infer.Obj(true);
      for (var i = 0; i < fields.types.length; ++i) {
        var field = type.defProp(fields.labels[i]);
        field.initializer = true;
        fields.types[i].propagate(field);
      }
      pos = fields.end;
      madeUp = fields.madeUp;
    } else if (str.charAt(pos) == "(") {
      var inner = parseType(scope, str, pos + 1);
      if (!inner) return null;
      pos = skipSpace(str, inner.end);
      if (str.charAt(pos) != ")") return null;
      ++pos;
      type = inner.type;
    } else {
      var start = pos;
      if (!acorn.isIdentifierStart(str.charCodeAt(pos))) return null;
      while (acorn.isIdentifierChar(str.charCodeAt(pos))) ++pos;
      if (start == pos) return null;
      var word = str.slice(start, pos);
      if (/^(number|integer)$/i.test(word)) type = infer.cx().num;
      else if (/^bool(ean)?$/i.test(word)) type = infer.cx().bool;
      else if (/^string$/i.test(word)) type = infer.cx().str;
      else if (/^(null|undefined)$/i.test(word)) type = infer.ANull;
      else if (/^array$/i.test(word)) {
        var inner = null;
        if (str.charAt(pos) == "." && str.charAt(pos + 1) == "<") {
          var inAngles = parseType(scope, str, pos + 2);
          if (!inAngles) return null;
          pos = skipSpace(str, inAngles.end);
          madeUp = inAngles.madeUp;
          if (str.charAt(pos++) != ">") return null;
          inner = inAngles.type;
        }
        type = new infer.Arr(inner);
      } else if (/^object$/i.test(word)) {
        type = new infer.Obj(true);
        if (str.charAt(pos) == "." && str.charAt(pos + 1) == "<") {
          var key = parseType(scope, str, pos + 2);
          if (!key) return null;
          pos = skipSpace(str, key.end);
          if (str.charAt(pos++) != ",") return null;
          var val = parseType(scope, str, pos);
          if (!val) return null;
          pos = skipSpace(str, val.end);
          madeUp = key.madeUp || val.madeUp;
          if (str.charAt(pos++) != ">") return null;
          val.type.propagate(type.defProp("<i>"));
        }
      } else {
        while (str.charCodeAt(pos) == 46 ||
               acorn.isIdentifierChar(str.charCodeAt(pos))) ++pos;
        var path = str.slice(start, pos);
        var cx = infer.cx(), defs = cx.parent && cx.parent.mod.jsdocTypedefs, found;
        if (defs && (path in defs)) {
          type = defs[path];
        } else if (found = infer.def.parsePath(path, scope).getObjType()) {
          type = maybeInstance(found, path);
        } else {
          if (!cx.jsdocPlaceholders) cx.jsdocPlaceholders = Object.create(null);
          if (!(path in cx.jsdocPlaceholders))
            type = cx.jsdocPlaceholders[path] = new infer.Obj(null, path);
          else
            type = cx.jsdocPlaceholders[path];
          madeUp = true;
        }
      }
    }

    return {type: type, end: pos, madeUp: madeUp};
  }

  function maybeInstance(type, path) {
    if (type instanceof infer.Fn && /(?:^|\.)[A-Z][^\.]*$/.test(path)) {
      var proto = type.getProp("prototype").getObjType();
      if (proto instanceof infer.Obj) return infer.getInstance(proto);
    }
    return type;
  }

  function parseTypeOuter(scope, str, pos) {
    pos = skipSpace(str, pos || 0);
    if (str.charAt(pos) != "{") return null;
    var result = parseType(scope, str, pos + 1);
    if (!result) return null;
    var end = skipSpace(str, result.end);
    if (str.charAt(end) != "}") return null;
    result.end = end + 1;
    return result;
  }

  function jsdocInterpretComments(node, scope, aval, comments) {
    var type, args, ret, foundOne, self, parsed;

    for (var i = 0; i < comments.length; ++i) {
      var comment = comments[i];
      var decl = /(?:\n|\*)\s*@(type|param|arg(?:ument)?|returns?|this|class|constructor)(?:\s*?\n|\s+(.*))/g, m;
      while (m = decl.exec(comment)) {
        if (m[1] == "class" || m[1] == "constructor") {
          self = foundOne = true;
          continue;
        }

        if (m[2] === undefined) continue; // to avoid tags that require a type argument.

        if (m[1] == "this" && (parsed = parseType(scope, m[2], 0))) {
          self = parsed;
          foundOne = true;
          continue;
        }

        if (!(parsed = parseTypeOuter(scope, m[2]))) continue;
        foundOne = true;

        switch(m[1]) {
        case "returns": case "return":
          ret = parsed; break;
        case "type":
          type = parsed; break;
        case "param": case "arg": case "argument":
            // Possible jsdoc param name situations:
            // employee
            // [employee]
            // [employee=John Doe]
            // employee.name
            // employees[].name
            var name = m[2].slice(parsed.end).match(/^\s*(\[?)\s*([^\[\]\s=]+(\[\][^\[\]\s=]+)?)\s*(?:=[^\]]+\s*)?(\]?).*/);
            if (!name) continue;
            var argname = name[2] + (parsed.isOptional || (name[1] === '[' && name[4] === ']') ? "?" : "");

            // Check to see if the jsdoc is indicating a property of a previously documented parameter
            var isObjProp = false;
            var parts = argname.split('.');
            if (args && parts.length == 2) {
              var objname = parts[0];
              argname = parts[1];

              // Go through each of the previously found parameter to find the
              // object or array for which this new parameter should be a part
              // of
              var key, value;
              for (key in args) {
                value = args[key];

                if (key === objname && value.type instanceof infer.Obj) {
                  isObjProp = true;
                  parsed.type.propagate(value.type.defProp(argname));
                }
                else if (key + '[]' === objname && value.type instanceof infer.Arr) {
                  isObjProp = true;
                  parsed.type.propagate(value.type.getProp("<i>").getType().defProp(argname));
                }
              }
            }
            if (!isObjProp) {
              (args || (args = Object.create(null)))[argname] = parsed;
            }
          break;
        }
      }
    }

    if (foundOne) applyType(type, self, args, ret, node, aval);
  }

  function jsdocParseTypedefs(text, scope) {
    var cx = infer.cx();

    var re = /\s@typedef\s+(.*)/g, m;
    while (m = re.exec(text)) {
      var parsed = parseTypeOuter(scope, m[1]);
      var name = parsed && m[1].slice(parsed.end).match(/^\s*(\S+)/);
      if (name && parsed.type instanceof infer.Obj) {
        var rest = text.slice(m.index + m[0].length);
        while (m = /\s+@prop(?:erty)?\s+(.*)/.exec(rest)) {
          var propType = parseTypeOuter(scope, m[1]), propName;
          if (propType && (propName = m[1].slice(propType.end).match(/^\s*(\S+)/)))
            propType.type.propagate(parsed.type.defProp(propName[1]));
          rest = rest.slice(m[0].length);
        }
        cx.parent.mod.jsdocTypedefs[name[1]] = parsed.type;
      }
    }
  }

  function propagateWithWeight(type, target) {
    var weight = infer.cx().parent.mod.docComment.weight;
    type.type.propagate(target, weight || (type.madeUp ? WG_MADEUP : undefined));
  }

  function isFunExpr(node) { return node.type == "FunctionExpression" || node.type == "ArrowFunctionExpression" }

  function applyType(type, self, args, ret, node, aval) {
    var fn;
    if (node.type == "VariableDeclaration") {
      var decl = node.declarations[0];
      if (decl.init && isFunExpr(decl.init)) fn = decl.init.scope.fnType;
    } else if (node.type == "FunctionDeclaration") {
      fn = node.scope.fnType;
    } else if (node.type == "AssignmentExpression") {
      if (isFunExpr(node.right))
        fn = node.right.scope.fnType;
    } else if (node.type == "CallExpression" || node.type === "ClassDeclaration") {
    } else { // An object property
      if (isFunExpr(node.value)) fn = node.value.scope.fnType;
    }

    if (fn && (args || ret || self)) {
      if (args) for (var i = 0; i < fn.argNames.length; ++i) {
        var name = fn.argNames[i], known = args[name];
        if (!known && (known = args[name + "?"]))
          fn.argNames[i] += "?";
        if (known) propagateWithWeight(known, fn.args[i]);
      }
      if (ret) {
        if (fn.retval == infer.ANull) fn.retval = new infer.AVal;
        propagateWithWeight(ret, fn.retval);
      }
      if (self === true) {
        var proto = fn.getProp("prototype").getObjType();
        self = proto && {type: infer.getInstance(proto, fn)};
      }
      if (self) propagateWithWeight(self, fn.self);
    } else if (type) {
      propagateWithWeight(type, aval);
    }
  }
});
