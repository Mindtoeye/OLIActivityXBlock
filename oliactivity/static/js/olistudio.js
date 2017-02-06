/**
 *
 */
function OLIXBlockStudio(runtime, element)
{
    $(element).find('.save-button').bind('click', function() 
	{
		var handlerUrl = runtime.handlerUrl(element, 'studio_submit');
		var data = 
		{
			activityxml: $(element).find('input#activityxml').val(),
			workbookpage: $(element).find('input#workbookpage').val(),
			width: $(element).find('input#maxwidth').val(),
			height: $(element).find('input#maxheight').val(),
			logging: $(element).find('input#logging').is(':checked'),
		};
		
		if (data.actvity.trim().length <= 0) 
		{
			alert('The embedded activity xml location can not be empty.');
			return;
		}
		
		if (data.workbookpage.trim().length <=0) 
		{
			alert('The workbook page xml location can not be empty.');
			return;
		}
		
		var w = Number(data.width);
		
		if (isNaN(w) || w<100) 
		{
			alert('Width should be at least 100.');
			return;
		}
		
		var h = Number(data.height);
		
		if (isNaN(h) || h<100) 
		{
			alert('Height should be at least 100.');
			return;
		}
		
		if (runtime.notify)
		{
			runtime.notify('save', {state: 'start'});
		}	
		
		$.post(handlerUrl, JSON.stringify(data)).done(function(response) 
		{
			if (response['result'] != 'success') 
			{
				console.log(response);
				
				if (response['error']) 
				{
					alert(response['error']);
				}
				else 
				{
					alert('Save failed!');
				}
			}
		}).fail(function() 
		{
			alert("Error in posting configuration parameters!");
		}).always(function() 
		{
			if (runtime.notify)
			{
				runtime.notify('save', {state: 'end'});
			}	
		});
    });

    $(element).find('.cancel-button').bind('click', function() 
	{
		runtime.notify('cancel', {});
    });
}
