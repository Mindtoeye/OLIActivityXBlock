/**
*
*/

var feedback=[];
var asubmit=null;
var anext=null;
var div=null;
var problemDefinitions=[];
var problems=[];
var stripPrePost=true;
var problemPrefix="Pre_assessment_";
var problemPostfix="Post_assessment_";
var eventListeners=[];

/**
*
*/
function addEventListenerTracker (aTarget,aFunction)
{
	olidebug ("addEventListenerTracker ("+eventListeners.length+")");
	
	var eventObject={};
	eventObject.target=aTarget;
	eventObject.targetFunction=aFunction;
	eventListeners [eventListeners.length]=eventObject;
}

/**
*
*/
function clearEventListenersTrackers ()
{
	olidebug ("clearEventListeners ("+eventListeners.length+")");
	
	for (var i=0;i<eventListeners.length;i++)
	{
		var eventObject=eventListeners [i];
		
		olidebug ("Removing event listener...");
		
		document.getElementById(eventObject.target).removeEventListener("click", eventObject.targetFunction);
	}

	eventListeners=[];
}

/**
*
*/
function prepProblemName (aName)
{
	olidebug ("prepProblemName ("+aName+")")
	
	if (stripPrePost==true)
	{
		if (aName.indexOf (problemPrefix)!=-1)
		{
			return (aName.substr (problemPrefix.length));
		}
		
		if (aName.indexOf (problemPostfix)!=-1)
		{
			return (aName.substr (problemPostfix.length));
		}		
	}
	
	return (aName);
}

/**
*
*/
function showFeedback (aMessage)
{
	document.getElementById ("feedback").innerHTML=aMessage;
}


/**
*
*/
function createCheckboxElement (aparent,name, checked, value, label) 
{
	checkboxInput = document.createElement('input');
	checkboxInput.setAttribute('type', 'checkbox');
	checkboxInput.setAttribute('name', name);
	checkboxInput.setAttribute('value', value);
	checkboxInput.setAttribute('id', value);
			
	if (checked) 
	{
		checkboxInput.setAttribute('checked', 'checked');
	}
	
	aparent.appendChild (checkboxInput);
	aparent.appendChild (document.createTextNode(label));
	aparent.appendChild (document.createElement('br'));	
}

/**
*
*/
function createRadioElement (aparent,name, checked, value, label) 
{
    var radioInput;
	
    try 
	{
        var radioHtml = '<input id='+value+' type="radio" name="' + name + ' "value="' + value + '"';
		
        if (checked)
		{
            radioHtml += ' checked="checked"';
        }
		
        radioHtml += '/>';
		radioHtml += label;
		radioHtml += '<br>';
        radioInput = document.createElement(radioHtml);
		
		aparent.appendChild (radioInput);
    } 
	catch(err) 
	{
        radioInput = document.createElement('input');
        radioInput.setAttribute('type', 'radio');
        radioInput.setAttribute('name', name);
		radioInput.setAttribute('value', value);
		radioInput.setAttribute('id', value);
				
        if (checked) 
		{
            radioInput.setAttribute('checked', 'checked');
        }
		
		aparent.appendChild (radioInput);
		aparent.appendChild (document.createTextNode(label));
		aparent.appendChild (document.createElement('br'));
    }

    return "";
}
/**
 *
 */
function getNodeTextValue (aNode)
{
	//this.ctatdebug ("getNodeTextValue ()");

	if (aNode==null)
	{
		//this.ctatdebug ("Node argument is null");
		return ("");
	}

	if (aNode.childNodes==null)
	{
		//this.ctatdebug ("Node does not have any children");
		return (aNode.nodeValue);
	}

	if (aNode.childNodes.length==0)
	{
		//this.ctatdebug ("Node has children size of 0");
		return ("");
	}

	//this.ctatdebug ("First do a check to see if it has a 'value' sub element");

	var entries=aNode.childNodes;

	for (var t=0;t<entries.length;t++)
	{
		var entry=entries [t];

		//console.log ("entry.nodeName: " + entry.nodeName + ", entry.childNodes.length: " + entry.childNodes.length);

		if ((entry.nodeName=="value") || (entry.nodeName=="Value"))
		{
			if(entry.childNodes.length==1)
			{
				//console.log ("Data: ("+entry.childNodes[0].nodeName+")" + entry.childNodes[0].nodeValue);

				return (entry.childNodes[0].nodeValue);
			}
			else
			{
				if(entry.childNodes.length==0)
				{
					//console.log ("Bottoming out? " + aNode.childNodes[0].nodeValue);

					return (aNode.childNodes[0].nodeValue);
				}
				else
				{
					//console.log ("Data: ("+entry.childNodes[1].nodeName+")" + entry.childNodes[1].nodeValue);

					return (entry.childNodes[1].nodeValue);
				}
			}
		}
	}

	//this.ctatdebug ("Bottoming out ...");

	return (aNode.childNodes[0].nodeValue);
};

