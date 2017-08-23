/**
 *
 */
SimonBase = function(aClassName, aName)
{
	var className=aClassName;
	var name=aName;
	var pointer=this;

	this.getClassName=function getClassName ()
	{
		return (className);
	};

	// A lot of people accidentally use the function above with a lowercase N. Hence
	// this backup
	this.getClassname=function getClassname ()
	{
		return (className);
	};

	this.setClassName=function setClassName(aClass)
	{
		className=aClass;
	};

	this.setName=function setName (sName)
	{
		name=sName;
	};

	this.getName=function getName ()
	{
		return (name);
	};

	this.getUseDebugging=function getUseDebugging()
	{
		return (useDebugging);
	};

	this.setUseDebugging=function setUseDebugging(aValue)
	{
		useDebugging=aValue;
	};

	/**
	 *
	 */
	this.toHHMMSS = function (aValue)
	{
		var sec_num = parseInt(aValue, 10); // don't forget the second param
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		return hours+':'+minutes+':'+seconds;
	};

	/**
	*
	*/
	this.simondebug=function simondebug (msg)
	{
		if(!useDebugging)
		{
			//console.log ("Logging disabled!");
			return;
		}

		var aMessage=msg;

		if (useDebuggingBasic)
		{
			pointer.simondebugInternal (aMessage,"UnknownClass");
			return;
		}

		if (msg===null)
		{
			aMessage="No message provided";
		}
		
		pointer.simondebugInternal (aMessage,pointer.getClassName());
	};

	/**
	*
	*/
	this.simondebugObject=function debugObject (object)
	{
		//var output='';
		var index=0;

		for (var property in object)
		{
		  //output += property + ': ' + object[property]+'; \n ';
		  pointer.simondebug ("("+index+")" + property + ': ' + object[property]);

		  index++;
		}
	};

	/**
	*
	*/
	this.simondebugInternal=function debugInternal (msg,sClassName)
	{
		var aMessage=msg;
		var txt="No msg assigned yet";

		if (aMessage===null || aMessage===undefined)
		{
			aMessage="No message!";
		}

		if (aMessage==="")
		{
			aMessage="Empty message!";
		}

		if (useDebuggingBasic)
		{
			txt=formatLogMessage ("Unknown","undefined",aMessage);

			if (!SimonBase.customconsole)
			{
				SimonBase.customconsole=getSafeElementById('customconsole');
			}

			if (SimonBase.customconsole)
			{
				SimonBase.customconsole.innerHTML+=(txt+"<br>");

				SimonBase.customconsole.scrollTop = SimonBase.customconsole.scrollHeight;
			}
            else
            {
                //console.log(txt);
            }

			return;
		}

		if (sClassName===null)
		{
			sClassName="UndefinedClass";
		}

		if (aMessage===null)
		{
			aMessage="No message";
		}

		txt=formatLogMessage (sClassName,pointer.getName (),aMessage);

		console.log (txt);
	};

	/**
	*
	*/
	this.simondebugObjectShallow=function simondebugObjectShallow (object)
	{
		var output = '';

		for (var property in object)
		{
		  output += property + ', ';
		}

		pointer.simondebugInternal ("Object: " + output,"Global");
	};

	/**
	*
	*/
	this.urldecode=function urldecode(str)
	{
	   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
	};

	/**
	*
	*/
	this.entitiesConvert=function entitiesConvert (str)
 	{
		this.simondebug ("entitiesConvert ()");

		return (this.urldecode (unescape (str)));
 	};

 	/**
	*
	*/
	this.entitiesGenerate=function entitiesGenerate (str)
 	{
		var temper=str;

		return (temper);
 	};

	/**
	*
	*/
	function formatLogMessage (aClass,anInstance,aMessage)
	{
		//var now = new Date();

		if (aClass===null)
		{
			aClass="unknownclass";
		}

		if (anInstance===null)
		{
			anInstance="nullinstance";
		}

		//var formatted=pointer.htmlEncode (aMessage);
		var formatted=aMessage;

		//var txt="["+now.format("hh:MM:ss")+"] ["+aClass+":"+anInstance+"] "+formatted;
		var txt="["+aClass+":"+anInstance+"] "+formatted;

		return (txt);
	}

};

/**
 *
 */
function formatLogMessageGoogle (aClass,anInstance,aMessage)
{
	var base = new SimonBase(aClass,anInstance);
	var formatted=base.htmlEncode (aMessage);
	var txt="["+aClass+":"+anInstance+"] "+formatted;

	return (txt);
}

/**
 *
 */
function simondebug (aMessage)
{
	if(!useDebugging && !useDebuggingBasic)
	{
		//console.log ("debugging is turned off!");
		return;
	}

	if (aMessage===null)
	{
		aMessage="Empty message!";
		return;
	}

	if (!simondebug.debugPointer)
	{
		simondebug.debugPointer = new SimonBase("Simon", "class");
	}

	simondebug.debugPointer.simondebug (aMessage,"SimonClass");
}

/** List of booleans for filtering simondebug() traces. */
Object.defineProperty(SimonBase, "DebuggingFilter", {enumerable: false, configurable: false, writable: true, value: []});

if(typeof module !== 'undefined')
{
    module.exports = SimonBase;
}
;var useDebugging;

if(useDebugging === undefined)
{                            // could be defined in other code loaded earlier: don't clobber that one
	useDebugging = false;
}

var useDebuggingBasic;

if(useDebuggingBasic === undefined)
{
	useDebuggingBasic=false;
};
;var WEIRDCMU_PREFIX = "weirdcmu";
/** String constant "fire_". */
var FIRE_PREFIX = "fire_";
/** Length constant 37. */
var FIRE_LEN = 37;
/** String constant "Stu_". */
var STU_PREFIX = "Stu_";
/** String constant "Test_". */
var TEST_PREFIX = "Test_";


/**
*
*/
function generateSalt() 
{
	/*
	SecureRandom random = new SecureRandom();
	byte bytes[] = new byte[20];
	random.nextBytes(bytes);
	return bytes;
	*/
	
	var buf = new Uint8Array(20);
	
	return (window.crypto.getRandomValues(buf));
}

/**
*
*/
var FallbackMD5=function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

/**
 *  Encrypts the current actualUserId and stores the result in the anonymousUserId.
 */
function encryptUserId(actualUserId) 
{
	var anonymized=actualUserId; // only as a backup
	
	var lowerCase = actualUserId.toLowerCase();
	var prefix = STU_PREFIX;
	
	if (lowerCase.startsWith(WEIRDCMU_PREFIX)) 
	{
	   prefix = TEST_PREFIX;
	}
	
	if (lowerCase.startsWith(FIRE_PREFIX) && lowerCase.length() == FIRE_LEN) 
	{
	   anonymized = actualUserId;
	}
	else 
	{
	   var salt = generateSalt().toString();
	   
	   anonymized = prefix + CryptoJS.MD5(actualUserId + salt);
	}
	
	return (anonymized)
};;/**
 *
 */

var logIndex=1;
var loadIndex=0;
var buildCalled=false;
var isAngular=false;
var transformedTable={};
var monitorURL="";
var __origDefine = define;
var activityBasepath="";

var APIActivity=null;;/**
 *
 */
 
/**
* http://www.w3schools.com/jsref/prop_doc_documentmode.asp
*
* 5 - The page is displayed in IE5 mode
* 7 - The page is displayed in IE7 mode
* 8 - The page is displayed in IE8 mode
* 9 - The page is displayed in IE9 mode
* 10 - The page is displayed in IE10 mode
* 11 - The page is displayed in IE11 mode
*/
function OLIBrowserCheck ()
{
	if (document.documentMode < 9)
	{
		document.body.innerHTML = "";
		document.write("The content you are trying to view is not supported in the current Document Mode of Internet Explorer. Change the Document Mode to Internet Explorer 9 Standards and try to view the content again.<br>To change the Document Mode, press F12, click Document Mode: <current mode>, and then select Internet Explorer 9 Standards.");		
		return (false);
	}
	
	return (true);
}

