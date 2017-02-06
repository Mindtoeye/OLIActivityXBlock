/**
* Main interface file to glue an Adobe Captivate activity into an OLI embedded activity
*
* https://helpx.adobe.com/captivate/using/common-js-interface.html
*/

//var activityPath='webcontent/captivate';

var iframe = null;
var captivateDoc = null;
var captivateCheckTimer =-1;
var captivateLoggingConfigured = false;
var captivateEventEmitter = null;
var monitoring = false;

function monitorCaptivate ()
{
	olidebug ("monitorCaptivate ()");
	
	monitoring=true;
	
	var monitorTarget=$('#project_main');
	
	if ((monitorTarget) && (monitoring==true))
	{
		olidebug ("Starting movieclip monitoring ...");
		
		$('#project_main').bind("DOMSubtreeModified",function()
		{
			olidebug ("Movie clip DOM tree changed");
			
			configureCaptivateLogging ();
			monitoring=false;
		});
	}
}

/**
*
*/
function captivateReady ()
{
	olidebug ("captivateReady ()");

	configureCaptivateLogging ();
}

/**
*
*/
function configureCaptivateEventListeners ()
{
	olidebug ("configureCaptivateEventListeners ()");
	
	/**
	* Notifies that movie has entered a new slide.
	*/
	captivateEventEmitter.addEventListener("CPAPI_SLIDEENTER",function(evt)
	{
		olidebug ("Captivate Event: " + "CPAPI_SLIDEENTER");
		olidebug ("Event content: " + JSON.stringify (evt));
		
		var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_SLIDEENTER",
								   APIActivity.getSuperClient ().timeZone);
								   
		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
		supplement.setSource(APIActivity.getQuestionTitle ());
		supplement.setInfoType("CPAPI_SLIDEENTER");
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);				
	});
	
	/**
	* Notifies that movie is exiting a slide.
	*/
	captivateEventEmitter.addEventListener("CPAPI_SLIDEEXIT",function(evt)
	{
		olidebug ("Captivate Event: " + "CPAPI_SLIDEEXIT");
		olidebug ("Event content: " + JSON.stringify (evt));
		
		var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_SLIDEEXIT",
								   APIActivity.getSuperClient ().timeZone);
								   
		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
		supplement.setSource(APIActivity.getQuestionTitle ());
		supplement.setInfoType("CPAPI_SLIDEEXIT");
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);				
	});

	/**
	* Notifies that user has started seeking the movie using playbar.
	*/
	captivateEventEmitter.addEventListener("CPAPI_STARTPLAYBARSCRUBBING",function(evt)
	{
		olidebug ("Captivate Event: " + "CPAPI_STARTPLAYBARSCRUBBING");
		olidebug ("Event content: " + JSON.stringify (evt));
		
		var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_STARTPLAYBARSCRUBBING",
								   APIActivity.getSuperClient ().timeZone);
								   
		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
		supplement.setSource(APIActivity.getQuestionTitle ());
		supplement.setInfoType("CPAPI_STARTPLAYBARSCRUBBING");
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);				
	});

	/**
	* Notifies that user has stopped seeking the movie using playbar.
	*/
	captivateEventEmitter.addEventListener("CPAPI_ENDPLAYBARSCRUBBING",function(evt)
	{
		olidebug ("Captivate Event: " + "CPAPI_ENDPLAYBARSCRUBBING");
		olidebug ("Event content: " + JSON.stringify (evt));

		var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_ENDPLAYBARSCRUBBING",
								   APIActivity.getSuperClient ().timeZone);
								   
		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
		supplement.setSource(APIActivity.getQuestionTitle ());
		supplement.setInfoType("CPAPI_ENDPLAYBARSCRUBBING");
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);				
	});		
	
	/**
	* Notifies that user has performed an interaction with an interactive item.
	*/
	captivateEventEmitter.addEventListener("CPAPI_INTERACTIVEITEMSUBMIT",function(evt)
	{
		olidebug ("Captivate Event: " + "CPAPI_INTERACTIVEITEMSUBMIT");				
		olidebug ("Event content: " + JSON.stringify (evt));
		
		/*				
		"cpData" : 
		{
			"itemname" : "Button_1",
			"frameNumber" : 46,
			"objecttype" : 177,
			"issuccess" : true,
			"slideNumber" : 1,
			"includedInQuiz" : false
		},
		*/
		
		var action = new ActionLog(CommonLogActionNames.SUBMIT_ATTEMPT, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_INTERACTIVEITEMSUBMIT",
								   APIActivity.getSuperClient ().timeZone);

		// Important: allows dashboard tracking
		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.SUBMIT_ATTEMPT);
		supplement.setSource(evt.cpData.itemname);
		supplement.setInfoType(evt.cpData.objecttype);
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);				
	});			

	/**
	* Notifies that movie has paused.
	*/
	captivateEventEmitter.addEventListener("CPAPI_MOVIEPAUSE",function(evt)
	{
		olidebug ("Captivate Event: " + "CPAPI_MOVIEPAUSE");
		olidebug ("Event content: " + JSON.stringify (evt));

		var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_MOVIEPAUSE",
								   APIActivity.getSuperClient ().timeZone);
								   
		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
		supplement.setSource(APIActivity.getQuestionTitle ());
		supplement.setInfoType("CPAPI_MOVIEPAUSE");
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);				
	});			
	
	/**
	* Notifies that movie has resumed from a paused state.
	*/
	captivateEventEmitter.addEventListener("CPAPI_MOVIERESUME",function(evt)
	{
		olidebug ("Captivate Event: " + "CPAPI_MOVIERESUME");
		olidebug ("Event content: " + JSON.stringify (evt));
		
		var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_MOVIERESUME",
								   APIActivity.getSuperClient ().timeZone);
								   
		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
		supplement.setSource(APIActivity.getQuestionTitle ());
		supplement.setInfoType("CPAPI_MOVIERESUME");
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);				
	});			
	
	/**
	* Notifies that movie has started.
	*/
	captivateEventEmitter.addEventListener("CPAPI_MOVIESTART",function(evt)
	{				
		olidebug ("Captivate Event: " + "CPAPI_MOVIESTART");
		olidebug ("Event content: " + JSON.stringify (evt));

		var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_MOVIESTART",
								   APIActivity.getSuperClient ().timeZone);
								   
		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
		supplement.setSource(APIActivity.getQuestionTitle ());
		supplement.setInfoType("CPAPI_MOVIESTART");
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);				
	});			

	/**
	* Notifies that movie has stopped.
	*/
	captivateEventEmitter.addEventListener("CPAPI_MOVIESTOP",function(evt)
	{
		olidebug ("Captivate Event: " + "CPAPI_MOVIESTOP");
		olidebug ("Event content: " + JSON.stringify (evt));

		var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_MOVIESTOP",
								   APIActivity.getSuperClient ().timeZone);
								   
		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
		supplement.setSource(APIActivity.getQuestionTitle ());
		supplement.setInfoType("CPAPI_MOVIESTOP");
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);				
	});						
	
	/**
	* Notifies that user has skipped a question slide.
	*/
	captivateEventEmitter.addEventListener("CPAPI_QUESTIONSKIP",function(evt)
	{
		olidebug ("Captivate Event: " + "CPAPI_QUESTIONSKIP");
		olidebug ("Event content: " + JSON.stringify (evt));
													
		var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_QUESTIONSKIP",
								   APIActivity.getSuperClient ().timeZone);
								   
		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
		supplement.setSource(APIActivity.getQuestionTitle ());
		supplement.setInfoType("CPAPI_QUESTIONSKIP");
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);
	});
	
	/**
	* Notifies that movie has answered a question slide.
	*/
	captivateEventEmitter.addEventListener("CPAPI_QUESTIONSUBMIT",function(evt)
	{
		olidebug ("Captivate Event: " + "CPAPI_QUESTIONSUBMIT");
		olidebug ("Event content: " + JSON.stringify (evt));
		
		/*
		"cpData" : 
		{
			"questionType" : "choice",
			"objectiveID" : "Quiz_2017117134436",
			"questionScoringType" : 
			{
				"Name" : "GradedQuestion"
			},
			"questionMaxScore" : 10,
			"correctAnswer" : "1",
			"questionMaxAttempts" : 9999,
			"selectedAnswer" : "1",
			"slideNumber" : 32,
			"quizName" : "QuizName",
			"interactionID" : "17513",
			"questionAttempts" : 1,
			"questionNumber" : 13,
			"questionAnswered" : true,
			"questionScore" : 10,
			"reportAnswers" : true,
			"questionAnsweredCorrectly" : true,
			"infiniteAttempts" : true,
			"interactionType" : "choice",
			"weighting" : 10
		},
		*/
		
		var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_QUESTIONSUBMIT",
								   APIActivity.getSuperClient ().timeZone);

		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
		supplement.setSource(evt.cpData.quizName);
		supplement.setInfoType(evt.cpData.questionType);
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);					
	});

	/**
	* Subscribing to this event requires an additional parameter - variableName. Once subscribed, 
	* any change to the value of the supplied variable will be notified.
	*/
	/*
	captivateEventEmitter.addEventListener("CPAPI_VARIABLEVALUECHANGED",function(evt)
	{
		olidebug ("Captivate Event: " + "CPAPI_VARIABLEVALUECHANGED");
		olidebug ("Event content: " + JSON.stringify (evt));				
										
		var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
								   APIActivity.getSuperClient ().sessionId,
								   APIActivity.getSuperClient ().resourceId,
								   APIActivity.getSuperClient ().activityGuid,
								   "CPAPI_VARIABLEVALUECHANGED",
								   APIActivity.getSuperClient ().timeZone);

		var supplement = new SupplementLog();
		supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
		supplement.setSource(evt.cpData.itemname);
		supplement.setInfoType(evt.cpData.objecttype);
		supplement.setInfo (JSON.stringify (evt));
		
		action.addSupplement(supplement);
		
		APIActivity.getSuperClient ().logAction(action);					
	});
	*/	
}

