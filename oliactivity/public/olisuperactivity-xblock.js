/* 
 * @(#)olisuperactivity.js $Date: 2015/00/14 
 * 
 * Copyright (c) 2015 Carnegie Mellon University.
 *
 * The most elaborate part of this class and its resulting object is the startup
 * sequence, which progressively gets more detailed information through service
 * calls. To make things easier to decode and to work towards a clearer future
 * version we document the execution cycle of an embedded activity:
 *
 * 1) $(function ())
 *
 * LoadClientConfig is the first method called when a SuperActivity initializes, 
 * and provides basic configuration information about the activity.  Should always 
 * be called when activity starts. It describes to the client the global context 
 * and it's parameters. In essence it provides enough information to further
 * bootstrap the activity
 *
 *
 * 2) superClient.loadClientConfig();
 * 
 *	Example response:
 *
 *	<?xml version="1.0" encoding="UTF-8"?>
 *	<super_activity_client server_time_zone="America/New_York">
 *	<resource_type id="x-oli-embed-activity" name="Embed activity" />
 *	<base href="https://dev-02.oli.cmu.edu/superactivity/embed/" />
 *	<authentication user_guid="vvelsen" />
 *	<logging session_id="f4e615150a2d9bec006903a052631684" source_id="Embed">
 *		<url>https://dev-02.oli.cmu.edu/jcourse/dashboard/log/server</url>
 *	</logging>
 *	</super_activity_client>
 *
 * BeginSession is also called when the SuperActivity initializes, and provides 
 * information about the activity, user, file storage, and attempts at the activity.  
 * Should always be called when activity starts.
 *
 * 3) superClient.beginSession ();
 *
 * Example response:
 *	 
 *	<?xml version="1.0" encoding="UTF-8"?>
 *	<super_activity_session>
 *		<metadata status="during">
 *			<user anonymous="false" country="US" date_created="1437053667000" email="vvelsen@cs.cmu.edu" first_name="Martin" guid="vvelsen" institution="Carnegie Mellon University" last_name="van Velsen" />
 *			<authorizations grade_responses="true" instruct_material="true" view_material="true" view_responses="true" />
 *			<section admit_code="QA101" auto_validate="true" date_created="1477407995000" duration="Oct 2016 - Oct 2026" end_date="1792900800000" guest_section="false" guid="fc60f4e40a2d9bec17f7f6e6bcaea730" institution="CMU OLI" registration_closed="false" start_date="1477368000000" time_zone="America/New_York" title="QA Internal OLI Testing Course">
 *				<instructors>
 *					<user anonymous="false" country="US" date_created="1437053667000" email="vvelsen@cs.cmu.edu" first_name="Martin" guid="vvelsen" institution="Carnegie Mellon University" last_name="van Velsen" />
 *				</instructors>
 *			</section>
 *			<registration date_created="1477407995000" guid="fc60f4f40a2d9bec554c93ffd3a37668" role="instructor" section_guid="fc60f4e40a2d9bec17f7f6e6bcaea730" status="valid" user_guid="vvelsen" />
 *			<activity guid="d68e11560a2d9bec2796a69db6244535" high_stakes="false" just_in_time="false" section_guid="fc60f4e40a2d9bec17f7f6e6bcaea730">
 *				<item_info guid="d68e0eb80a2d9bec0ca250acd7a5ccf6" id="i_test02b_embeddedapi_class_038" organization_guid="d68e0e080a2d9bec60d1636e7e8c2ecd" purpose="learnbydoing" scoring_mode="default">
 *					<resource_info guid="d68e07a70a2d9bec788ae1aadaab84df" id="test02b_embeddedapi_class" title="Test 02b, Embedded Activities - (API Test)" type="x-oli-embed-activity">
 *						<file guid="d68e07a60a2d9bec5b9976f45af29208" href="t02-embedded-activity/x-oli-embed-activity/test02b_embeddedapi_class.xml" mime_type="text/xml" />
 *						<resource_files />
 *					</resource_info>
 *				</item_info>
 *			</activity>
 *			<web_content href="https://dev-02.oli.cmu.edu/repository/webcontent/d68df32b0a2d9bec238172d2382a367a/" />
 *		</metadata>
 *		<storage>
 *			<file_directory />
 *		</storage>
 *		<grading>
 *			<attempt_history activity_guid="d68e11560a2d9bec2796a69db6244535" current_attempt="1" date_started="1485872467550" first_accessed="1485872467460" last_accessed="1485872467550" last_modified="1485872467550" max_attempts="-1" overall_attempt="1" user_guid="vvelsen">
 *				<problem date_created="1485363344000" max_attempts="-1" resource_guid="d68e07a70a2d9bec788ae1aadaab84df" resource_type_id="x-oli-embed-activity">
 *					<grading_attributes />
 *					<launch_attributes>
 *						<attribute attribute_id="height" value="700" />
 *						<attribute attribute_id="width" value="670" />
 *					</launch_attributes>
 *				</problem>
 *				<activity_attempt date_accessed="1485872467550" date_modified="1485872467550" date_started="1485872467550" number="1" />
 *			</attempt_history>
 *		</grading>
 *	</super_activity_session> 
 * 
 *	LoadContentFile loads the main content file for the activity.  Is 
 *	usually called when the activity starts.
 *
 * 4) superClient.loadContentFile ();
 * 
 * Example response:
 * 
 * <?xml version="1.0" encoding="UTF-8"?>
 *	<embed_activity id="test02b_embeddedapi_class" width="670" height="700">
 *	    <title>Test 02b, Embedded Activities - (API Test)</title>
 *	    <source>webcontent/api/oli.js</source>
 *	    <assets>
 *	        <asset name="questions">webcontent/api/parts.xml</asset>		
 *	        <asset name="style">webcontent/api/qa.css</asset>
 *	        <asset name="style">webcontent/api/jquery.json-view.css</asset>	
 *			<asset name="javascript">webcontent/api/apitest.js</asset>
 *			<asset name="javascript">webcontent/api/jquery.json-view.js</asset>
 *			<asset name="layout">webcontent/api/apitest.html</asset>		
 *	    </assets>
 *	</embed_activity>
 *
 */
 