/**
*
*/
function generateProblemFromNode (xmlNode)
{
	olidebug ("generateProblemFromNode ()");
	
	clearEventListenersTrackers ();
	
	var aDriver=APIActivity.getAdaptiveDriver ();
	aDriver.setAttemptCount (0);
		
	div = document.getElementById('problemcontent');		
	
	// Clear the content first because we will be creating brand new html objects
	$('#problemcontent').html('');
		
	attr=xmlNode.attributes;
	var match=null;
	var score=null;
	var questionID=attr.getNamedItem("id").nodeValue;
	var questionType='single';
	
	try
	{	
		if (attr.getNamedItem("select"))
		{
			questionType=attr.getNamedItem("select").nodeValue;
		}
		else
		{
			olidebug ("Error: malformed XML: multiple choice object does not have a select attribute");
		}
	}
	catch(err) 
	{
		olidebug ("Error: malformed XML");
	}
	
	var questionItems=xmlNode.childNodes;
	feedback=[];

	if (questionType=="single")
	{
		olidebug ("Processing multiple choice xml ("+questionID+") ...");
	}
	else	
	{
		olidebug ("Processing multiple select xml ("+questionID+") ...");		
	}

	if (questionType=="multiple")
	{
		for (var j=0;j<questionItems.length;j++)
		{
			var aNode=questionItems [j];
			
			//olidebug ("Found node name: " + aNode.nodeName);
			
			if (aNode.nodeName=="body")
			{
				var bodyText=new XMLSerializer().serializeToString(aNode);
				
				//olidebug ("Adding body: " + bodyText);
				
				div.innerHTML=bodyText;
			}
			
			if (aNode.nodeName=="input")
			{
				//olidebug ("Adding input");
				
				var options=aNode.childNodes;
				
				for (var k=0;k<options.length;k++)
				{
					var anOption=options [k];
					
					//olidebug ("Processing node: " + anOption.nodeName);
				
					if (anOption.nodeName=="choice")
					{
						var optionid=anOption.getAttribute ('value');
					
						createCheckboxElement (div,'questiongroup',false,optionid,getNodeTextValue (anOption));
					}	
				}	
			}

			if (aNode.nodeName=="part")
			{
				//olidebug ("Adding parts ...");
				
				var parts=aNode.childNodes;					
				
				for (var l=0;l<parts.length;l++)
				{
					var aPart=parts [l];
					
					//olidebug ("Processing part: " + aPart.nodeName);	

					if (aPart.nodeName=="response")
					{
						match=aPart.getAttribute ('match').split (",");
						score=aPart.getAttribute ('score');
						
						//var feedbackText=getNodeTextValue (aPart.getElementsByTagName("feedback")[0]);
						var feedbackText=aPart.getElementsByTagName ("feedback")[0].textContent;
													
						var newFeedback={"match" : match, "score" : parseInt (score), "feedback" : feedbackText};
						feedback.push (newFeedback);
					}
				}						
			}				
		}
	}	
	else
	{
		for (var j=0;j<questionItems.length;j++)
		{
			var aNode=questionItems [j];
			
			//olidebug ("Found node name: " + aNode.nodeName);
			
			if (aNode.nodeName=="body")
			{
				var bodyText=new XMLSerializer().serializeToString(aNode);
				
				//olidebug ("Adding body: " + bodyText);
				
				div.innerHTML=bodyText;
			}
			
			if (aNode.nodeName=="input")
			{
				//olidebug ("Adding input");
				
				var options=aNode.childNodes;
				
				for (var k=0;k<options.length;k++)
				{
					var anOption=options [k];
					
					//olidebug ("Processing node: " + anOption.nodeName);
				
					if (anOption.nodeName=="choice")
					{
						var optionid=anOption.getAttribute ('value');
					
						createRadioElement (div,'questiongroup',false,optionid,getNodeTextValue (anOption));
					}	
				}	
			}

			if (aNode.nodeName=="part")
			{
				//olidebug ("Adding parts ...");
				
				var parts=aNode.childNodes;					
				
				for (var l=0;l<parts.length;l++)
				{
					var aPart=parts [l];
					
					//olidebug ("Processing part: " + aPart.nodeName);	

					if (aPart.nodeName=="response")
					{
						match=aPart.getAttribute ('match').split (",");
						score=aPart.getAttribute ('score');
						
						//var feedbackText=getNodeTextValue (aPart.getElementsByTagName("feedback")[0]);
						var feedbackText=aPart.getElementsByTagName ("feedback")[0].textContent;
													
						var newFeedback={"match" : match, "score" : parseInt (score), "feedback" : feedbackText};
						feedback.push (newFeedback);
					}
				}						
			}				
		}		
	}
	
	//>------------------------------------------------------------------------
	
	asubmit = document.createElement('input');
	asubmit.setAttribute("id", "check");
	asubmit.setAttribute("type", "submit");
    asubmit.setAttribute('value', 'Check');
	
	if (questionType=="single")
	{
		asubmit.addEventListener("click", processRadioCheck);
		addEventListenerTracker ("check",processRadioCheck);
	}	
	else
	{
		asubmit.addEventListener("click", processCheckboxCheck);		
		addEventListenerTracker ("check",processCheckboxCheck);
	}
			
	//>------------------------------------------------------------------------	
	
	div.appendChild (document.createElement('br'));
	div.appendChild (asubmit);
	
	//>------------------------------------------------------------------------

    anext = document.createElement('input');
	anext.setAttribute("id", "next");
	anext.setAttribute("type", "submit");
    anext.setAttribute('value', 'Next');
	anext.setAttribute('style', 'visibility: hidden; margin: 0px; margin-left: 10px;');
	anext.addEventListener("click", processQuestionNext);
	
	addEventListenerTracker ("next",processQuestionNext);
	
	div.appendChild (anext);	
}