/**
* Capture and translate Captivate events for logging purposes. All events collected are defined
* in the official documentation here:
* 
* https://helpx.adobe.com/captivate/using/common-js-interface.html
*/
function checkCaptivate ()
{
	olidebug ("checkCaptivate ()");
	
	captivateDoc = iframe.contentWindow;
	
	try 
	{
		if (captivateDoc.cp)
		{
			olidebug ("The Captivate main Javascript object has been created, let's assume the page is ready");
						
			clearInterval (captivateCheckTimer);
						
			olidebug ("The Captivate main Javascript object has been created, starting to listen for movieclip start event ...");

			iframe.contentWindow.addEventListener("moduleReadyEvent", function(evt)
			{
				olidebug ("Captivate Event: " + "moduleReadyEvent");
				olidebug ("Event content: " + JSON.stringify (evt));
				
				//configureCaptivateLogging ();
				
                var action = new ActionLog(CommonLogActionNames.START_STEP, 
				                           APIActivity.getSuperClient ().sessionId,
										   APIActivity.getSuperClient ().resourceId,
										   APIActivity.getSuperClient ().activityGuid,
										   "CPAPI_INTERACTIVEITEMSUBMIT",
										   APIActivity.getSuperClient ().timeZone);
                var supplement = new SupplementLog();
                supplement.setAction(CommonLogActionNames.START_STEP_TRACK);
                supplement.setSource("question 1");
                supplement.setInfoType("CPAPI_INTERACTIVEITEMSUBMIT");
                supplement.setInfo (JSON.stringify (evt));
				
                action.addSupplement(supplement);
				
                APIActivity.getSuperClient ().logAction(action);

				var interfaceObj = evt.Data;

				captivateEventEmitter = interfaceObj.getEventEmitter();
				
				configureCaptivateEventListeners ();
			});
		}
		else
		{
			olidebug ("bump");
		}
	}
	catch(err) 
	{
		olidebug ("Captivate not ready yet");
	}		
}

