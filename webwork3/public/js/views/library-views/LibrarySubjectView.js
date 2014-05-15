define(['backbone', 'underscore','views/library-views/LibraryView','views/library-views/LibraryTreeView'], 
function(Backbone, _,LibraryView,LibraryTreeView){
    var LibrarySubjectView = LibraryView.extend({
    	initialize: function(options){
    		LibraryView.prototype.initialize.apply(this,[options]);
            this.libraryTreeView = new LibraryTreeView({type: options.libBrowserType,allProblemSets: options.problemSets});
            this.libraryTreeView.libraryTree.on("library-selected", this.loadProblems);            
    	},
    	loadProblems: function(_dirs){
    		path = "";
    		if (_dirs[0]) {path += "/subjects/" + _dirs[0];}
	        if (_dirs[1]) {path += "/chapters/" + _dirs[1];}
            if (_dirs[2]) {path += "/sections/" + _dirs[2];}
    		console.log(path);
    		LibraryView.prototype.loadProblems.apply(this,[path]);
    	}


    });

    return LibrarySubjectView;

});