/**
* A temporary debug function so that at least all the former solidebug calls go through
* the same function. Once we move this code to the Simon js OLI client code we will change
* this to call olidebug or simondebug.
*/
function solidebug (aMessage)
{
	console.log (aMessage);
}

var superClient = null;

/**
* Application starting point
*/
$(function () 
{
    var win = window.frameElement;
    var launchAttributes = {};
	
    launchAttributes.activityMode = win.getAttribute("data-activitymode");
    launchAttributes.activityContextGuid = win.getAttribute("data-activitycontextguid");
    launchAttributes.activityGuid = win.getAttribute("data-activityguid");
    launchAttributes.userGuid = win.getAttribute("data-userguid");
    launchAttributes.authToken = win.getAttribute("data-authenticationtoken");
    launchAttributes.resourceTypeId = win.getAttribute("data-resourcetypeid");
    launchAttributes.sessionId = win.getAttribute("data-sessionid");
    launchAttributes.superactivityUrl = win.getAttribute("data-superactivityserver");
    launchAttributes.loadCustomActivity = true;
	
    superClient = new SuperActivityClient(launchAttributes);
	
	if (window.parent)
	{
		if (window.parent.superActivityReady)
		{
			window.parent.superActivityReady ();
		}
	}	
	
    superClient.loadClientConfig();
});

