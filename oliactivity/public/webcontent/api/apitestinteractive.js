/** 
 *
 */

var internalJSONObject= null;

useDebugging=true;
 
/**
*
*/
function test1Submit ()
{
	olidebug ("test1Submit ()");
	
	$('#element').text ("");
	
	var keytoretrieve=$('#test1key').val();
	
	APIActivity.getValue (keytoretrieve,
						  function (data)
						  {
							olidebug ("Request succeeded");
							
							console.log ("Data: " + data);
							
							$('#element').text (data);
						  },
						  function (result)
						  {
							olidebug ("Request failed");
							
							$('#element').text ("Request failed");
						  });
}

/**
*
*/
function test2Submit ()
{
	olidebug ("test2Submit ()");
	
	$('#element').text ("");
	
	var keytostore=$('#test2key').val();
	var valuetostore=$('#test2value').val();
	
	APIActivity.setValue (keytostore,
						  valuetostore,
						  function (data)
						  {
							olidebug ("Request succeeded");
							
							$('#element').text ("Request succeeded");
						  },
						  function (result)
						  {
 							olidebug ("Request failed");
							
							$('#element').text ("Request failed");
						  });
}

/**
*
*/
function test3Submit ()
{
	olidebug ("test3Submit ()");
	
	$('#element').text ("");
	
	var keytodelete=$('#test3key').val();
	
	APIActivity.deleteValue (keytodelete,
							 function (data)
							 {
								olidebug ("Request succeeded");
								
								$('#element').text ("Request succeeded");
							 },
							 function (result)
							 {
								olidebug ("Request failed");
								
								$('#element').text ("Request failed");
							 });
}
 
/**
*
*/
function build ()
{			
	olidebug ("build ()");
	
	var superClient=APIActivity.getSuperActivityObject ();
		
	// Display raw data available to the client ...
	
	internalJSONObject=APIActivity.getSuperClient ();
	var jsonString=JSON.stringify (internalJSONObject);
	
	olidebug ("Propagating JSON: " + jsonString);
	
	$('#element').jsonView(jsonString);
}
