/* 
 * @(#)olilogging.java $Date: 2016/00/26 
 * 
 * Copyright (c) 2016 Carnegie Mellon University.
 */

var CommonLogActionNames = 
{
    START_ATTEMPT: 'START_ATTEMPT',
    START_STEP: 'START_STEP',
    START_STEP_TRACK: 'START_STEP_TRACK',
    EVALUATE_QUESTION: 'EVALUATE_QUESTION',
    EVALUATE_RESPONSE: 'EVALUATE_RESPONSE',
    EVALUATE_RESPONSE_TRACK: 'EVALUATE_RESPONSE_TRACK',
    VIEW_HINT: 'VIEW_HINT',
    VIEW_HINT_TRACK: 'VIEW_HINT_TRACK',
    VIEW_REPORT: 'VIEW_REPORT',
    SET_SECTION_OPTIONS: 'SET_SECTION_OPTIONS',
    VIW_PREFACE: 'VIEW_PREFACE',
    VIEW_PAGE: 'VIEW_PAGE',
    SAVE_ATTEMPT: 'SAVE_ATTEMPT',
    SUBMIT_ATTEMPT: 'SUBMIT_ATTEMPT',
    SCORE_QUESTION: 'SCORE_QUESTION',
    MARK_CORRECT: 'MARK_CORRECT',
    SET_AUTOMATIC_OUTCOME: 'SET_AUTOMATIC_OUTCOME',
    SET_ACTIVITY_OPTIONS: 'SET_ACTIVITY_OPTIONS',
    CLEAR_ACTIVITY_OPTIONS: 'CLEAR_ACTIVITY_OPTIONS',
    SET_HINT_VISIBILITY: 'SET_HINT_VISIBILITY',
    INSTRUCTOR_SCORE: 'INSTRUCTOR_SCORE',
    OVERRIDE_SCORE: 'OVERRIDE_SCORE',
    RESET_ATTEMPT: 'RESET_ATTEMPT'
};

/**
* This represents the main object being logged. It holds all the serializable data that
* will end up in the database in the action table.
*/
function ActionLog(sAction, sSessionId, sResourceId, sExternalObjectId, sSource, sTimezone) {
    var sessionId = sSessionId, source = sSource, action = sAction, infoType = "externalId";
    var info = sResourceId, externalObjectId = sExternalObjectId, timestamp = new Date();
    var timeZone = sTimezone;
    var supplements = [];
    this.getSessionId = function () {
        return sessionId;
    };
    this.setSessionId = function (s) {
        sessionId = s;
    };
    this.getSource = function () {
        return source;
    };
    this.setSource = function (src) {
        source = src;
    };
    this.getAction = function () {
        return action;
    };
    this.setAction = function (act) {
        action = act;
    };
    this.getInfoType = function () {
        return infoType;
    };
    this.setInfoType = function (infoT) {
        infoType = infoT;
    };
    this.getInfo = function () {
        return info;
    };
    this.setInfo = function (inf) {
        info = inf;
    };
    this.getExternalObjectId = function () {
        return externalObjectId;
    };
    this.setExternalObjectId = function (ex) {
        externalObjectId = ex;
    };
    this.getTimestamp = function () {
        return externalObjectId;
    };
    this.setTimestamp = function (time) {
        if (!(time instanceof Date)) {
            throw "Invalid type - time not instanceof Date";
        }
        timestamp = time;
    };
    this.getSupplement = function () {
        return supplements;
    };
    this.addSupplement = function (supplement) {
        if (!(supplement instanceof SupplementLog)) {
            throw "Invalid type - supplement not instanceof SupplementLog";
        }
        supplements.push(supplement);
    };
    this.toXML = function () {
        var xml = $($.parseXML('<?xml version="1.0" encoding="UTF-8"?><log_action/>'));
        if (sessionId !== null) {
            $('log_action', xml).attr({session_id: sessionId});
        }
        if (source !== null) {
            $('log_action', xml).attr({source_id: source});
        }
        if (action !== null) {
            $('log_action', xml).attr({action_id: action});
        }
        if (infoType !== null) {
            $('log_action', xml).attr({info_type: infoType});
        }
        if (externalObjectId !== null) {
            $('log_action', xml).attr({external_object_id: externalObjectId});
        }
        if (timestamp !== null) {
            $('log_action', xml).attr({date_time: timestamp.getTime()});
        }
        if (timestamp !== null) {
            $('log_action', xml).attr({timezone: timeZone});
        }
        if (info !== null) {
            $('log_action', xml).text(info);
        }

        supplements.forEach(function (sl) {
            $('log_action', xml).append(sl.toXML());
        });
        return $('log_action', xml);
    };
}

/**
* If you want to log any supplemental data then fill in this object, it works together
* and is attached to the ActionLog object defined above
*/
function SupplementLog() 
{
    var source = 'EMBEDED_ACTIVITY', action = CommonLogActionNames.START_ATTEMPT, infoType = 'supplement', info = 'supplement';
    this.getSource = function () {
        return source;
    };
    this.setSource = function (src) {
        source = src;
    };
    this.getAction = function () {
        return action;
    };
    this.setAction = function (act) {
        action = act;
    };
    this.getInfoType = function () {
        return infoType;
    };
    this.setInfoType = function (infoT) {
        infoType = infoT;
    };
    this.getInfo = function () {
        return info;
    };
    this.setInfo = function (inf) {
        info = inf;
    };
    this.toXML = function () {
        var xml = $($.parseXML('<log_supplement/>'));
        if (source !== null) {
            $('log_supplement', xml).attr({source_id: source});
        }
        if (action !== null) {
            $('log_supplement', xml).attr({action_id: action});
        }
        if (infoType !== null) {
            $('log_supplement', xml).attr({info_type: infoType});
        }

        if (info !== null) {
            $('log_supplement', xml).text(info);
        }
        return $('log_supplement', xml);
    };
}

var oliLogger = 
{
    logAction: function (logServiceUrl, actionLog, callback) 
	{
        if (!(actionLog instanceof ActionLog)) 
		{
            throw "Invalid type - actionLog not instanceof ActionLog";
        }
		
		console.log ("Log message: " + JSON.stringify (actionLog));
		
        //var logData = (new XMLSerializer()).serializeToString(actionLog.toXML().context);		
        //$.post(logServiceUrl, logData).done(callback);
    }
};
