             
/* This is a function that parses a CSV file or a classlist (LST) file and fills an HTML table for viewing.
 * The part of the code that parses the CSV file was found (and is documented well) at http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
 * 
 */
             
define(['underscore','config'], function(_,config){
var util = {             
    CSVToHTMLTable: function( strData,headers, strDelimiter ){
        strDelimiter = (strDelimiter || ",");
        
        // First strip out any lines that begin with #.  This is to allow the legacy .lst (classlist) files to be easily imported.  
        
        var lines = strData.split("\n");
        var newData = [];
        var poundPattern = new RegExp("^\\s*#");
        _(lines).each(function(line) {if (! (poundPattern.test(line))) {newData.push(line);}});
        
        var updatedData = newData.join("\n");
        
        
        var objPattern = new RegExp(("(\\" + strDelimiter + "|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                        "([^\"\\" + strDelimiter + "\\r\\n]*))"),"gi");
        var arr = [[]];
        var arrMatches = null;
        while (arrMatches = objPattern.exec( updatedData )){
                var strMatchedDelimiter = arrMatches[ 1 ];
                if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)){
                        arr.push( [] );
                }

                if (arrMatches[ 2 ]){
                        var strMatchedValue = arrMatches[ 2 ].replace(new RegExp( "\"\"", "g" ),"\"");
                } else {
                        var strMatchedValue = arrMatches[ 3 ];
                }
                arr[ arr.length - 1 ].push( strMatchedValue );
        }

        var str = "<table id='sTable'><thead><td><input  id='selectAllASW' type='checkbox'></input></td>";
        for (var k = 0; k < arr[0].length; k++){
            str += "<td><select class='colHeader' id='col" + k + "'>";
            for (var i=0; i< headers.length; i++){
            str += "<option>" + headers[i] + "</option>";}
            str += "</select></td>";
        }
        str += "</thead><tbody><tr><td colspan='" + (arr[0].length+1) + "' style='padding: 0px;'><div class='inner'><table id='inner-table'><tbody>"
        for (var i in arr){
            str += "<tr id='row" + i + "'><td><input  id='cbrow" + i + "' type='checkbox' class='selRow'></input></td>";
            for (var j in arr[i]){
                str += "<td class='column" + j + "'>" + arr[i][j] + "</td>";
            }
            str += "</tr>"
        }
        str += "</tbody></table></div></td></tr></tbody></table>";
        return str;
     },
     readSetDefinitionFile: function(file){
        var self = this;
        var problemSet = {}
            , problems = []
            , lines = file.split("\n")
            , varRegExp = /^(\w+)\s*=\s*([\w\/\s:]*)$/
            , i,j, result;
        _(lines).each(function(line,lineNum){
            var matches = varRegExp.exec(line);
            if(line.match(/^\s*$/)){return;} // skip any blank lines
            if(matches){
                if(matches[1]==="problemList"){
                    for(i=lineNum+1,j=1;i<lines.length;i++,j++){
                        if(! lines[i].match(/^\s*$/)){
                            result = lines[i].split(",");
                            problems.push({source_file: result[0], value: result[1],max_attempts: result[2],
                                problem_id: j});
                        }
                    }
                    problemSet.problems=problems;
                } else {
                    switch(matches[1]){
                        case "openDate":
                            problemSet.open_date = matches[2];
                            break;
                        case "dueDate": 
                            problemSet.due_date = matches[2];
                            break;
                        case "answerDate": 
                            problemSet.answer_date = matches[2];
                            break;
                        case "paperHeaderFile":
                            problemSet.hardcopy_header = matches[2];
                            break;
                        case "screenHeaderFile":
                            problemSet.set_header = matches[2];
                            break;
                    }
                }
            }
        });

        return problemSet;

        // now process the problemList
    },
    invertBindings: function(bindings){
        return  _(_.object(_(bindings).keys().map(function(key) {
                    return [key, _.isObject(bindings[key])? bindings[key].observe : bindings[key]];}))).invert();

    },
    pluckDateSettings: function(settings){
        var dateVars = ["pg{timeAssignDue}","pg{assignOpenPriorToDue}","pg{answersOpenAfterDueDate}"];
        var values = settings.chain().filter(function(_set){
            return _(dateVars).contains(_set.get("var"))
        })
            .map(function(_set){ 
                return _set.get("value")
            }).value();
        return _.object(dateVars,values);
    }
}


return util;

});