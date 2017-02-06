/* 
 * @(#)olisuperactivity.js $Date: 2015/00/14 
 * 
 * Copyright (c) 2015 Carnegie Mellon University.
 */
 
var launchAttributes = {}; 
 
/**
*
*/
function getLaunchAttributes (aloadCustomActivity)
{
	olidebug ("getLaunchAttributes ("+aloadCustomActivity+")");
	
	var win = window.frameElement;			
	var atts=win.attributes;
			
	for (var i = 0; i < atts.length; i++)
	{			
		olidebug ("key: " + atts[i].nodeName + " = " + atts[i].nodeValue);
	}		

    launchAttributes.activityMode = win.getAttribute("data-activitymode");
    launchAttributes.activityContextGuid = win.getAttribute("data-activitycontextguid");
    launchAttributes.activityGuid = win.getAttribute("data-activityguid");
    launchAttributes.userGuid = win.getAttribute("data-userguid");
    launchAttributes.authToken = win.getAttribute("data-authenticationtoken");
    launchAttributes.resourceTypeId = win.getAttribute("data-resourcetypeid");
    launchAttributes.sessionId = win.getAttribute("data-sessionid");
    launchAttributes.superactivityUrl = win.getAttribute("data-superactivityserver");
    launchAttributes.loadCustomActivity = aloadCustomActivity;
	
	return (launchAttributes);
}
 
var superClient = null;	
 
// Application starting point
$(function () 
{
	olidebug ("Superactivity kickoff ...");
	
    superClient = null;	
	
	if (isEmbedded)
	{
		if (isEmbedded==true)
		{
			superClient=new SuperActivityClient(getLaunchAttributes (true));
		}
		else		
		{
			superClient=new SuperActivityClient(getLaunchAttributes (false));
		}
	}
	else
	{
		superClient=new SuperActivityClient(getLaunchAttributes (false));		
	}
	
    superClient.loadClientConfig();
});