/**
*
*/
function SuperActivityClient(launchAttributes, loadingDoneCallback) 
{
    solidebug("SuperActivityClient()");
	
    this.activityMode = launchAttributes.activityMode;
    this.activityContextGuid = launchAttributes.activityContextGuid;
    this.activityGuid = launchAttributes.activityGuid;
    this.authToken = launchAttributes.authToken;
    this.resourceTypeId = launchAttributes.resourceTypeId;
    this.resourceId = "none";
    this.sessionId = launchAttributes.sessionId;
    this.userGuid = launchAttributes.userGuid;
    this.instructorGuid = "none";
    this.superactivityUrl = launchAttributes.superactivityUrl;
    this.serviceUrl = '/jcourse/superactivity/server';
    this.logServiceUrl = "none";
    this.contentFileGuid = "none";
    this.webContentFolder = "none";
    this.currentAttempt = "none";
    this.maxAttempts = -1;
    this.timeZone = "none";
    this.sectionGuid = "none";
    this.attemptList = {};
    this.fileRecordList = {};

    this.configData = "none";
    this.sessionData = "none";
    this.contentFileData = "none";
    this.activityFileData;

    this.studentUserGuid = "none";
    this.studentActivityGuid = launchAttributes.userGuid;

    this.customActivity;
    this.loadCustomActivity = launchAttributes.loadCustomActivity;

    var superClient = this;
	
	/**
	*
	*/
    this.isInStudentMode = function () 
	{
        return superClient.activityMode === 'delivery';
    };
	
	/**
	*
	*/	
    this.isInInstructorMode = function () 
	{
        return superClient.activityMode === 'review';
    };

    /**
     * LoadClientConfig is the first method called when a SuperActivity initializes, 
     * and provides basic configuration information about the activity.  Should always 
     * be called when activity starts.
     */
    this.loadClientConfig = function () 
	{
        solidebug("loadClientConfig()");
		
        var vars = {};
		
        superClient.post('loadClientConfig', vars, false, false, function (data) 
		{
            solidebug("Data response: " + data);
			
            superClient.configData = data;
            superClient.studentUserGuid = $(data).find("authentication").attr('user_guid');
            superClient.logServiceUrl = $(data).find("logging").find("url").text();
			
            solidebug("loadClientConfig() userguid " + superClient.studentUserGuid);
			
            superClient.beginSession();
        });
    };
	
    /**
     * BeginSession is also called when the SuperActivity initializes, and provides 
     * information about the activity, user, file storage, and attempts at the activity.  
     * Should always be called when activity starts.
     */
    this.beginSession = function ()
	{
        solidebug("beginSession()");
		
        var vars = {};
		
        superClient.post('beginSession', vars, true, true, function (data) 
		{
            solidebug("Begin Session Data response: " + data);
			
            superClient.contentFileGuid = $(data).find("metadata").find("resource_info").find("file").attr('guid');
            superClient.resourceId = $(data).find("metadata").find("resource_info").attr('id');
            superClient.studentActivityGuid = $(data).find("metadata").find("activity").attr('guid');
            superClient.webContentFolder = $(data).find("metadata").find("web_content").attr('href');
            superClient.timeZone = $(data).find("metadata").find("section").attr('time_zone');
            superClient.sectionGuid = $(data).find("metadata").find("section").attr('guid');
            superClient.sessionData = data;
            solidebug("beginSession() current_attempt " + superClient.currentAttempt);
            superClient.processStartData(data);
            superClient.processFileRecords($(data).find("storage"));
            // No attempt found, start one.
            if (!(superClient.attemptList.hasOwnProperty('a' + superClient.currentAttempt))) {
                superClient.startAttempt(superClient.processStartData);
            }
            
            superClient.loadContentFile();
        });
    };
	
	/**
	*
	*/
    this.processStartData = function (startData) 
	{
		solidebug("processStartData()");
		
        var at = $(startData).find("attempt_history").attr('current_attempt');
		
        if (typeof (at) !== "undefined" && at !== null) 
		{
            superClient.currentAttempt = at;
        }
		
        var max_ttempts = $(startData).find("attempt_history").attr('max_attempts');
		
        if (typeof (max_ttempts) !== "undefined" && max_ttempts !== null) 
		{
            superClient.maxAttempts = Number(max_ttempts);
        }
		
        solidebug("started new attempt " + superClient.currentAttempt);
		
        $(startData).find("attempt_history").find('activity_attempt').each(function (e) 
		{
            var activityAttempt = {};
            activityAttempt.dateAccessed = $(this).attr('date_accessed');
            activityAttempt.dateStarted = $(this).attr('date_started');
            activityAttempt.dateModified = $(this).attr('date_modified');
            activityAttempt.dateCompleted = $(this).attr('date_completed');
            activityAttempt.dateScored = $(this).attr('date_scored');
            activityAttempt.dateSubmitted = $(this).attr('date_submitted');
            activityAttempt.number = $(this).attr('number');
            superClient.attemptList['a' + activityAttempt.number] = activityAttempt;
        });
    };
	
	/**
	*
	*/
    this.processFileRecords = function (storageData) 
	{
        solidebug("processFileRecords ()");
		
        $(storageData).find("file_record").each(function (e) {
            var fileRecord = {};
            fileRecord.fileName = $(this).attr('file_name');
            fileRecord.attempt = $(this).find('record_context').attr('attempt');
            superClient.fileRecordList[fileRecord.fileName + fileRecord.attempt] = fileRecord;
        });
    };
	
    /**
     * LoadContentFile loads the main content file for the activity.  Is 
     * usually called when the activity starts.
     */
    this.loadContentFile = function () 
	{
        solidebug("loadContentFile()");
		
        var vars = {contentFileGuid: superClient.contentFileGuid};
		
        superClient.post('loadContentFile', vars, true, true, function (data) 
		{
            superClient.activityFileData = data;
			
            if (superClient.loadCustomActivity) 
			{
                var file = $(data).find("source").text();
                var actURL = superClient.webContentFolder + file;
				
                solidebug("Activity URL: " + actURL);
                require([actURL], function (sactivity) 
				{
                    superClient.customActivity = sactivity;
                    superClient.customActivity.init(superClient, data);
                });
            }
			
            if (typeof loadingDoneCallback === "function") 
			{
                loadingDoneCallback();
            }
        });
    };
	
	/**
	*
	*/	
    this.loadUserSyllabus = function (callback) 
	{
        solidebug("loadUserSyllabus()");
		
        var vars = {sectionGuid: superClient.sectionGuid};
		
        superClient.post('loadUserSyllabus', vars, true, false, callback);
    };
	
	/**
	*
	*/
	this.get = function (aURL,aCallback)
	{
		$.get(aURL, aCallback);
	}
	
	/**
	*
	*/	
    this.post = function (command, vars, includeUser, includeActivity, success, failure) 
	{
		// Augment provided variables with ones we need for OLI to be able to
		// process the request.
        vars.commandName = command;
        vars.resourceTypeID = superClient.resourceTypeId;
        vars.activityMode = superClient.activityMode;
        vars.authenticationToken = superClient.authToken;
		
        if (includeUser) 
		{
            if (superClient.isInStudentMode()) 
			{
                vars.userGuid = superClient.studentUserGuid;
            }
			else 
			{
                /**note that this is the userGuid of the student**/
                vars.userGuid = superClient.userGuid;
            }
        }

        /** activityContextGuid always required in delivery mode **/
        if (superClient.isInStudentMode()) {
            vars.activityContextGuid = superClient.activityContextGuid;
        }

        if (includeActivity) {
            if (superClient.isInStudentMode()) {
                vars.activityGuid = superClient.studentActivityGuid;
            } else if (superClient.isInInstructorMode()) {
                vars.activityGuid = superClient.activityGuid;
            }
        }

        if (failure) 
		{
            $.post(superClient.serviceUrl, $.param(vars)).done(success).fail(failure);
        } 
		else 
		{
            $.post(superClient.serviceUrl, $.param(vars)).done(success);
        }
    };
	
	/**
	*
	*/	
    this.loadFile = function (filePath, fileType, callback) 
	{
		console.log ("loadFile ("+filePath+","+fileType+")")
		
        var fileURL = superClient.webContentFolder + filePath;
        solidebug("loadjscssFile " + fileType + " " + fileURL);
        if (!(typeof fileType === 'undefined') && fileType === "js") {
            if (typeof callback === 'undefined') {
                throw 'Error loading javascript file - callback function required';
            }
            require([fileURL], callback);
        } else if (!(typeof fileType === 'undefined') && fileType === "css") {
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: fileURL
            }).appendTo("head");
        } else {
            if (typeof callback === 'undefined') {
                throw 'Error loading file - callback function required';
            }
			
            superClient.get(fileURL, callback);
        }
    };
	
	/**
	*
	*/	
    this.isCurrentAttemptCompleted = function () 
	{
        if (superClient.attemptList.hasOwnProperty('a' + superClient.currentAttempt)) 
		{
            var completed = superClient.attemptList['a' + superClient.currentAttempt].dateCompleted;
            if (typeof (completed) !== "undefined" && completed !== null) {
                //currentAttempt = 'none';
                return true;
            }
        }
		
        return false;
    };
    this.isCurrentAttemptSubmitted = function () {
        if (superClient.attemptList.hasOwnProperty('a' + superClient.currentAttempt)) {
            var submitted = superClient.attemptList['a' + superClient.currentAttempt].dateSubmitted;
            if (typeof (submitted) !== "undefined" && submitted !== null) {
                return true;
            }
        }
        return false;
    };
    /**
     * StartAttempt starts a new attempt at the activity.  
     * Should be called when the user begins the attempt.
     */
    this.startAttempt = function (callback) 
	{
        solidebug("startAttempt()");
		
        var vars = {};
		
        superClient.post('startAttempt', vars, true, true, callback);
    };
	/**
	*
	*/		
    this.scoreAttempt = function (scoreID, scoreValue, callback) 
	{
        solidebug("scoreAttempt()");
		
        superClient.checkScoreValue(scoreValue);
		
        var vars = {scoreId: scoreID, scoreValue: scoreValue};
		
        superClient.post('scoreAttempt', vars, true, false, callback);
    };
	/**
	*
	*/		
    this.scoreAttemptInstructor = function (scoreID, scoreValue, attemptNumber, callback) 
	{
        solidebug("scoreAttemptInstructor()");
		
        superClient.checkAttempt(attemptNumber);
        superClient.checkScoreValue(scoreValue);
        var vars = {scoreId: scoreID, scoreValue: scoreValue, attemptNumber: attemptNumber};
        superClient.post('scoreAttempt', vars, true, true, callback);
    };
	/**
	*
	*/		
    this.endAttempt = function (callback) {
        solidebug("endAttempt()");
        var vars = {};
        superClient.post('endAttempt', vars, true, true, callback);
    };
	/**
	* Should not be used! the fail callback isn't provided and therefore not used
	* by the post command. Instead use getValue in oli-api.js: APIActivity.getValue ()
	*/	
    this.loadFileRecord = function (theFileName, theAttemptNumber, callback) 
	{
        solidebug("loadFileRecord() attempt " + theAttemptNumber + " vs " + superClient.currentAttempt);
		
        superClient.checkAttempt(theAttemptNumber);
		
        if (theAttemptNumber === 0) 
		{
            theAttemptNumber = 1;
        }
		
        var vars = {fileName: theFileName, attemptNumber: theAttemptNumber};

        superClient.post('loadFileRecord', vars, true, true, callback);
    };
	/**
	*
	*/		
    this.writeFileRecord = function (theFileName, theMimeType, theAttemptNumber, theFile, callback) {
        solidebug("writeFileRecord()");
        superClient.checkAttempt(theAttemptNumber);
        if (theAttemptNumber === 0) {
            theAttemptNumber = 1;
        }
        var fileData = encodeURIComponent(theFile);
        var vars = {fileName: theFileName, attemptNumber: theAttemptNumber, mimeType: theMimeType, byteEncoding: 'urlencoded', fileRecordData: fileData};
        superClient.post('writeFileRecord', vars, true, true, callback);
    };
	/**
	* Should not be used! the fail callback isn't provided and therefore not used
	* by the post command. Instead use deleteValue in oli-api.js: APIActivity.deleteValue ()
	*/	
    this.deleteFileRecord = function (theFileName, theAttemptNumber, callback) {
        solidebug("deleteFileRecord()");
        superClient.checkAttempt(theAttemptNumber);
        if (theAttemptNumber === 0) {
            theAttemptNumber = 1;
        }
        var vars = {fileName: theFileName, attemptNumber: theAttemptNumber};
        superClient.post('deleteFileRecord', vars, true, true, callback);
    };
	/**
	*
	*/		
    this.checkAttempt = function (theAttemptNumber) {
        if (theAttemptNumber < 1) {
            throw "attempt number must be greater than 0.  Was actually: " + theAttemptNumber;
        }
    };
	/**
	*
	*/		
    this.checkScoreValue = function (scoreValue) {
        // Allows fraction strings to be acceptable as valid score values
        solidebug("checkScoreValue() : " + scoreValue);
        if (isNaN(scoreValue) && scoreValue.match(/\d+\/\d+/) !== null) {
            return;
        }
        if ((scoreValue === null) || (scoreValue === "") || isNaN(scoreValue)) {
            throw "score value string is not a number: " + scoreValue;
        }
    };
	/**
	*
	*/	
    this.logAction = function (actionLog, callback) 
	{
        oliLogger.logAction(superClient.logServiceUrl, actionLog, callback);
    };
}