/**
* CTAT has a similar one so I changed the name
*/
function OLIFormatLogMessage (aClass,anInstance,aMessage)
{
	//var now = new Date();

	if (aClass===null)
	{
		aClass="unknownclass";
	}

	if (anInstance===null)
	{
		anInstance="nullinstance";
	}

	var formatted=aMessage;

	var txt="["+logIndex+"]["+aClass+":"+anInstance+"] "+formatted;
	
	logIndex++;

	return (txt);
}

/**
*
*/ 
function olidebug (aMessage)
{
	simondebug (aMessage);
}
;/**
* For now this is a placeholder for the existing superactivity.js which is still actively
* in use on the OLI legacy system. It will be integrated whole-cloth until it can be
* refactored.
*/;/**
*
*/

/**
*
*/
function OLIExternalAdaptiveActivity (aSuperClient,aUser,aCourse,aURL,anActivity) 
{
	var superClient = aSuperClient;	
	var pointer=this;
    var studentId = aUser;
	var studentIdAnon = encryptUserId (aUser);
    var apiBaseUrl = aURL;
    var courseId = aCourse;
	var currentProblem ="none";
	var attemptCount=0;
    var params = 
	{
		'pg': 0.25,
		'ps': 0.25,
		'pi': 0.1,
		'pt': 0.5,
		'threshold': 0.99
	};
    var skills = 
	[
		'describesample',
		'idsampling',
		'identifybiassample',
		'critique',
		'experimvsobs',
		'surveydesign',
		'lurkingvar',
		'studydesigndefin',
		'idstudydesign'
	];
	var aRegisterSuccessCallback=null;
	var aRegisterFailCallback=null;

	/**
	*
	*/
	this.setCurrentProblem = function (aProblem)
	{
		currentProblem=aProblem;
	};
	
	/**
	*
	*/
	this.getCurrentProblem = function ()
	{
		return (currentProblem);
	};
	
	/**
	*
	*/
	this.incAttemptCount = function ()
	{
		attemptCount++;
	};
	
	/**
	*
	*/
	this.setAttemptCount = function (aCount)
	{
		attemptCount=aCount;
	};
	
	/**
	*
	*/
	this.getAttemptCount = function ()
	{
		return (attemptCount);
	};	
	
	/**
	* This is the generic method (interface) In the EdX version we call
	* the back-end specific call
	*/
    this.registerUser = function(registerSuccessCallback,registerFailCallback)
	{
		simondebug ("registerUser ("+studentId+" -> "+studentIdAnon+ ")");
		
		/*
		aRegisterSuccessCallback=registerSuccessCallback;
		aRegisterFailCallback=registerFailCallback;
					
		APIActivity.getValue ("anonymousid",pointer.processGetAnonIDSucceeded,pointer.processGetAnonIDFail);	
		*/
		
		simondebug ("Let's pretend for now that we have an anonymous id. This will ensure that for testing purposes we always get a new id");
		
		pointer.processGetAnonIDSucceeded ({result:'success'});
    };	
	
	/**
	*
	*/	
    this.configureUser = function() 
	{
		simondebug ("configureUser ()");
		
        var studentConfig = 
		{
            'course_id': courseId,
            'params': params,
            'user_id': studentIdAnon,
            'skills_list': skills
        };
		
        return $.ajax(
		{
            url: apiBaseUrl + '/parameters/bulk',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify (studentConfig),
        })
        .done(function() 
		{
            simondebug("Skills: " + skills + " is  configured");
			
			// We don't call the success handler here since we need to continue with a 
			// another internal function
        })
        .fail(function() 
		{
            simondebug('Failed to configure skills: "'+skills+'" for user "'+studentIdAnon+'"');
            
			if (aRegisterFailCallback)
			{
				aRegisterFailCallback ();
			}	
        });		
    };	
	
	/**
	*
	*/	
    this.registerUserInEdxAdapt = function() 
	{
		simondebug ("registerUserInEdxAdapt ()");				
        
        $.ajax({
            url: apiBaseUrl + '/course/' + courseId + '/user',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({'user_id': studentIdAnon}),
        })
        .done(function() 
		{
            simondebug("User Created");
			
			if (aRegisterSuccessCallback)
			{
				aRegisterSuccessCallback ();
			}
			
            pointer.setStatusOk();
        })
        .fail(function() 
		{
            simondebug("Failed to create user");
			
            pointer.setStatusNok();
			
			if (aRegisterFailCallback)
			{
				aRegisterFailCallback ();
			}				
        });
    };
	
	/**
	*
	*/	
    this.pageLoadComplete = function() 
	{
		simondebug ("pageLoadComplete ("+pointer.getCurrentProblem ()+")");				
        
		var pageLoad=JSON.stringify({'problem': pointer.getCurrentProblem ()});
		
		console.log ("pageLoad: " + pageLoad);
		
        $.ajax(
		{
            url: apiBaseUrl + '/course/' + courseId + '/user/' + studentIdAnon +'/pageload',
            type: 'POST',
            contentType: 'application/json',
            data: pageLoad,
        })
        .done(function() 
		{
            simondebug("Pageload confirmed");
			
        })
        .fail(function() 
		{
            simondebug("Unable to confirm pageload");
			

        });
    };
	
	/**
	*
	*/	
    this.indicateProblemComplete = function(anEvaluation,anAttemptCount) 
	{
		simondebug ("indicateProblemComplete ("+anEvaluation+")");

		var pageLoad=JSON.stringify({'problem': pointer.getCurrentProblem (), 'correct': anEvaluation, 'attempt': anAttemptCount});		
		        
		console.log ("pageLoad: " + pageLoad);				
				
        $.ajax(
		{
            url: apiBaseUrl + '/course/' + courseId + '/user/' + studentIdAnon +'/interaction',
            type: 'POST',
            contentType: 'application/json',
            data: pageLoad,
        })
        .done(function() 
		{
            simondebug("Pageload confirmed");
			
        })
        .fail(function() 
		{
            simondebug("Unable to confirm pageload");
			

        });
    };	
		
	/**
	*
	*/	
	this.processGetAnonIDSucceeded = function (aData)
	{
		simondebug ("processGetAnonIDSucceeded ()");
				
		if (aData)
		{
			simondebug ("Data: " + JSON.stringify(aData));	
		}	
		
        simondebug ("Checking if student already registered in EdxAdapt ...");
		
        $.ajax(
		{
            url: apiBaseUrl + '/course/' + courseId + '/user/' + studentIdAnon,
            type: 'GET',
            contentType: 'application/json',
        })
        .done(function(data, textStatus) 
		{            
			simondebug ("Success, the student already exists in Edx-Adapt: " + data + " : " + textStatus);
						
			pointer.setStatusOk();
			
			if (aRegisterSuccessCallback)
			{
				aRegisterSuccessCallback (data);
			}
        })
        .fail(function(jqXHR, textStatus) 
		{
            if (jqXHR.status == 404) 
			{
                simondebug ("Student not found in EdxAdapt. Let's configure and register them ...");
				
				$.when.apply($, pointer.configureUser()).then(pointer.registerUserInEdxAdapt());
            }
			
            simondebug("Failed to register student in EdxAdapt: " + jqXHR.responseText);
        });				
	};
	
	/**
	* Our anonymous id doesn't exist on the server, create it ...
	*/
	this.processGetAnonIDFail = function (aData)
	{
		simondebug ("processGetAnonIDFail ()");
		
		// store the anonymous id ...

		APIActivity.setValue ("anonymousid",studentIdAnon,pointer.processGetAnonIDSucceeded);
		
		// and try again ...
		
		pointer.processGetAnonIDSucceeded ();
	};
	
    /**
    * Get student's status data form the EdxAdapt and use it for custom event creation.
    * @param {object} data - response data from EdxAdapt
    */
	this.getFirstAdaptiveProblem = function (aCallback)
	{
		simondebug ("getFirstAdaptiveProblem ()");
		       
		$.ajax(
		{
			url: apiBaseUrl + '/course/' + courseId + '/user/' + studentIdAnon,
			type: 'GET',
			contentType: 'application/json',
		})
		.done(function(data, textStatus) 
		{
			simondebug("First problem successfully found", textStatus);   

			if (aCallback)
			{
				aCallback (data);
			}
		})
		.fail(function(jqXHR, textStatus) 
		{
			simondebug("Failed to get first adaptive problem for student from EdxAdapt", jqXHR.responseText);
		});
    };	
	
    /**
    * Get student's status data form the EdxAdapt and use it for custom event creation.
    * @param {object} data - response data from EdxAdapt
    */
	this.getNextAdaptiveProblem = function (aCallback)
	{
		simondebug ("getNextAdaptiveProblem ()");
		       
		$.ajax(
		{
			url: apiBaseUrl + '/course/' + courseId + '/user/' + studentIdAnon,
			type: 'GET',
			contentType: 'application/json',
		})
		.done(function(data, textStatus) 
		{
			simondebug("First problem successfully found", textStatus);   

			if (aCallback)
			{
				aCallback (data);
			}
		})
		.fail(function(jqXHR, textStatus) 
		{
			simondebug("Failed to get first adaptive problem for student from EdxAdapt", jqXHR.responseText);
		});
    };	
	
	/**
	*
	*/	
    this.setStatusOk = function() 
	{
		simondebug ("setStatusOk ()");
		
        //$('#status_ok').css('visibility', 'visible');
    };
	
	/**
	*
	*/	
    this.setStatusNok = function() 
	{
		simondebug ("setStatusNok ()");
		
        //$('#status_nok').css('visibility', 'visible');
    };
	
    /**
    * Create and publish custom event with url to the problem chosen by EdxAdapt.
    * @param {object} data - response data from EdxAdapt
    */
    function createEnrollOkEvent(data) 
	{
        var problemUrl;
		
        if (data.current) 
		{
            problemUrl = data.current.tutor_url;
        }
		else if (data.next) 
		{
            problemUrl = data.next.tutor_url;
        }
        if (problemUrl) 
		{
            var event = new CustomEvent("edxAdaptEnrollOk", {detail: { adaptiveProblem: problemUrl } });
            document.dispatchEvent(event);
        }
		else 
		{
            simondebug ("Failed to get tutor_url to the first adaptive problem");
        }
    }
}
;/**
*
*/