/**
*
*/
function processRadioCheck()
{		
	olidebug ("processRadioCheck()");

	var testScore="-1";
	var aSelection="-1";
	var aDriver=APIActivity.getAdaptiveDriver ();
	aDriver.incAttemptCount ();
	var correctComplete=0;

	if (document.querySelector('input[name = "questiongroup"]:checked')!=null)
	{
		var choice = document.querySelector('input[name = "questiongroup"]:checked').id;
	
		olidebug ("Grading " + choice + "...");
		
		for (var i=0;i<feedback.length;i++)
		{
			aSelection=feedback [i];
			
			olidebug ("Comparing ("+aSelection.match.length+" potential matches) to ("+choice+")");
			
			for (var j=0;j<aSelection.match.length;j++)
			{			
				var testMatch=aSelection.match [j];
		
				if (testMatch==choice)
				{
					olidebug ("testMatch ("+testMatch+")==choice("+choice+")");
					
					correctComplete++;
					
					showFeedback (aSelection.feedback);
					
					testScore=Number(aSelection.score);
					
					if (aSelection.feedback.indexOf ("Correct")==0)
					{
						anext.setAttribute('style', 'visibility: visible');
						document.getElementById("check").disabled = true;
						
						aDriver.indicateProblemComplete (true,aDriver.getAttemptCount ());
					}
					else
					{
						aDriver.indicateProblemComplete (false,aDriver.getAttemptCount ());
					}
					
					/*
					olidebug ("Score for aSelection is: " + testScore)
					
					//if (testScore>0) // In other words: correct
					if (testScore==10)
					{
						anext.setAttribute('style', 'visibility: visible');
						document.getElementById("check").disabled = true;
						
						aDriver.indicateProblemComplete (true,aDriver.getAttemptCount ());
					}
					else
					{
						aDriver.indicateProblemComplete (false,aDriver.getAttemptCount ());
					}
					*/
					
					return;
				}
			}	
		}
	}
	else
	{
		showFeedback ("Please make a aSelection first");
	}
}

