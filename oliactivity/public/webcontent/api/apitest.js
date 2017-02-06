/* 
 * @(#)apitest.js $Date: 2016/11/03 
 * 
 * Copyright (c) 2016 Carnegie Mellon University.
 */

var internalJSONObject= null;

useDebugging=true;
 
/**
*
*/
function addTableData (aName,aValue)
{
	var table = document.getElementById("olienvironment");
	
	var row = table.insertRow(0);

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);

	cell1.setAttribute("width", "100");
	cell1.setAttribute("height", "25");
	cell1.innerHTML = aName;
	cell2.setAttribute("height", "25");
	//cell2.innerHTML = aValue;
	
	var input = document.createElement("input");
	input.id="timeZone";
	input.type = "text";
	input.style = "width: 100%;"; // set the CSS class
	input.value=aValue;
	cell2.appendChild(input); // put it into the DOM			
};

/**
*
*/
function build ()
{			
	olidebug ("build ()");
	
	var superClient=APIActivity.getSuperActivityObject ();
	
	//pointer.addTableData ("Workbook Title",workbookTitle);
	addTableData ("webContentFolder",superClient.webContentFolder);
	addTableData ("currentAttempt",superClient.currentAttempt);
	addTableData ("sessionId",superClient.sessionId);
	addTableData ("resourceId",superClient.resourceId);
	addTableData ("activityGuid",superClient.activityGuid);
	addTableData ("timeZone",superClient.timeZone);
	addTableData ("logServiceUrl",superClient.logServiceUrl);
	
	internalJSONObject=APIActivity.getSuperClient ();
	var jsonString=JSON.stringify (internalJSONObject);
	
	olidebug ("Propagating JSON: " + jsonString);
	
	$('#element').jsonView(jsonString);
}
