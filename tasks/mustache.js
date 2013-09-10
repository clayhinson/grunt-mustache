/*
 * grunt-mustache
 * https://github.com/phun-ky/grunt-mustache
 *
 * Copyright (c) 2012 Alexander Vassbotn Røyne-Helgesen
 * Modified 12/2012 Nils P. Ellingsen
 * Licensed under the GPL license.
 *
 */
'use strict';

var templateContent = '';
var templateCount = 0;

var colors = require('colors');

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('mustache', 'Concat mustache templates into a JSON string or JS object.', function() {

    var _templateDest     = this.data.dest,
        _opts             = this.options(),
        _fileExt          = _opts.extension || 'mustache',
        // Set *fixes, if not set, use () to produce correct JavaScript syntax
        _prefix           = _opts.prefix || '(',
        _postfix          = _opts.postfix || ')',
        _templateOutput   = _prefix + '{';

    _opts.extension = _fileExt;

    this.filesSrc.forEach(function(file){

      grunt.file.recurse( file, function(abspath, rootdir, subdir, filename){
        mustacheCallback(abspath, filename, _opts);
      });
      // replace any tabs and linebreaks and double spaces
      _templateOutput += templateContent.replace( /\r|\n|\t|\s\s/g, '');

    });

    templateContent = '';
    _templateOutput += ' "done": "true"}' + _postfix;

    grunt.file.write(_templateDest, _templateOutput);

    if (_opts.verbose) {
      grunt.log.writeln('File "' + _templateDest.yellow + '" created.');
    }

    grunt.log.ok(String(templateCount).cyan + ' *.'+ _fileExt + ' templates baked into ' + _templateDest.yellow);
  });

  // ==========================================================================
  // CALLBACKS
  // ==========================================================================

  function mustacheCallback(abspath, filename, opts){
    var useFullPath = opts.useFullPath || false,
        fileKey = (useFullPath) ? abspath : filename.split('.'+opts.extension)[0];

    // loop thru all template files: using filename for key, template contents as value
    if (abspath.split('.').pop() === opts.extension) {
      templateCount++;
      templateContent += '"' + fileKey + '"' + ' : \'' + grunt.file.read(abspath) + '\',';

      if (opts.verbose) {
        grunt.log.writeln('Reading file: '.white + filename.yellow);
      }
    }
  }


};
