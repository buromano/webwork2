define(['backbone', 'views/ProblemListView','config'], 
    function(Backbone, ProblemListView,config) {
    	var LibraryProblemsView = ProblemListView.extend({
    		initialize: function (options) {
	            this.viewAttrs = {reorderable: false, showPoints: false, showAddTool: true, showEditTool: true, problem_seed: 1,
                    showRefreshTool: true, showViewTool: true, showHideTool: true, deletable: false, draggable: true,
                    show_undo: false};
                this.allProblemSets = options.allProblemSets;
                this.libraryView = options.libraryView;
                this.type = options.type;
                ProblemListView.prototype.initialize.apply(this,[options]);
    		},
            render: function(){
                  ProblemListView.prototype.render.appy(this);
                  this.$(".prob-list-container").height($(window).height()-((this.maxPages==1) ? 200: 250))  
            }
    	});


    	return LibraryProblemsView;
});