/**
*
*/
function SuperActivityClient(launchAttributes, loadingDoneCallback) 
{
    olidebug("SuperActivityClient()");
	
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

    this.isInStudentMode = function () 
	{
        return superClient.activityMode === 'delivery';
    };
	
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
        olidebug("loadClientConfig()");
		
        var vars = {};
		
        superClient.post('loadClientConfig', vars, false, false, function (data) 
		{
            olidebug("Data response: " + data);
            superClient.configData = data;
            superClient.studentUserGuid = $(data).find("authentication").attr('user_guid');
            superClient.logServiceUrl = $(data).find("logging").find("url").text();
            olidebug("loadClientConfig() userguid " + superClient.studentUserGuid);
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
        olidebug("beginSession()");
		
        var vars = {};
		
        superClient.post('beginSession', vars, true, true, function (data) 
		{
            olidebug("Begin Session Data response: " + data);
            superClient.contentFileGuid = $(data).find("metadata").find("resource_info").find("file").attr('guid');
            superClient.resourceId = $(data).find("metadata").find("resource_info").attr('id');
            superClient.studentActivityGuid = $(data).find("metadata").find("activity").attr('guid');
            superClient.webContentFolder = $(data).find("metadata").find("web_content").attr('href');
            superClient.timeZone = $(data).find("metadata").find("section").attr('time_zone');
            superClient.sectionGuid = $(data).find("metadata").find("section").attr('guid');
            superClient.sessionData = data;
            olidebug("beginSession() current_attempt " + superClient.currentAttempt);
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
		
        olidebug("started new attempt " + superClient.currentAttempt);
		
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
        olidebug("processFileRecords ");
		
        $(storageData).find("file_record").each(function (e) 
		{
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
    this.loadContentFile = function (anActivityObject) 
	{
        olidebug("loadContentFile()");
		
		if (anActivityObject==null)
		{
			var vars = {contentFileGuid: superClient.contentFileGuid};
			
			superClient.post('loadContentFile', vars, true, true, function (data) 
			{
				superClient.activityFileData = data;
				
				if (superClient.loadCustomActivity) 
				{
					var file = $(data).find("source").text();
					var actURL = superClient.webContentFolder + file;
					
					olidebug("Activity URL: " + actURL);
					require([actURL], function (sactivity) 
					{
						superClient.customActivity = sactivity;
						superClient.customActivity.init(superClient, data);
					});
				}
				
				if (loadingDoneCallback)
				{
					if (typeof loadingDoneCallback === "function") 
					{
						loadingDoneCallback();
					}
				}	
			});
		}
		else
		{
			superClient.customActivity = anActivityObject;
			superClient.customActivity.init(superClient, data);
		}
    };
	/**
	*
	*/
    this.loadUserSyllabus = function (callback) 
	{		
        olidebug("loadUserSyllabus()");
        var vars = {sectionGuid: superClient.sectionGuid};
        superClient.post('loadUserSyllabus', vars, true, false, callback);
    };
	/**
	*
	*/
    this.post = function (command, vars, includeUser, includeActivity, success, failure) 
	{
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

        if (failure) {
            $.post(superClient.serviceUrl, $.param(vars)).done(success).fail(failure);
        } else {
            $.post(superClient.serviceUrl, $.param(vars)).done(success);
        }
    };
	/**
	*
	*/
    this.loadFile = function (filePath, fileType, callback) 
	{
        var fileURL = superClient.webContentFolder + filePath;
		
        olidebug("loadjscssFile " + fileType + " " + fileURL);
		
        if (!(typeof fileType === 'undefined') && fileType === "js") 
		{
            if (typeof callback === 'undefined') 
			{
                throw 'Error loading javascript file - callback function required';
            }
			
            require([fileURL], callback);
        }
		else if (!(typeof fileType === 'undefined') && fileType === "css") {
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: fileURL
            }).appendTo("head");
        } else {
            if (typeof callback === 'undefined') {
                throw 'Error loading file - callback function required';
            }
            $.get(fileURL, callback);
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
	/**
	*
	*/
    this.isCurrentAttemptSubmitted = function () 
	{
        if (superClient.attemptList.hasOwnProperty('a' + superClient.currentAttempt)) 
		{
            var submitted = superClient.attemptList['a' + superClient.currentAttempt].dateSubmitted;
            if (typeof (submitted) !== "undefined" && submitted !== null) 
			{
                return true;
            }
        }
        return false;
    };
    /**
     * StartAttempt starts a new attempt at the activity.  
     * Should be called when the user begins the attempt.
     */
    this.startAttempt = function (callback) {
        olidebug("startAttempt()");
        var vars = {};
        superClient.post('startAttempt', vars, true, true, callback);
    };
	/**
	*
	*/	
    this.scoreAttempt = function (scoreID, scoreValue, callback) {
        olidebug("scoreAttempt()");
        superClient.checkScoreValue(scoreValue);
        var vars = {scoreId: scoreID, scoreValue: scoreValue};
        superClient.post('scoreAttempt', vars, true, false, callback);
    };
	/**
	*
	*/	
    this.scoreAttemptInstructor = function (scoreID, scoreValue, attemptNumber, callback) {
        olidebug("scoreAttemptInstructor()");
        superClient.checkAttempt(attemptNumber);
        superClient.checkScoreValue(scoreValue);
        var vars = {scoreId: scoreID, scoreValue: scoreValue, attemptNumber: attemptNumber};
        superClient.post('scoreAttempt', vars, true, true, callback);
    };
	/**
	*
	*/	
    this.endAttempt = function (callback) {
        olidebug("endAttempt()");
        var vars = {};
        superClient.post('endAttempt', vars, true, true, callback);
    };
	/**
	*
	*/	
    this.loadFileRecord = function (theFileName, theAttemptNumber, callback) {
        olidebug("loadFileRecord() attempt " + theAttemptNumber + " vs " + superClient.currentAttempt);
        superClient.checkAttempt(theAttemptNumber);
        if (theAttemptNumber === 0) {
            theAttemptNumber = 1;
        }
        var vars = {fileName: theFileName, attemptNumber: theAttemptNumber};
        superClient.post('loadFileRecord', vars, true, true, callback);
    };
	/**
	*
	*/	
    this.writeFileRecord = function (theFileName, theMimeType, theAttemptNumber, theFile, callback) {
        olidebug("writeFileRecord()");
        superClient.checkAttempt(theAttemptNumber);
        if (theAttemptNumber === 0) {
            theAttemptNumber = 1;
        }
        var fileData = encodeURIComponent(theFile);
        var vars = {fileName: theFileName, attemptNumber: theAttemptNumber, mimeType: theMimeType, byteEncoding: 'urlencoded', fileRecordData: fileData};
        superClient.post('writeFileRecord', vars, true, true, callback);
    };
	/**
	*
	*/	
    this.deleteFileRecord = function (theFileName, theAttemptNumber, callback) {
        olidebug("deleteFileRecord()");
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
        olidebug("checkScoreValue() : " + scoreValue);
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

function Question(sId, sPrompt) {
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

olidebug ("Superactivity parsed");