/**
*
*/
function OLITutorgenAdaptiveActivity (aSuperClient,aUser,aCourse,aURL,anActivity) 
{
	var tempUser=aUser;
	//var tempUser="vvelsen2";
	
	var superClient = aSuperClient;	
	var pointer=this;
    var studentId = tempUser;
//	var studentIdAnon = encryptUserId (aUser);
    var studentIdAnon = tempUser;
    var apiBaseUrl = aURL;
    var courseId = aCourse;
	var groupId = "oliglobal";
	var learningSystemId = "5";
	var currentProblem ="none";
	var attemptCount=0;
	var loadFinished=0;
	var authString="";
	var currentProblem="";
	
	var problemIDs=[];

	var aRegisterSuccessCallback=null;
	var aRegisterFailCallback=null;

	/**
	*
	*/
	this.setCurrentProblem = function (aProblem)
	{
		currentProblem=aProblem;
	};
	
	/**
	*
	*/
	this.getCurrentProblem = function ()
	{
		return (currentProblem);
	};
	
	/**
	*
	*/
	this.incAttemptCount = function ()
	{
		attemptCount++;
	};
	
	/**
	*
	*/
	this.setAttemptCount = function (aCount)
	{
		attemptCount=aCount;
	};
	
	/**
	*
	*/
	this.getAttemptCount = function ()
	{
		return (attemptCount);
	};	
	
	/**
	 *
	 */	
	this.getRequest = function (aURL,aSucceedCallback,aFailCallback)
	{
		$.ajax(
		{
			url: aURL,
			type: 'GET',
			contentType: 'application/json',
			xhrFields: {withCredentials: true},
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Basic " + authString);
			},			
		})
        .done(function(reply) 
		{
            simondebug("getRequest succeeded");
			
			if (aSucceedCallback)
			{
				aSucceedCallback (reply);
			}
        })
        .fail(function(result) 
		{
            simondebug("getRequest failed");
			
			if (aFailCallback)
			{
				aFailCallback (result);
			}
        });			
	};
	
	/**
	 *
	 */
	this.postRequest = function (aURL,aData,aSucceedCallback,aFailCallback)
	{
		simondebug ("postRequest ()");
		
        $.ajax(
		{
            url: aURL,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify (aData),
		    xhrFields: {withCredentials: true},
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Basic " + authString);
			}
        })
        .done(function(reply) 
		{
            simondebug("postRequest succeeded");
			
			if (aSucceedCallback)
			{
				aSucceedCallback (reply);
			}
        })
        .fail(function(result) 
		{
            simondebug("postRequest failed");
			
			if (aFailCallback)
			{
				aFailCallback (result);
			}
        });			
	};	
	
	/**
	* Obtain the auth string from the XML file in our activity and encode it.
	*/	
	this.prepAuth = function ()
	{
		simondebug ("prepAuth ()");
		
		var authSet=APIActivity.findResourcesByType ("auth");
	
		if (authSet.length==0)
		{
			showFeedback ("Error, no authentication info found, please check your xml file.");
			return;
		}

		authString=btoa(authSet [0]);
				
		olidebug ("Auth string set to: " + authString);
	};
	
	/**
	* Obtain the tutorgen specific info from the activity XML
	*/	
	this.prepTutorGen = function ()
	{
		simondebug ("prepTutorGen ()");
		
		var tGen=APIActivity.findResourcesByType ("tutorgen");
	
		if (tGen.length==0)
		{
			showFeedback ("Error, no tutorgen info found, please check your xml file.");
			return;
		}
		
		var items=tGen.length [0].split (":");

	    learningSystemId = items [0];
        courseId = items [1];
	};	
	
	/**
	 *
	 */
	this.createGroup = function ()
	{
		simondebug ("createGroup ()");
		
		pointer.getRequest (apiBaseUrl + learningSystemId + '/content-groupings/',
							function (data)
							{
								simondebug ("Group data retrieved, analyzing ...");
		
								var createRequest= 
								{
									"ls_cg_id": groupId,
									"name" : "Global OLI content group for all embedded activities",
									"course": courseId
								};
								
								var doCreate=true;
								if (data ["results"])
								{
									var results=data ["results"];
									for (var i=0;i<results.length;i++)
									{
										var testGroup=results [i];
										
										if (testGroup ["ls_cg_id"]==groupId)
										{
											simondebug ("Our group Id already exists, indicating we won't have to register again ...");
											doCreate=false;
										}
									}
								}
								
								if (doCreate==true)
								{
									pointer.postRequest (apiBaseUrl + learningSystemId + '/content-groupings/',
										createRequest,
										function (){
											simondebug ("succeeded");
										},function (){
											simondebug ("failed");
										});
								}		
 							},
							function ()
							{});
	};	
	
	/**
	 *
	 */
	this.createKCs = function (aData)
	{
		simondebug ("createKCs ()");
		
		pointer.getRequest (apiBaseUrl + learningSystemId + '/kcs/',
							function ()
							{
								simondebug ("succeeded");
								
								/*
								kcs=[];
								
								var lines=aData.split("\r\n");
								
								for (var i=0;i<lines.length;i++)
								{
									var problemSkill=lines [i].split (",");
									
									kcs.push ({'problem': problemSkill [0],'skills': problemSkill [1]});
								}
								
								for (var j=0;j<kcs.length;j++)
								{
									console.log ("Sending problem: " + JSON.stringify (kcs [j]));
									
									var aProblemDefintion = kcs [j];
									
									var pageLoad=			
									{
										"ls_kc_id": aProblemDefintion ["skills"],
										"name": aProblemDefintion ["skills"],
										"kc_desc": aProblemDefintion ["skills"],
										"course": courseId
									}			

									$.ajax(
									{
										url: apiBaseUrl + learningSystemId + '/kcs/',
										type: 'POST',
										contentType: 'application/json',
										data: JSON.stringify (pageLoad),
										xhrFields: {withCredentials: true},
										beforeSend: function (xhr) {
											xhr.setRequestHeader ("Authorization", "Basic " + authString);
										},
									})
									.done(function(data, textStatus) 
									{
										simondebug ("Problem " + problemIDs [j]["problem"] + " successfully registered");
									})
									.fail(function(jqXHR, textStatus) 
									{
										simondebug("Unable to register problem " + problemIDs [j]["problem"], jqXHR.responseText);
									});			
									
									pointer.postRequest (apiBaseUrl + learningSystemId + '/kcs/',
														 pageLoad,
														 function (){
															simondebug ("succeeded");
														 },
														 function (){
															simondebug ("failed");
														 });									
								}
								*/								
								
							},
							function ()
							{
								simondebug ("failed");
							});				
	};
	
	/**
	 *
	 */
	this.createUser = function ()
	{
		simondebug ("createUser ()");
		
		var createRequest= 
		{
			"ls_learner_id" : studentIdAnon,
			"name" : "Currently not Sent",
			"courses": courseId
		};
				
		pointer.postRequest (apiBaseUrl + learningSystemId + '/learners/',
		                     createRequest,
							 function ()
							 {
								simondebug ("succeeded");
							 },
							 function ()
							 {
								simondebug ("failed");
							 });		
	};
	
	/**
	* For this API in this case if the user isn't found we essentially get both a 404
	* and a response JSON block we should examine. A typical reply is:
	* {
	*   "readyState": 4,
	*   "responseText": "{\"detail\":\"Not found.\"}",
	*   "responseJSON": {
	*     "detail": "Not found."
	*   },
	*   "status": 404,
	*   "statusText": "Not Found"
	* }
	*
	* If however the user does exist we get something like the following:
	*
	* {
	*   "ls_learner_id": "vvelsen",
	*   "created": "2017-05-05T13:34:28.506370Z",
	*   "modified": "2017-05-05T13:34:28.506802Z",
	*   "name": "Martin van Velsen",
	*   "courses": [
	*     "1"
	*   ]
	* }
	*/
	this.checkUserExists = function (data)
	{
		simondebug ("checkUserExists ()");
		simondebug ("request response: " + JSON.stringify (data));
		
		var userFound=true;
		
		if (!data)
		{
			simondebug ("There is no data to examine, bump");
			return (false);
		}
		
		if (data ["ls_learner_id"])
		{
			if (data ["ls_learner_id"]!=studentIdAnon)
			{
				userFound=false;
			}
		}
		else
		{		
			if (data ["responseJSON"])
			{
				if (data ["responseJSON"]["detail"])
				{
					simondebug ("Explicit message that the user was not found, marking for creation ...");
					if (data ["responseJSON"]["detail"]=="Not found.")
					{
						userFound=false;					
					}
					else
					{
						simondebug ("data [responseJSON][detail] doesn't have expected value, bump");
						return (false);
					}				
				}
				else
				{
					simondebug ("data [responseJSON] doesn't have expected value, bump");
					return (false);
				}
			}
			else
			{
				simondebug ("data [detail] not found in message, bump");
				return (false);
			}
		}	
		
		if (userFound==false)
		{
			simondebug("User does not exist, creating ...");
				
			pointer.createUser ();
		}

		return (true);
	}
	
	/**
	* This is the generic method (interface) In the EdX version we call
	* the back-end specific call
	*/
    this.registerUser = function(registerSuccessCallback,registerFailCallback)
	{
		simondebug ("registerUser ("+studentId+" -> "+studentIdAnon+ ")");
		
		// Obtain the auth string from the XML file in our activity and encode it.
		pointer.prepAuth ();
		
		// Make sure we have a group for every course. We will have to investigate
		// if the idea of groups is something we may want to add to oli-adapt and
		// other adaptive APIs
		pointer.createGroup ();
				
		pointer.loadProblemsFromTutorgen ();

		// First check if the user exists ...

		pointer.getRequest (apiBaseUrl + learningSystemId + '/learners/' + studentIdAnon + '/',
			function (data)
			{						
				if (pointer.checkUserExists (data)==true)
				{
					if (registerSuccessCallback)
					{
						registerSuccessCallback ();
					}
				}
				else
				{
					if (registerFailCallback)
					{
						registerFailCallback ();
					}								
				}
			},
			function (data)
			{
				if (pointer.checkUserExists (data)==true)
				{
					if (registerSuccessCallback)
					{
						registerSuccessCallback ();
					}
				}
				else
				{
					if (registerFailCallback)
					{
						registerFailCallback ();
					}								
				}	
			});
    };
	
	/**
	 *
	 */	
	this.parseProblems = function (aData)
	{
		simondebug ("parseProblems ()");
		
		problemIDs=[];
		
		var lines=aData.split("\r\n");
		
		for (var i=0;i<lines.length;i++)
		{
			var problemSkill=lines [i].split (",");
			
			problemIDs.push ({'problem': problemSkill [0],'skills': problemSkill [1]});
		}		
	};
	
	/**
	 *
	 */
	this.loadProblemsFromTutorgen = function ()
	{
		simondebug ("loadProblemsFromTutorgen ()");
									
		var problemDefs=APIActivity.findResourcesByType ("problems");
	
		if (problemDefs.length==0)
		{
			showFeedback ("Error, no problem definitions found, please check your xml file.");
			return;
		}
				
		olidebug ("Loading " + problemDefs.length + " problem file(s) ...");
	
		loadFinished=0;
	
		for (var i=0;i<problemDefs.length;i++)
		{	
			var problemDefinitionURL=APIActivity.getDownloadableResource (problemDefs [i]);		
			
			pointer.getRequest (problemDefinitionURL,	                        
				function (data)
				{
					olidebug ("success loading problem set "  + loadFinished);
					
					pointer.parseProblems (data);
						
					loadFinished++;
						
					if (loadFinished>(problemDefs.length-1))
					{
						olidebug ("All problem definitions loaded from OLI, processing ...");
						
						pointer.getRequest (apiBaseUrl + learningSystemId + '/problems/',	                        
							function (data)
							{		
								if (data ["count"]>0)
								{
									simondebug ("The server gave us some problems in the list, we're going to assume we've already uploaded what we have");
									return;
								}
								else
								{
									// Register any KCs we can obtain from our problem defintion file. Note that
									// we're using the same definition file as for EdX-Adapt (oli-adapt.js)
									pointer.createKCs (data);
				
									pointer.problemsLoaded (data);									
								}
							}, function (){});	
					}
				},
				function ()
				{
					
				});
		}
	};
	
	/**
	*
	*/
	this.problemsLoaded=function (aData)
	{
		simondebug ("problemsLoaded ()");
				
		for (var j=0;j<problemIDs.length;j++)
		{
			console.log ("Creating problem on the server: " + JSON.stringify (problemIDs [j]));
			
			var aProblemDefintion = problemIDs [j];
			
			var pageLoad=
			{
				"ls_problem_id": aProblemDefintion ["problem"],
				"cg1": "oliglobal",
				"kcs": [aProblemDefintion ["skills"]]
			}
			
		    pointer.postRequest (apiBaseUrl + learningSystemId + '/problems/',
		                        pageLoad,
								function ()
							    {			
								},
								function ()
								{
								});
		}
	};
	
	/**
	*
	*/		
	this.pageLoadComplete = function ()
	{
		simondebug ("pageLoadComplete ()");
		
		// Not used in the case of Tutorgen, but important to have in the interface
	};
		
	/**
	*
	*/	
    this.indicateProblemComplete = function(anEvaluation,anAttemptCount) 
	{
		simondebug ("indicateProblemComplete ("+anEvaluation+")");

		var score=0;
		var answer="incorrect";
		
		if (anEvaluation==true)
		{
			score=1;
			answer="correct";
		}
		
		var pageLoad=
		{
			"learner": studentIdAnon,
			"problem": currentProblem,
			"result": anEvaluation,
			"answer": answer,
			"score": score,
			"num_attempts": anAttemptCount
		}		
			
	    pointer.postRequest (apiBaseUrl + learningSystemId + '/transactions/',
 	                         pageLoad,
							 function ()
							 {			
							 },
							 function ()
							 {
							 });
    };	
	
    /**
	*
    */
	this.getFirstAdaptiveProblem = function (aCallback)
	{
		simondebug ("getFirstAdaptiveProblem ()");

		currentProblem=problemIDs [0]["problem"];
		
		var fakeResult=
		{
			'next' :
					{
						'problem_name' : currentProblem
					},
			'done_with_course' : false
		};
		
		aCallback (fakeResult);
    };	
	
    /**
	*
    */
	this.getNextAdaptiveProblem = function (aCallback)
	{
		simondebug ("getNextAdaptiveProblem ()");

		pointer.getRequest (apiBaseUrl + learningSystemId + '/activities/'+studentIdAnon+'/',	                        
		function (data)
		{								 
			/*
				{
				  "created": "2017-05-17T17:30:24.255185Z",
				  "modified": "2017-05-17T17:30:24.255242Z",
				  "level_up": false,
				  "next_activity": "q2_describe_samp_pop",
				  "learner": "vvelsen",
				  "cg1": "oliglobal"
				}
			*/

			if (aCallback)
			{
				currentProblem=data ["next_activity"];
				var isDone=data ["level_up"];
				
				var fakeResult=
				{
					'next' :
							{
								'problem_name' : currentProblem
							},
					'done_with_course' : isDone
				};
				
				aCallback (fakeResult);
			}			
		},
		function ()
		{
			
		});
    };	
	
	/**
	*
	*/	
    this.setStatusOk = function() 
	{
		simondebug ("setStatusOk ()");
		
        //$('#status_ok').css('visibility', 'visible');
    };
	
	/**
	*
	*/	
    this.setStatusNok = function() 
	{
		simondebug ("setStatusNok ()");
		
        //$('#status_nok').css('visibility', 'visible');
    };
	
	simondebug ("OLITutorgenAdaptiveActivity ()");
}
;/**
 *
 */
 
