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
    console.log(requestType);
    console.log(dataType);
    var requestUrl = $("#base_url").val()+ $("#api_request").val();
    console.log(requestUrl);
    $.ajax(
      { type: requestType, 
        dataType: dataType,
        url: requestUrl, 
        error: function(request, textStatus, errorCode){
          console.log(request);
          console.log(textStatus);
          $(".status").html(textStatus + "(Error code = "+ request.status+" )" + "(Status = "+ request.statusText+ " )").removeClass("invisible loading");
        },
        success: function(data, textStatus, request ){
          $("#response_area").text(data);
          $(".status").addClass("invisible").removeClass("loading");
          
        }
      });
      return false;
	});
});





