/**
*
*/
function configureCaptivateLogging ()
{
	olidebug ("configureCaptivateLogging ()");
	
	if (captivateLoggingConfigured==true)
	{
		olidebug ("Captivate logging already configured");
		return;
	}
	
	var divID = "";		
	var divClass = "";	
	
	var win = iframe.contentWindow;
	
	captivateDoc = iframe.contentDocument? iframe.contentDocument: iframe.contentWindow.document;

	var buttons = captivateDoc.getElementsByTagName('button');
	
	olidebug ("Found " + buttons.length + " buttons");
	
	for (var i = 0; i < buttons.length; i++) 
	{
		var button = buttons[i];
		
		button.addEventListener("click", function()
		{
			olidebug ("Button ("+button.getAttribute('id')+") clicked");
		});
	}
	
	var divButtons = captivateDoc.getElementsByTagName('div');
	
	olidebug ("Found " + divButtons.length + " div buttons");
	
	for (var j = 0; j < divButtons.length; j++) 
	{		
		var divButton = divButtons[j];
		
		divID = "";
		
		if (divButton.getAttribute('id'))
		{
			divID=divButton.getAttribute('id').toLowerCase();
		}
		
		var divClass = "";
		
		if (divButton.getAttribute('class'))
		{
			divClass=divButton.getAttribute('class').toLowerCase()
		}
		
		olidebug ("Inspecting div button with id: " + divID +" and class: " + divClass);
		
		if ((divID.indexOf ("button")!=-1) || (divClass.indexOf ("button")!=-1)) 
		{
			olidebug ("Found an element with id: " + divID + ", and class: " + divClass + " which is configured as a button, adding event listener ...");
			
			divButton.addEventListener("click", function()
			{
				olidebug ("Div Button ("+button.getAttribute('id')+") clicked");
			});
		}	
	}	
	
	var canvasButtons = captivateDoc.getElementsByTagName('canvas');
	
	olidebug ("Found " + canvasButtons.length + " canvas buttons");
	
	for (var k = 0; k < canvasButtons.length; k++) 
	{		
		var canvasButton = canvasButtons[k];
		
		divID = "";
		
		if (canvasButton.getAttribute('id'))
		{
			divID=canvasButton.getAttribute('id').toLowerCase();
		}
		
		divClass = "";
		
		if (canvasButton.getAttribute('class'))
		{
			divClass=canvasButton.getAttribute('class').toLowerCase()
		}
		
		olidebug ("Inspecting class button with id: " + divID +" and class: " + divClass);		
		
		if ((divID.indexOf ("button")!=-1) || (divClass.indexOf ("button")!=-1)) 
		{
			olidebug ("Found an element with id: " + divID + ", and class: " + divClass + " which is configured as a button, adding event listener ...");
			
			canvasButton.addEventListener("click", function()
			{
				olidebug ("Div Button ("+button.getAttribute('id')+") clicked");
			});
		}	
	}
	
	/*
	$(document).click(function(evt)
	{
		olidebug ("document click");
		
		olidebug ("Target ("+evt.target.tagName+")->("+evt.target.id+"): " + JSON.stringify (evt.target));
	});	
	*/
	
	captivateLoggingConfigured=true;
}