var fullscreenEnterIcon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAgMAAAC+UIlYAAAACVBMVEUAAAAAAAAAAACDY+nAAAAAAnRSTlMAgJsrThgAAADHSURBVFjD7daxEcMgDEBR1GgITeN5mEZDqBFTpkjs4Avw+xiV3Cv+qeBUyp493TSY54D1lp4M6rmkGTACSkAInBFzYASUgBD4RCyAEVACQuAdsQJGQAkIgVIJGAElIARKJWAElIAQKJWAEVACQqBUAkZACcgFDvpAnEAQSALtIOAEgkASmEZcwAkEgSQwi/gCJxAEksAkogNOIAgkgXFED5xAEEgCw4gbcAJBIAmMIu7ACQSB3GfSEuy7uv1safD0MAAL+nfwAj9TPO6QpGE4AAAAAElFTkSuQmCC";
var fullscreenEndIcon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAgMAAAC+UIlYAAAACVBMVEUAAAAAAAAAAACDY+nAAAAAAnRSTlMAgJsrThgAAADHSURBVFjD7daxEcMgDEBR1GgITeN5mEZDqBFTpkjs4Avw+xiV3Cv+qeBUyp493TSY54D1lp4M6rmkGTACSkAInBFzYASUgBD4RCyAEVACQuAdsQJGQAkIgVIJGAElIARKJWAElIAQKJWAEVACQqBUAkZACcgFDvpAnEAQSALtIOAEgkASmEZcwAkEgSQwi/gCJxAEksAkogNOIAgkgXFED5xAEEgCw4gbcAJBIAmMIu7ACQSB3GfSEuy7uv1safD0MAAL+nfwAj9TPO6QpGE4AAAAAElFTkSuQmCC";
 