/**
*
*/
function compareQandA (arrayA, arrayB) 
{
	if (arrayA.length != arrayB.length) 
	{ 
		return false; 
	}
	// sort modifies original array
	// (which are passed by reference to our method!)
	// so clone the arrays before sorting
	var a = jQuery.extend(true, [], arrayA);
	var b = jQuery.extend(true, [], arrayB);
	
	a.sort(); 
	
	b.sort();
	
	for (var i = 0, l = a.length; i < l; i++) 
	{
		if (a[i] !== b[i]) 
		{			
			return false;
		}
	}
		
	return true;
}

/**
*
*/
function processCheckboxCheck()
{		
	olidebug ("processCheckboxCheck()");

	var testScore="-1";
	var aSelection="-1";
	var aDriver=APIActivity.getAdaptiveDriver ();
	aDriver.incAttemptCount ();
	var correctComplete=0;
	var selected = [];
	
	$('input[name = "questiongroup"]:checked').each(function() 
	{
		selected.push($(this).attr('id'));
	});
	
	if (selected.length>0)
	{
		var found=false;
		
		for (var i=0;i<feedback.length;i++)
		{
			tSelection=feedback [i];
			
			if (compareQandA (selected,tSelection.match)==true)
			{
				showFeedback (tSelection.feedback);
				
				if (tSelection.feedback.indexOf ("Correct")==0)
				{
					anext.setAttribute('style', 'visibility: visible');
					document.getElementById("check").disabled = true;
					
					aDriver.indicateProblemComplete (true,aDriver.getAttemptCount ());
				}
				else
				{
					aDriver.indicateProblemComplete (false,aDriver.getAttemptCount ());
				}				
				
				found=true;
			}		
		}
		
		if (found==false)
		{
			for (var j=0;j<feedback.length;j++)
			{
				var tSelection=feedback [j];
				
				if (tSelection.match [0]=="*")				
				{
					showFeedback (tSelection.feedback);
				}
			}	
		}
	}
	else
	{
		showFeedback ("Please make a aSelection first");
	}
}

/**
*
*/
function processQuestionNext()
{		
	olidebug ("processQuestionNext ()");
		
	showFeedback ("Please wait, loading next problem ...");
	
	var aDriver=APIActivity.getAdaptiveDriver ();
	aDriver.getNextAdaptiveProblem (aStartNextProblem);
}

/**
*
*/
function startCycle ()
{
	olidebug ("startCycle ()");
	
	var aDriver=APIActivity.getAdaptiveDriver ();
		        
	aDriver.registerUser (registerSuccess,registerFail);	

	/*
	var pObject=findProblemObject ("q4_describe_samp_pop");
	
	if (pObject!=null)
	{
		generateProblemFromNode (pObject);	
	}
	*/
}

/**
*
*/
function registerSuccess ()
{
	olidebug ("registerSuccess ()");
	
	var aDriver=APIActivity.getAdaptiveDriver ();	
	aDriver.getFirstAdaptiveProblem (aStartFirstProblem);		
}

/**
*
*/
function registerFail ()
{
	olidebug ("registerFail ()");	
}

/**
{
  "current": {
    "skills": [
      "identifybiassample"
    ],
    "pretest": false,
    "problem_name": "identifybiassample_1",
    "posttest": false,
    "tutor_url": "http://52.50.241.19/courses/course-v1:Stanford+PS1+2017/courseware/pd_sampling_training/identifybiassample_1"
  },
  "done_with_current": true,
  "okay": true,
  "done_with_course": true,
  "next": null
}
*/
function checkProblemSetComplete (aData)
{
	olidebug ("checkProblemSetComplete ()");
	
	if (aData ['done_with_course'])
	{
		if (aData ['done_with_course']==true)
		{
			// Clear the content first 
			$('#problemcontent').html('');
			showFeedback ("Congratulations you are done with these problems.");
			return (true);
		}
	}
	
	return (false);
}

