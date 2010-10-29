$(document).ready(function(){
  
  // should have used the storage event api but heck it does not seem to work
  var storedQueryDiv = $("#saved_requests ul");
  for(var i =0; i< localStorage.length; i++){
    var key = localStorage.key(i);
    console.log(key);

    if(key.indexOf(".url")!=-1) {
      var url = localStorage[key];
      console.log(key.substring(0, key.indexOf(".url")));
      $("<li><a href='"+key.substring(0, key.indexOf(".url"))+"'>"+url+ "</a></li>").click(function(){
        
        var key_id = $(this).find("a").attr("href");
        console.log(key_id+".html");
        console.log(localStorage.getItem(key_id+".html"));
        $("#api_request_form").html(localStorage.getItem(key_id+".html"));
        return false;
      }).appendTo(storedQueryDiv);
    }  
  }

  $("#api_request").focus(function(){
    if($(this).val().substring(0,1) !='/'){
      $(this).val("/"+$(this).val());
    }
  });
  $("#add_params").click(function(){
    $("#params_container .params:first").clone().appendTo("#params_container");
    return false;
  });
  $("#api_request_form").submit(function(){
    $(".status").removeClass("invisible").addClass("loading");
    var requestType = $("#request_type option:selected").val();
    var dataType = $("#response_data_type option:selected").val();
    var queryParams ={};
    $(".saved_requests").trigger("refresh");
    $(".params").each(function(index, elem){
      var key = $(elem).find(".query_param").val();
      if(typeof key !== 'undefined' && key && key !="") {
        queryParams[key] =  $(elem).find(".query_param_value").val()
      }
    });
    var requestUrl = $("#base_url").val()+ $("#api_request").val();
    var key = Math.round(Math.random()* 10000000);
    localStorage[key +".url" ] =  requestUrl;
    localStorage[key +".html"] =   $("#api_request_form").html();
    
    var startTime = new Date();
    $(".status,#response_area").removeClass("error");
    $.ajax(
      { type: requestType, 
        dataType: dataType,
        url: requestUrl, 
        data: queryParams,
        error: function(request, textStatus, errorCode){
          $(".status").text(textStatus + "(Error code = "+ request.status+" )" + "(Status = "+ request.statusText+ " )").removeClass("invisible loading").addClass("error");
          $("#response_area").val(request.responseText).addClass("error");
        },
        success: function(data, textStatus, request ){
          $("#response_area").val(request.responseText);
          $(".status").removeClass("loading invisible");
        },
        complete: function(){
          var timeTaken = (new Date() - startTime) / 1000;
          $(".time_taken").text("Time taken (in seconds) "+ timeTaken);
        }
      });
      return false;
	});
});





