// We're not using requirejs so we should provide a shallow version of the loader
// to make sure we can use our API in a non-embedded scenario
if (!define)
{
	var dummyKickoff=null;
	var define=function (aFunctionResult)
	{
		dummyKickoff=aFunctionResult;
		
		$(function () 
		{
			dummyKickoff ();

			APIActivity.init (superClient,getLaunchAttributes (false));			
		});	
	}
}

/**
*
*/ 
define(function () 
{
	/**
	*
	*/	
    function OLIAPI() 
	{
		useDebugging=true;
	
		olidebug ("OLIAPI ()");
		
		var superClient = null;
		var activityData = null;
		var datashopLogger = null;
				
        var workbookTitle = null;
		var workbookAssets = [];
		
		var questionTitle = "Unassigned";
		var questionList = {};
		var answerList = {};
		var feedbackList = {};
		var hintsList = {};
		var questionHintsList = [];
		var questionsSaveData = new SaveData();
		var resourceResults=[];
		
		var adaptiveDriver=null;

		var pointer=this;
		
		/**
		*
		*/		
        this.init = function (sSuperClient, aData)
		{
			olidebug ("init ()");

            superClient = sSuperClient;
			activityData = aData;
			
            workbookTitle = $(activityData).find("title").text();
						
			var assetIndex=0;
			
			if ($(activityData).find("title"))
			{
				questionTitle=$(activityData).find("title").text();
			}	
			
            $(activityData).find("assets").children("asset").each(function (index)
			{
                olidebug ("asset name " + $(this).attr("name") + " value " + $(this).text());
								
				var asset={"type" : $(this).attr("name"), "source" : $(this).text()}
				
				workbookAssets [assetIndex]=asset;
				
				assetIndex++;
            });
			
			if (assetIndex==0) // In other words there are no assets so it's safe to assume we're not in an embedded case
			{
				olidebug ("No assets found, either we're in a minimal activity or we're not embedded, calling build straight up ...");

				pointer.kickoff ();	
			}
			else
			{
				pointer.prepResources ();
				pointer.sortResources ();
				pointer.loadResources ();
			}
        };

		/**
		 *
		 */	
		this.kickoff = function ()
		{
			simondebug ("kickoff ()");
			
			if (typeof startActivity !== 'undefined')
			{
				startActivity ();
			}
			else
			{
				olidebug ("No startActivity function provided, trying the fallback 'build ()' function ...");
				
				if (typeof build !== 'undefined')
				{
					build ();
				}
				else
				{
					olidebug ("No build function provided, bump");
				}					
			}			
		};
		
		/**
		*
		*/
		this.getQuestionTitle = function ()
		{
			return (questionTitle);
		};
		
		/**
		*
		*/
		this.assignAdaptiveDriver = function (aDriver)
		{
			adaptiveDriver=aDriver;
		};
		
		/**
		*
		*/
		this.getAdaptiveDriver = function ()
		{
			return (adaptiveDriver);
		};
		
		/**
		*
		*/
		this.getActivityData = function ()
		{
			return (activityData);
		};
		
		/**
		*
		*/
		this.getSuperClient = function ()
		{
			return (superClient);
		};
		
		/**
		*
		*/
		this.getNativeLogger = function ()
		{
			return (oliLogger);
		}
		
		/**
		*
		*/
		this.getDatashopLogger = function ()
		{
			return (datashopLogger);
		}		
		
		/**
		*
		*/
		this.getValue=function (aKey,aCallback,aCallbackFail)
		{
			//superClient.loadFileRecord (aKey,1,aCallback,aCallbackFail);
					
			var vars = {fileName: aKey, attemptNumber: 1};

			superClient.post('loadFileRecord', vars, true, true, aCallback, aCallbackFail);			
		};
		
		/**
		*
		*/
		this.deleteValue=function (aKey,aCallback,aCallbackFail)
		{
			olidebug("deleteValue()");

			var vars = {fileName: aKey, attemptNumber: 1};
			
			superClient.post('deleteFileRecord', vars, true, true, aCallback, aCallbackFail);			
		};
		
		/**
		*
		*/
		this.setValue=function (aKey,aValue,aCallback,aCallbackFail)
		{
			superClient.writeFileRecord (aKey,"text/plain",1,aValue,aCallback,aCallbackFail);
		};

		/**
		*
		*/
		this.setActivityBasepath=function (aPath)
		{
			var formatter=aPath;
			
			if (!aPath)
			{
				activityBasepath="";
				return;
			}
			
			olidebug ("Path last char: " + aPath [aPath.length-1]);
			
			if (aPath [aPath.length-1]!="/")
			{
				formatter=aPath+"/";
			}
			
			activityBasepath=formatter;
		}
		/**
		*
		*/
		this.getActivityBasepath=function ()
		{
			return (activityBasepath);
		};
		
		/**
		*
		*/
		this.imgCreate=function(src, alt, title) 
		{
			var img=document.createElement('img');
			img.src= src;
			if (alt!=null) img.alt= alt;
			if (title!=null) img.title= title;
			return img;
		};
		
		/**
		*
		*/
		this.resolveResources=function (aResource,aPath)
		{
			var fixed="";
			var replacement=superClient.webContentFolder + aPath;
			
			fixed = aResource.replace(/<ACTIVITYPATH>/g, replacement);
						
			return fixed;
		};
		
		/**
		*
		*/
		this.mapResources=function mapResources (aResourceList,aPath)
		{
			olidebug ("mapResources ("+aResourceList.length+")");
			
			for (var i=0;i<aResourceList.length;i++) 
			{			
				var loadableResource=aResourceList [i];
				
				aResourceList [i]=pointer.getDownloadableResource (loadableResource,aPath);
				
				//olidebug ("Mapped url: " + aResourceList [i]);
			}
			
			return (aResourceList);
		}
			
		/**
		*
		*/
		this.mapResourceTable=function mapResourceTable (aResourceList,aPath)
		{
			olidebug ("mapResourceTable ()");
			
			transformedTable={};
								
			for (var property in aResourceList) 
			{
				if (aResourceList.hasOwnProperty(property)) 
				{					
					if (property=="___")
					{
						transformedTable ["___"]="___";
					}
					else
					{			
						var value=aResourceList[property];

						/*
						var transformedProperty=pointer.getDownloadableResource (property,aPath);					
						transformedTable [transformedProperty]=value;				
						*/
						
						transformedTable [property]=pointer.getDownloadableResource (value,aPath);
					}	
				}
			}			
			
			return (transformedTable);
		}
			
		/**
		*
		*/
		this.findResourceByExtension=function findResourceByExtension (anExtension)
		{
			olidebug ("findResourceByExtension ()");
			
			for (var i=0;i<workbookAssets.length;i++) 
			{			
				var loadableResource=workbookAssets [i];
				
				if (loadableResource.source.indexOf (anExtension)!=-1)
				{
					return (loadableResource.source);
				}
			}
			
			return (null);
		};
		
		/**
		*
		*/
		this.findResourceByType=function findResourceByType (aType)
		{
			olidebug ("findResourceByType ()");
			
			for (var i=0;i<workbookAssets.length;i++) 
			{			
				var loadableResource=workbookAssets [i];
				
				if (loadableResource.type==aType)
				{
					return (loadableResource.source);
				}
			}
			
			return (null);
		};
		
		/**
		*
		*/
		this.findResourcesByType=function findResourcesByType (aType)
		{
			olidebug ("findResourcesByType ("+aType+")");
			
			var rIndex=0;
			
			resourceResults=[];
			
			for (var i=0;i<workbookAssets.length;i++) 
			{			
				var loadableResource=workbookAssets [i];
				
				if (loadableResource.type==aType)
				{
					olidebug ("Found resource, addding: " + loadableResource.source);
					
					//return (loadableResource.source);
					resourceResults [rIndex]=loadableResource.source;
					rIndex++;
				}
			}
			
			return (resourceResults);
		};		
		
		/**
		*
		*/
		this.getDownloadableResource=function getDownloadableResource (aResource,aPath)
		{
			//olidebug ("getDownloadableResource ("+aResource+","+aPath+")");
			
			if (aPath==null)
			{
				aPath="";
			}
			
			var translated=superClient.webContentFolder + aPath +  aResource;
			
			if ((aResource.indexOf ("http://")!=-1) || (aResource.indexOf ("https://")!=-1))
			{
				translated=aResource;
			}
			
			//olidebug ("Created resource: " + translated);
			
			return (translated);
		};
		
		/**
		*
		*/
		this.getSuperActivityObject=function()
		{
			return (superClient);
		};
		
		/**
		*
		*/
		this.makeAngularCompatible = function ()
		{
			olidebug ("makeAngularCompatible ()");
			
			isAngular=true;
			
			/*
			//<html ng-app>
			//ng-controller="ctrl"
			
			$(":root").attr("ng-app",null);
			*/
		}
		
		/**
		*
		*/
		this.getScript = function (aURL,aPath,aCallback)
		{
			olidebug ("getScript ()");
			
			var baseP=pointer.getDownloadableResource (aURL,aPath);
			
			__origDefine = define;
			define = null;			
			
			$.getScript(baseP,function( data, textStatus, jqxhr ) 
			{
				olidebug (textStatus); // Success
				olidebug (jqxhr.status); // 200
				olidebug ("Load was performed.");
		
				define = __origDefine;
				
				if (aCallback)
				{
					aCallback ();
				}
			}).done(function(script,textStatus) 
			{
				olidebug ("Script load done: " + textStatus);
			}).fail(function (jqxhr,settings,exception)
			{
				olidebug ("Triggered ajaxError handler: " + exception);
			});
		}
		
		/**
		*
		*/		
		this.goFullscreen = function (aTargetFrame)
		{				
			olidebug ("goFullscreen ()");
			
			if (aTargetFrame)
			{
				var targetFrameObject = document.getElementById(aTargetFrame);
				
				if (targetFrameObject) 
				{
					olidebug ("We have a target frame object");
				}
				
				if (targetFrameObject.webkitRequestFullscreen) 
				{
					if (targetFrameObject.contentDocument.webkitIsFullScreen==false) 
					{
						targetFrameObject.webkitRequestFullscreen ();
					} 
					else 
					{
						targetFrameObject.contentDocument.webkitCancelFullScreen ();
					}					
				}
				else
				{
					if ((targetFrameObject.fullScreenElement && targetFrameObject.fullScreenElement !== null) || 
						(!targetFrameObject.mozFullScreen && !targetFrameObject.webkitIsFullScreen))
					{
						if (targetFrameObject.requestFullScreen)
						{  
							targetFrameObject.requestFullScreen();  
						}
						else if (targetFrameObject.mozRequestFullScreen)
						{  
							targetFrameObject.mozRequestFullScreen();  
						}
						else if (targetFrameObject.webkitRequestFullScreen)
						{  
							targetFrameObject.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
						}  
					}
					else
					{  
						if (targetFrameObject.cancelFullScreen)
						{  
							targetDocument.cancelFullScreen();  
						}
						else if (targetDocument.mozCancelFullScreen)
						{  
							targetDocument.mozCancelFullScreen();  
						}else if (targetDocument.webkitCancelFullScreen)
						{  
							targetDocument.webkitCancelFullScreen();  
						}  
					}
				}	
			}
			else
			{
				if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen))
				{
					if (document.documentElement.requestFullScreen)
					{  
						document.documentElement.requestFullScreen();  
					}
					else if (document.documentElement.mozRequestFullScreen)
					{  
						document.documentElement.mozRequestFullScreen();  
					}
					else if (document.documentElement.webkitRequestFullScreen)
					{  
						document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
					}  
				}
				else
				{  
					if (document.cancelFullScreen)
					{  
						document.cancelFullScreen();  
					}
					else if (document.mozCancelFullScreen)
					{  
						document.mozCancelFullScreen();  
					}else if (document.webkitCancelFullScreen)
					{  
						document.webkitCancelFullScreen();  
					}  
				}				
			}		
		};
		
		/**
		*
		*/		
        this.resizeIframe = function () 
		{
			olidebug ("resizeIframe ()");
						
            olidebug("body height " + $('body').prop("scrollHeight"));
        };
		
		/**
		* Use this method to change the ordering of resources to be loaded. Remember
		* that you should only call this before the actual loading code starts
		*/
		this.moveResource = function (from, to)
		{
			workbookAssets.splice(to, 0, workbookAssets.splice(from, 1)[0]);
		};
		
		/**
		* This function is the only code that should be called to update a running Captivate
		* HTML5 project to work with OLI. It does two things:
		* 1. Go through the data model and patch all the assets that point to resources on disk
		*    to have the full OLI url
		* 2. Replace two asset lookup functions to properly resolve to resources loaded from OLI
		*    - a.ImageObject.load ()
		*    - a.ImageManager.getImageDataURI ()
		*
		* More information on the native Captivate API user can access:
		* https://helpx.adobe.com/captivate/using/common-js-interface.html
		*/
		this.patchCaptivate=function (aPath)
		{		
			olidebug ("patchCaptivate ()");
			
			cp.model.projectImages = pointer.mapResources (cp.model.projectImages,aPath);
			cp.model.images = pointer.mapResources (cp.model.images,aPath);
			cp.model.videos = pointer.mapResources (cp.model.videos,aPath);
			cp.model.slideVideos = pointer.mapResources (cp.model.slideVideos,aPath);
			cp.model.tocVideos = pointer.mapResources (cp.model.tocVideos,aPath);
			cp.model.audios = pointer.mapResources (cp.model.audios,aPath);
		
			for (var property in cp.model.data) 
			{
				if (cp.model.data.hasOwnProperty(property)) 
				{										
					var targetStructure=cp.model.data [property];
					
					for (var fixable in targetStructure) 
					{
						if (targetStructure.hasOwnProperty(fixable)) 
						{
							if ((fixable=="src") || (fixable=="ip"))
							{							
								//if ((targetStructure [fixable].indexOf ("ar/")!=-1) || (targetStructure [fixable].indexOf ("dr/")!=-1))
								if (targetStructure [fixable].indexOf ("ar/")!=-1)
								{
									targetStructure [fixable]=pointer.getDownloadableResource (targetStructure [fixable],aPath);
								
									//olidebug ("Patched: " + targetStructure [fixable]);
								}
							}	
						}
					}
				}	
			}
			
			/*
			olidebug ("Patching inline images ...");
			
			var captivateImages = $('#cpDocument').find('img').map(function() 
			{ 
				return this; 
			}).get();

			olidebug ("Images: " + JSON.stringify (captivateImages));
			*/
			
			olidebug ("patchCaptivate () done");
		};
		
		/**
		*
		*/
		this.prepResources=function ()
		{
			olidebug ("prepResources ()");
			
			for (var i=0;i<workbookAssets.length;i++)
			{			
				var testResource=workbookAssets [i];
		
				if ((testResource.type=="basepath") || (testResource.type=="base"))
				{
					olidebug ("Setting base path to: " + testResource.source);
					
					activityBasepath=(testResource.source+'/');
					processed=false;
				}	
			}	
		};		
		
		/**
		*
		*/
		this.sortResources=function ()
		{
			olidebug ("sortResources ()");
			
			var sorted=false;
			
			while (sorted==false)
			{
				sorted=true;
				
				for (var i=0;i<workbookAssets.length;i++)
				{
					var asset=workbookAssets [i];
					
					if (asset.type=="layout")
					{
						if (i!=0)
						{
							olidebug ("Moving html resource ("+asset.source+") to the top of the list ...");
							pointer.moveResource (i,0);
							break;
						}
					}
				}
			}
		};
		
		/**
		*
		*/
		this.loadResources=function ()
		{
			olidebug ("loadResources ()");
			
			$.holdReady(true);
						
			var head = document.getElementsByTagName ("head")[0];
			head.addEventListener ("load", pointer.processResourceLoad, true);
			
			if (loadIndex==0) //Kick off the load process
			{
				pointer.loadNextResource ();
				return;
			}
		};
		
		/**
		*
		*/
		this.processResourceLoad=function (event)
		{
			if (buildCalled==true)
			{
				olidebug ("Activity already bootstrapped, bump");
				return;
			}
			
			if (loadIndex>workbookAssets.length)
			{
				olidebug ("Everything from the oli activity already loaded, this event must be from custom code");
				return;
			}
			
			//olidebug ("Resource loaded ("+event.target.nodeName+"), processing ...");
			
			if ((event.target.nodeName==null) || (event.target.getAttribute ("id")==null))
			{
				olidebug ("Null resource loaded or non OLI API generated => " + event.target.nodeValue);
				
				//pointer.loadNextResource ();
				return;
			}
			else
			{
				if ((event.target.nodeName === "SCRIPT") || (event.target.nodeName === "script"))
				{
					var testURL=event.target.getAttribute("src");
					
					olidebug("Script loaded: " + testURL);
										
					pointer.loadNextResource ();
					
					return;
				}
				
				if ((event.target.nodeName === "LINK") || (event.target.nodeName === "link") || (event.target.nodeName === "STYLE") || (event.target.nodeName === "style"))
				{
					var testURL=event.target.getAttribute("href");
					
					olidebug("CSS loaded: " + testURL);

					pointer.loadNextResource ();
					
					return;					
				}
			}
		};
		
		/**
		*
		*/
		this.scheduleLoading=function (aLink,aURL)
		{
			olidebug ("scheduleLoading ()");
			
			monitorURL=aURL;
			
			document.head.appendChild(aLink);
		};
		
		/**
		*
		*/
		this.bootstrap=function ()
		{
			olidebug ("bootstrap ()");
			
			if (buildCalled==true)
			{
				olidebug ("We're already bootstrapped, bump");
				return;
			}

			olidebug ("All resources loaded, bootstrapping ...");

			$.holdReady (false);
				
			if (buildCalled==false)
			{
				buildCalled=true;
				
				pointer.kickoff ();
			}
			else
			{
				olidebug ("The user defined 'build' has already been called!");
			}
		}
		
		/**
		*
		*/
		this.loadNextResource=function ()
		{
			olidebug ("loadNextResource ()");
			
			if (loadIndex>=workbookAssets.length)
			{
				olidebug ("All resources loaded, starting activity bootstrap ...");

				pointer.bootstrap ();
				
				return;
			}
			
			var loadableResource=workbookAssets [loadIndex];
			loadIndex++;
			
			var fullResource=pointer.getDownloadableResource (loadableResource.source);
			
			olidebug ("Processing resource: " + fullResource);
			
			var processed=false;
			
			if (loadableResource.type=="style")
			{
				//olidebug ("Appending css resource: " + loadableResource.source);

				var link = document.createElement('link');
				link.id = ('id'+loadIndex);
				link.rel = 'stylesheet';
				link.href = fullResource;
				
				pointer.scheduleLoading (link,fullResource);
				
				processed=true;
			}	
			
			//>------------------------------------------------------------
			
			if (loadableResource.type=="javascript")
			{
				//olidebug ("Appending js resource: " + loadableResource.source);

				if (fullResource.indexOf ("angular")!=-1)
				{
					pointer.makeAngularCompatible ();
				}
				
				var script = document.createElement('script');
				script.id = ('id'+loadIndex);
				script.type= 'text/javascript';
				script.src = fullResource;
				//script.charset="utf-8";
				
				pointer.scheduleLoading (script,fullResource);
				
				processed=true;				
			}	
			
			//>------------------------------------------------------------			

			if (loadableResource.type=="layout")
			{
				//olidebug ("Appending html resource: " + loadableResource.source);
				
				$.get(fullResource, function (layout) 
				{
					var resolvedLayout=pointer.resolveResources (layout,activityBasepath);
					
					$('#oli-embed').append(resolvedLayout);
					$('.type1').hide();
					
					//pointer.loadNextResource ();
				});
				
				//processed=true;				
			}
					
			//>------------------------------------------------------------			
			
			if (processed==false)
			{
				olidebug ("Unknown resource type found or html, loading next ...");
				pointer.loadNextResource ();
			}
		}	
    }

    APIActivity = new OLIAPI();
	
    return APIActivity;
});