/**
*
*/
function SetIframeSize()
{
    $("#captivateframe").width($(window).width() - 18); // added margin for scrollbars
    $("#captivateframe").height($(window).height() - 35);
}
	
/**
*
*/
function build()
{	
	olidebug ("build () aka Captivate's onBodyLoad ()");
		
	//APIActivity.setActivityBasepath (activityPath);

	iframe = document.createElement ('iframe');
	iframe.src = APIActivity.getDownloadableResource (APIActivity.getActivityBasepath ()+"/"+'index-captivate.html');
	iframe.id = "captivateframe";
	iframe.width = "100%";
	iframe.height = "100%";
	iframe.frameBorder = "0";
	iframe.style = "padding: 0px; margin: 0px;";

	document.body.appendChild(iframe);
	
	var fullScreenIcon=APIActivity.imgCreate (fullscreenEnterIcon,"Go FullScreen","Go FullScreen");
	fullScreenIcon.style = "width: 32px; height: 32px; padding: 0px; margin: 0px; position: absolute; top: 0px; right: 0px;";
	fullScreenIcon.addEventListener('click', function (e) 
	{
		APIActivity.goFullscreen ();
	});
	document.body.appendChild(fullScreenIcon);
	
	//console.log ('iframe.contentWindow =', iframe.contentWindow);
	
	$(document).ready(SetIframeSize);
	$(window).on('resize', SetIframeSize);
	
	captivateCheckTimer=setInterval(checkCaptivate,1000);
}