/**
*
*/
function Question(sId, sPrompt) 
{
    var id = sId, prompt = sPrompt, parts = {};
    this.getId = function () {
        return id;
    };
    this.setId = function (sId) {
        id = sId;
    };
    this.getPrompt = function () {
        return prompt;
    };
    this.setPrompt = function (sPrompt) {
        prompt = sPrompt;
    };

    this.getParts = function () {
        return parts;
    };
    this.getPart = function (id) {
        if (parts.hasOwnProperty(id)) {
            return parts[id];
        }
        return null;
    };
    this.addInput = function (sInput) {
        if (!(sInput instanceof Part)) {
            throw "Invalid type - sPart not instanceof Part";
        }
        parts[sInput.getId()] = sInput;
    };
}

/**
*
*/
function Part(sId, sType, sInputComponent) {
    var id = sId, type = sType, inputComponent = sInputComponent;
    var feedbacks = {}, hints = [];
    this.getId = function () {
        return id;
    };
    this.setId = function (sId) {
        id = sId;
    };
    this.getType = function () {
        return type;
    };
    this.setType = function (sType) {
        type = sType;
    };
    this.getInputComponent = function () {
        return inputComponent;
    };
    this.setInputComponent = function (sInputComponent) {
        inputComponent = sInputComponent;
    };
    this.getFeedback = function (id) {
        if (feedbacks.hasOwnProperty(id)) {
            return feedbacks[id];
        }
        return null;
    };
    this.getFeedbackForAnswerId = function (answerId) {
        var others = null;
        for (var key in feedbacks) {
            if (feedbacks.hasOwnProperty(key)) {
                if(feedbacks[key].pattern.toLowerCase() === answerId){
                    return feedbacks[key];
                }else if (feedbacks[key].pattern.toLowerCase() === "*"){
                    others = feedbacks[key];
                }
            }
        }
        return others === null?{id: "_no-feedback", content: "No Feedback"}:others;
    };
    this.getHints = function () {
        return hints;
    };
    this.getHint = function (id) {
        $.each(hints, function (index, value) {
            if (value.id === id) {
                return value;
            }
        });
        return null;
    };

    this.addFeedback = function (sFeedback) {
        feedbacks[sFeedback.id] = sFeedback;
    };
    this.addHint = function (sHint) {
        hints.push(sHint);
    };
}