olidebug ("OLIAPI parsed");;
/**
*
*/
function logActivityStart (aQuestion)
{
	console.log ("logActivityStart ()");
	
	var action = new ActionLog(CommonLogActionNames.START_STEP, 
							   APIActivity.getSuperClient ().sessionId,
							   APIActivity.getSuperClient ().resourceId,
							   APIActivity.getSuperClient ().activityGuid,
							   "CTAT_SESSIONSTART",
							   APIActivity.getSuperClient ().timeZone);
	var supplement = new SupplementLog();
	supplement.setAction(CommonLogActionNames.START_STEP_TRACK);
	supplement.setSource(aQuestion);
	supplement.setInfoType("CTAT_SESSIONSTART");
	//supplement.setInfo (JSON.stringify (evt));
	
	action.addSupplement(supplement);
	
	APIActivity.getSuperClient ().logAction(action);	
}

/**
*
*/
function logCorrect (sai,msg)
{
	console.log ("logCorrect ()");
	
	var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
							   APIActivity.getSuperClient ().sessionId,
							   APIActivity.getSuperClient ().resourceId,
							   APIActivity.getSuperClient ().activityGuid,
							   "CTAT_TUTORCORRECT",
							   APIActivity.getSuperClient ().timeZone);

	var supplement = new SupplementLog();
	supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
	supplement.setSource(sai.getSelection ());
	supplement.setInfoType("CTATTutor");
	//supplement.setInfo (JSON.stringify (msg));
		
	action.addSupplement(supplement);
		
	APIActivity.getSuperClient ().logAction(action);	
}