/**
{
  "current": null,
  "done_with_current": true,
  "okay": true,
  "done_with_course": false,
  "next": {
    "skills": [
      "center"
    ],
    "pretest": true,
    "problem_name": "Pre_assessment_0",
    "posttest": false,
    "tutor_url": "http://52.50.241.19/courses/course-v1:University+SS001+2017_N/courseware/statistics/Pre_assessment_0"
  }
}
*/
function aStartFirstProblem (aData)
{
	olidebug ("aStartFirstProblem ()");
	
	var aDriver=APIActivity.getAdaptiveDriver ();
	
	console.log (JSON.stringify (aData));
	
	if (checkProblemSetComplete (aData)==true)
	{
		return;
	}
	
	if (aData ['next'])
	{
		next=aData ['next'];
		var problemName=prepProblemName (next ['problem_name']);
		//var problemName='q1_experi_vs_obstudy_critiq_valid';
		//var problemName='q2_survey_design_critiq_validity';
	
		console.log ("We have a first problem: " + problemName);
		
		var pObject=findProblemObject (problemName);
		
		generateProblemFromNode (pObject);
		
		aDriver.setCurrentProblem (problemName);
		
		aDriver.pageLoadComplete ();
		
		showFeedback (" ");
	}
}

/**
*
*/
function aStartNextProblem (aData)
{
	olidebug ("aStartNextProblem ()");
	
	var aDriver=APIActivity.getAdaptiveDriver ();
	
	console.log (JSON.stringify (aData));	
	
	if (checkProblemSetComplete (aData)==true)
	{
		return;
	}	
		
	if (aData ['next'])
	{
		next=aData ['next'];
		var problemName=prepProblemName (next ['problem_name']);
	
		console.log ("We have a next problem: " + problemName);
		
		var pObject=findProblemObject (problemName);
		
		generateProblemFromNode (pObject);
		
		aDriver.setCurrentProblem (problemName);
		
		aDriver.pageLoadComplete ();
		
		showFeedback (" ");		
	}
}

/**
*
*/
function findProblemObject (aName)
{
	olidebug ("findProblemObject ("+aName+")");
	
	for (var i=0;i<problems.length;i++)
	{
		var root = problems [i].documentElement;
		
		olidebug ("Found root node name: " + root.nodeName);
		
		var rootList=root.childNodes;
		
		for (var j=0;j<rootList.length;j++)
		{
			var topLevelNode=rootList [j];
			 
			if (topLevelNode.nodeName=="multiple_choice")
			{
				var attr=topLevelNode.attributes;	
				var questionID=attr.getNamedItem("id").nodeValue;

				if (questionID==aName)
				{
					return (topLevelNode);
				}
			}
		}	
	}
	
	return (null);
}

/**
*
*/
function build ()
{
	olidebug ("build ()");
	
	olidebug ("Fixed name: " + prepProblemName ("Post_assessment_q2_id_study_design_2"));
		
	useDebugging=true;
	
	showFeedback ("Please wait, retrieving problem ...");
	
	var superClient=APIActivity.getSuperActivityObject ();
	
	APIActivity.assignAdaptiveDriver (new OLIExternalAdaptiveActivity (superClient,
	                                                                  superClient.studentUserGuid,
																	  "QA101",
																	  APIActivity.findResourceByType ("adaption")));

	var problemDefinitions=APIActivity.findResourcesByType ("data");
	
	if (problemDefinitions.length==0)
	{
		showFeedback ("Error, no problem definitions found, please check your xml file.");
		return;
	}
	
	var loadFinished=0;
	
	olidebug ("Loading " + problemDefinitions.length + " problem files ...");
	
	for (var i=0;i<problemDefinitions.length;i++)
	{	
		var problemDefinition=APIActivity.getDownloadableResource (problemDefinitions [i]);
		
		var jqxhr = $.get(problemDefinition, function(data)
		{
			olidebug ("success loading problem set "  + loadFinished);
						
			problems [loadFinished]=data;
			
			loadFinished++;
						
			if (loadFinished>(problemDefinitions.length-1))
			{
				olidebug ("All problems loaded, starting cycle ...");
				
				startCycle ();
			}			
			
		}).done(function() 
		{			
			//olidebug ("done ()");
			
		}).fail(function(refObject, textStatus, errorThrown) 
		{
			olidebug("File retrieve problem: " + textStatus + ", " + errorThrown);
			
		}).always(function() 
		{
			//olidebug ("finished");
		});
	}
}