/**
*
*/
function PartData(sId, sInput) {
    var id = sId, input = sInput, output = null, correct = false, score = 0, feedback = null, hint = null;

    this.getId = function () {
        return id;
    };
    this.setId = function (sId) {
        id = sId;
    };
    this.getInput = function () {
        return input;
    };
    this.setInput = function (sInput) {
        input = sInput;
    };
    this.getOutput = function () {
        return output;
    };
    this.setOutput = function (sOutput) {
        output = sOutput;
    };
    this.getCorrect = function () {
        return correct;
    };
    this.setCorrect = function (sCorrect) {
        correct = sCorrect;
    };
    this.getScore = function () {
        return score;
    };
    this.setScore = function (sScore) {
        score = Number(sScore);
    };
    this.getFeedback = function () {
        return feedback;
    };
    this.setFeedback = function (sFeedback) {
        feedback = sFeedback;
    };
    this.getHint = function () {
        return hint;
    };
    this.setHint = function (sHint) {
        hint = sHint;
    };
    this.toXML = function () {
        var xml = $($.parseXML('<part/>'));
        $('part', xml).attr({id: id, correct: correct, score: score});

        $('part', xml).append($('<input/>', xml).attr({id: input.id}).text(input.value));

        if (output !== null) {
            $('part', xml).append($('<output/>', xml).text(output));
        }
        if (feedback !== null) {
            $('part', xml).append($('<feedback/>', xml).attr({id: feedback.id}).text(feedback.content));
        }
        if (hint !== null) {
            $('part', xml).append($('<hint/>', xml).attr({id: hint.id}).text(hint.content));
        }
        return $('part', xml);
    };
}