/**
*
*/
function logIncorrect (sai,msg)
{
	console.log ("logIncorrect ()");
	
	var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
							   APIActivity.getSuperClient ().sessionId,
							   APIActivity.getSuperClient ().resourceId,
							   APIActivity.getSuperClient ().activityGuid,
							   "CTAT_TUTORINCORRECT",
							   APIActivity.getSuperClient ().timeZone);

	var supplement = new SupplementLog();
	supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
	supplement.setSource(sai.getSelection ());
	supplement.setInfoType("CTATTutor");
	//supplement.setInfo (JSON.stringify (evt));
		
	action.addSupplement(supplement);
		
	APIActivity.getSuperClient ().logAction(action);	
}

/**
*
*/
function processCommShellEvent (evt, msg)
{
	console.log ("processCommShellEvent ()");
	
	if("AssociatedRules" != evt || !msg)
	{
		return;
	}
		
	var indicator = msg.getIndicator();
	var sai = msg.getSAI();                               // selection-action-input from tutor engine
	var selection = (sai ? sai.getSelection() : "_noSuchComponent_");
	var comps = CTATShellTools.findComponent(selection);  // array of components with this name
	var component = (comps && comps.length ? comps[0] : null);
	
	console.log ("Indicator: " + indicator);			
	
	if (indicator.toLowerCase()=="hint")
	{
		console.log ("Logging hint for sai: "+sai.toString());
		//logIncorrect (sai,msg);		
	}
	
	if(component && "incorrect" == indicator.toLowerCase())
	{
		console.log ("Tutor's answer is "+sai.toString());
		logIncorrect (sai,msg);
	}
	
	if(component && "correct" == indicator.toLowerCase())
	{
		console.log ("Tutor's answer is "+sai.toString());
		logCorrect (sai,msg);
	}			
}

