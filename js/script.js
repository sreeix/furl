$(document).ready(function(){
  $("#api_request").focus(function(){
    if($(this).val().substring(0,1) !='/'){
      console.log("/"+$(this).val());
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
    $(".params").each(function(index, elem){
      var key = $(elem).find(".query_param").val();
      if(typeof key !== 'undefined' && key && key !="") {
        queryParams[key] =  $(elem).find(".query_param_value").val()
      }
    });
    console.log(queryParams);
    console.log(requestType);
    console.log(dataType);
    var requestUrl = $("#base_url").val()+ $("#api_request").val();
    console.log(requestUrl);
    var startTime = new Date();
    $(".status,#response_area").removeClass("error");
    $.ajax(
      { type: requestType, 
        dataType: dataType,
        url: requestUrl, 
        data: queryParams,
        error: function(request, textStatus, errorCode){
          console.log(request);
          console.log(textStatus);
          $(".status").text(textStatus + "(Error code = "+ request.status+" )" + "(Status = "+ request.statusText+ " )").removeClass("invisible loading").addClass("error");
          $("#response_area").val(request.responseText).addClass("error");
        },
        success: function(data, textStatus, request ){
          $("#response_area").val(request.responseText);
          console.log(data);
          console.log(request);
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





















