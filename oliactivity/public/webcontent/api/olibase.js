var useOLIDebugging=true;
var logIndex=1;

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
	if (useOLIDebugging==true)
	{		
		console.log (OLIFormatLogMessage ("global","window",aMessage));
	}	
} 