/**
*
*/
function enableCTATDashboardFunctionality (brdName)
{
	console.log ("enableCTATDashboardFunctionality ()");
	
	var assocRulesListener =
	{
		processCommShellEvent: function(evt, msg)
		{
			console.log ("processCommShellEvent ()");
			
			if("AssociatedRules" != evt || !msg)
			{
				return;
			}
				
			var indicator = msg.getIndicator();
			var sai = msg.getSAI();                               // selection-action-input from tutor engine
			var selection = (sai ? sai.getSelection() : "_noSuchComponent_");
			var comps = CTATShellTools.findComponent(selection);  // array of components with this name
			var component = (comps && comps.length ? comps[0] : null);
			
			console.log ("Indicator: " + indicator);			
			
			if(component && "incorrect" == indicator.toLowerCase())
			{
				console.log ("Tutor's answer is "+sai.toString());
				logIncorrect (sai,msg);
			}
			
			if(component && "correct" == indicator.toLowerCase())
			{
				console.log ("Tutor's answer is "+sai.toString());
				logCorrect (sai,msg);
			}			
		}
    }		
	
	CTATCommShell.commShell.addGlobalEventListener(assocRulesListener);
	
	logActivityStart (brdName);
}
;
/**
*
*/
function logOLIActivityStart (anActivityID,aQuestion)
{
	console.log ("logOLIActivityStart ()");
	
	var action = new ActionLog(CommonLogActionNames.START_STEP, 
							   APIActivity.getSuperClient ().sessionId,
							   APIActivity.getSuperClient ().resourceId,
							   APIActivity.getSuperClient ().activityGuid,
							   "OLI_SESSIONSTART",
							   APIActivity.getSuperClient ().timeZone);
	var supplement = new SupplementLog();
	supplement.setAction(CommonLogActionNames.START_STEP_TRACK);
	supplement.setSource(aQuestion);
	supplement.setInfoType(anActivityID);
	//supplement.setInfo (JSON.stringify (evt));
	
	action.addSupplement(supplement);
	
	APIActivity.getSuperClient ().logAction(action);	
}

/**
*
*/
function logOLICorrect (anActivityID,sai,msg)
{
	console.log ("logOLICorrect ()");
	
	var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
							   APIActivity.getSuperClient ().sessionId,
							   APIActivity.getSuperClient ().resourceId,
							   APIActivity.getSuperClient ().activityGuid,
							   "OLI_ACTIVITYCORRECT",
							   APIActivity.getSuperClient ().timeZone);

	var supplement = new SupplementLog();
	supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
	supplement.setSource(sai.getSelection ());
	supplement.setInfoType(anActivityID);
	//supplement.setInfo (JSON.stringify (msg));
		
	action.addSupplement(supplement);
		
	APIActivity.getSuperClient ().logAction(action);	
}

/**
*
*/
function logOLIIncorrect (anActivityID,sai,msg)
{
	console.log ("logOLIIncorrect ()");
	
	var action = new ActionLog(CommonLogActionNames.EVALUATE_QUESTION, 
							   APIActivity.getSuperClient ().sessionId,
							   APIActivity.getSuperClient ().resourceId,
							   APIActivity.getSuperClient ().activityGuid,
							   "OLI_ACTIVITYINCORRECT",
							   APIActivity.getSuperClient ().timeZone);

	var supplement = new SupplementLog();
	supplement.setAction(CommonLogActionNames.EVALUATE_QUESTION);
	supplement.setSource(sai.getSelection ());
	supplement.setInfoType(anActivityID);
	//supplement.setInfo (JSON.stringify (evt));
		
	action.addSupplement(supplement);
		
	APIActivity.getSuperClient ().logAction(action);	
}

/**
*
*/
function logOLIHint (content, questionId, partId)
{
	console.log ("logOLIHint ()");
	
	var action = new ActionLog(CommonLogActionNames.VIEW_HINT, 
							   APIActivity.getSuperClient ().sessionId,
							   APIActivity.getSuperClient ().resourceId,
							   APIActivity.getSuperClient ().activityGuid,
							   "OLI_EMBEDDEDACTIVITY",
							   APIActivity.getSuperClient ().timeZone);

	var supplement = new SupplementLog();
	supplement.setAction(CommonLogActionNames.VIEW_HINT);
	supplement.setSource(sai.getSelection ());
	supplement.setInfoType(partId);
	supplement.setInfo ("<![CDATA[" + content + "]]>");
		
	action.addSupplement(supplement);
	
    // Important: allows dashboard tracking
	supplement = new SupplementLog();
    supplement.setAction(CommonLogActionNames.VIEW_HINT_TRACK);
    supplement.setSource(questionId);
    supplement.setInfoType(partId);
    supplement.setInfo("<![CDATA[" + content + "]]>");
    action.addSupplement(supplement);
	
	APIActivity.getSuperClient ().logAction(action);	    
		
	/*	
	APIActivity.getSuperClient ().logAction(action);	
	
            var action = new ActionLog(CommonLogActionNames.VIEW_HINT, superClient.sessionId, superClient.resourceId, superClient.activityGuid, "DND_ACTIVITY", superClient.timeZone);
            var supplement = new SupplementLog();
            supplement.setAction(CommonLogActionNames.VIEW_HINT);
            supplement.setInfoType(partId);
            supplement.setInfo("<![CDATA[" + content + "]]>");
            action.addSupplement(supplement);
			
            var supplement = new SupplementLog();

            // Important: allows dashboard tracking
            supplement.setAction(CommonLogActionNames.VIEW_HINT_TRACK);
            supplement.setSource(questionId);
            supplement.setInfoType(partId);
            supplement.setInfo("<![CDATA[" + content + "]]>");
            action.addSupplement(supplement);
            superClient.logAction(action);	
	*/		
}
