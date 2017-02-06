/**
*
*/

var XBlockPointer=null;
var XBlockRuntime=null;
var XBlockElement=null;

/**
* This function/class constitutes the main insulation layer that forms the glue code
* between the existing OLI superactivity Javascript and the EdX backend. When it this
* function gets started from the original superactivity (it was modified to do this)
* it will overwrite the post and get calls so that we get called instead of the OLI
* server. 
*/
function superActivityReady ()
{
	console.log ("superActivityReady (xblock)");
	
	var superClient = document.getElementById("olixblock").contentWindow.superClient;
	
	/**
	* Interception of the superactivity get call
	*/
	superClient.get=function (aURL,aCallback) 
	{
		console.log ("get (replaced!)");
		console.log ("get url: " + aURL);
		
		if (XBlockRuntime==null)
		{
			console.log ("Error no XBlockRuntime defined");
			return;
		}
		
	}
	
	/**
	* Interception of the superactivity post call
	*/
	superClient.post=function (command, vars, includeUser, includeActivity, success, failure) 
	{
		console.log ("post (replaced!)");
		
		console.log ("vars: " + JSON.stringify(vars));
		
		if (XBlockRuntime==null)
		{
			console.log ("Error no XBlockRuntime defined");
			return;
		}		
		
		console.log ("command: " + command);
		console.log ("vars: " + JSON.stringify (vars));
		console.log ("includeUser: " + includeUser);
		console.log ("includeActivity: " + includeActivity);
		
		//>---------------------------------------------------------------------
		
		if (command=="loadClientConfig")
		{
			$.ajax({type: "POST",
					url: XBlockRuntime.handlerUrl(XBlockPointer.element, command),
					data: JSON.stringify(
					{
						'commandName': command,
						'resourceTypeID': superClient.resourceTypeId,
						'activityMode': superClient.activityMode,
						'authenticationToken': superClient.authToken
					}),
					contentType: "application/json; charset=utf-8",
					dataType: "json"}).done(function(jqXHR) 
					{
						console.log ("Success: " + jqXHR);
						console.log ("Just the XML:" + jqXHR.data);
						
						if (success)
						{
							success ($.parseXML (jqXHR.data));
						}						
					}).fail(function(jqXHR, textStatus) 
					{
						console.log ("Failure: " + textStatus);
						
						if (failure)
						{
							failure (textStatus);
						}
					});
		}
		
		//>---------------------------------------------------------------------
		
		if (command=="beginSession")
		{		
			$.ajax({type: "POST",
					url: XBlockRuntime.handlerUrl(XBlockPointer.element, command),
					data: JSON.stringify(
					{
						'commandName': command,
						'resourceTypeID': superClient.resourceTypeId,
						'activityMode': superClient.activityMode,
						'authenticationToken': superClient.authToken
					}),
					contentType: "application/json; charset=utf-8",
					dataType: "json"}).done(function(jqXHR) 
					{
						console.log ("Success: " + jqXHR);
						console.log ("Just the XML:" + jqXHR.data);
						
						if (success)
						{
							success ($.parseXML (jqXHR.data));
						}						
					}).fail(function(jqXHR, textStatus) 
					{
						console.log ("Failure: " + textStatus);
						
						if (failure)
						{
							failure (textStatus);
						}
					});
		}
		
		//>---------------------------------------------------------------------
		
		if (command=="loadContentFile")
		{		
			$.ajax({type: "POST",
					url: XBlockRuntime.handlerUrl(XBlockPointer.element, command),
					data: JSON.stringify(
					{
						'commandName': command,
						'resourceTypeID': superClient.resourceTypeId,
						'activityMode': superClient.activityMode,
						'authenticationToken': superClient.authToken
					}),
					contentType: "application/json; charset=utf-8",
					dataType: "json"}).done(function(jqXHR) 
					{
						console.log ("Success: " + jqXHR);
						console.log ("Just the XML:" + jqXHR.data);
						
						if (success)
						{
							success ($.parseXML (jqXHR.data));
						}
					}).fail(function(jqXHR, textStatus) 
					{
						console.log ("Failure: " + textStatus);
						
						if (failure)
						{
							failure (textStatus);
						}
					});
		}		
		
		//>---------------------------------------------------------------------		

    };
}

/**
 * Called by edX to initialize the xblock.
 * @param runtime - provided by EdX
 * @param element - provided by EdX
 */
function OLIXBlock(runtime, element) 
{
	console.log ("OLIXBlock");
		
	XBlockPointer=this;
	XBlockRuntime=runtime;
	XBlockElement=element;
	
    var post = 
	{
		/*
		save_problem_state: function(state) 
		{
			$.ajax({type: "POST",
				url: runtime.handlerUrl(element, 'ctat_save_problem_state'),
				data: JSON.stringify({state:state}),
				contentType: "application/json; charset=utf-8",
				dataType: "json"});
		},
		report_grade: function(correct_step_count, total_step_count) 
		{
			$.ajax({type: "POST",
				url: runtime.handlerUrl(element, 'ctat_grade'),
				data: JSON.stringify({'value': correct_step_count,
						  'max_value': total_step_count}),
				contentType: "application/json; charset=utf-8",
				dataType: "json"});
		},
		report_skills: function(skills) 
		{
			$.ajax({type: "POST",
				url: runtime.handlerUrl(element, 'ctat_save_skills'),
				data: JSON.stringify({'skills': skills}),
				contentType: "application/json; charset=utf-8",
				dataType: "json"});
		},
		*/
		log_event: function(aMessage) 
		{
			msg = JSON.stringify(
			{
				'event_type': 'oli_log',
				'action': 'OLIlogevent',
				'message': aMessage});
				$.ajax({type: "POST",
					url: runtime.handlerUrl(element, 'oli_log'),
					data: msg,
					contentType: "application/json; charset=utf-8",
					dataType: "json"});
		}		
    };
	
    $('.ctatxblock').on("load", function() 
	{

    });
}