/**
*
*/
function QuestionData(sId) {
    var id = sId, score = 0, partsData = {};

    this.getId = function () {
        return id;
    };
    this.setId = function (sId) {
        id = sId;
    };
    this.getScore = function () {
        return score;
    };
    this.setScore = function (sScore) {
        score = Number(sScore);
    };
    this.getPartsData = function () {
        return partsData;
    };
    this.getPartData = function (id) {
        if (partsData.hasOwnProperty(id)) {
            return partsData[id];
        }
        return null;
    };
    this.addPartData = function (sPartData) {
        if (!(sPartData instanceof PartData)) {
            throw "Invalid type - sPart not instanceof Part";
        }
        partsData[sPartData.getId()] = sPartData;
    };
    this.evaluateQuestion = function () {
        for (var key in partsData) {
            if (partsData.hasOwnProperty(key)) {
                score += partsData[key].getScore();
            }
        }
    };
    this.toXML = function () {
        var xml = $($.parseXML('<question/>'));
        $('question', xml).attr({id: id, score: score});

        for (var key in partsData) {
            if (partsData.hasOwnProperty(key)) {
                $('question', xml).append(partsData[key].toXML());
            }
        }
        return $('question', xml);
    };
}

/**
*
*/
function SaveData() {
    var questionsData = {};
    var attemptScore = 0;
    this.getQuestionsData = function () {
        return questionsData;
    };
    this.getQuestionData = function (id) {
        if (questionsData.hasOwnProperty(id)) {
            return questionsData[id];
        }
        return null;
    };
    //Added as students answer each question
    this.addQuestionData = function (sQuestionData) {
        if (!(sQuestionData instanceof QuestionData)) {
            throw "Invalid type - sQuestionData not instanceof QuestionData";
        }
        questionsData[sQuestionData.getId()] = sQuestionData;
    };
    this.evaluateQuestions = function () {
        for (var key in questionsData) {
            if (questionsData.hasOwnProperty(key)) {
                questionsData[key].evaluateQuestion();
                attemptScore += questionsData[key].getScore();
            }
        }
    };
    this.numberOfQuestionsAnswered = function () {
        var cnt = 0;
        for (var key in questionsData) {
            if (questionsData.hasOwnProperty(key)) {
                cnt++;
            }
        }
        return cnt;
    };
    this.getAttemptScore = function () {
        this.evaluateQuestions();
        return attemptScore;
    };
    this.toXML = function () {
        var xml = $($.parseXML('<?xml version="1.0" encoding="UTF-8"?><save_data/>'));
        $('save_data', xml).attr({attempt_score: attemptScore});
        for (var key in questionsData) {
            if (questionsData.hasOwnProperty(key)) {
                $('save_data', xml).append(questionsData[key].toXML());
            }
        }
        return $('save_data', xml);
    };
}
