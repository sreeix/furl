function bindFormElements(){
  $("#api_request").focus(function(){
    if($(this).val().substring(0,1) !='/'){
      $(this).val("/"+$(this).val());
    }
  });
  $("#add_params").click(function(){
    $("#params_container .params:first").clone().appendTo("#params_container");
    return false;
  });
}


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
        console.log(localStorage[key_id+".html"]);
        $("#api_request_form").html(localStorage[key_id+".html"]);
        
        $("#base_url").val(localStorage[key_id+".base_url"]);
        $("#api_request").val(localStorage[key_id+".api_request"]);
        $("#request_type").val(localStorage[key_id+".request_method"]);
        $("#response_data_type").val(localStorage[key_id+".data_type"]);
        $(".params").each(function(index, elem){
          $(elem).find(".query_param").val(localStorage[key_id+"."+index+".key"]);
          $(elem).find(".query_param_value").val(localStorage[key_id+"."+index+".value"]);
        });
        bindFormElements()
        return false;
      }).appendTo(storedQueryDiv);
    }  
  }
  bindFormElements();
  $("#api_request_form").submit(function(){
    var random_key = Math.round(Math.random()* 10000000);
    var requestType = $("#request_type option:selected").val();
    var dataType = $("#response_data_type option:selected").val();
    var queryParams ={};
    var requestUrl = $("#base_url").val()+ $("#api_request").val();

    $(".status").removeClass("invisible").addClass("loading");
    
    $(".saved_requests").trigger("refresh");
    $(".params").each(function(index, elem){
      var key = $(elem).find(".query_param").val();
      var value = $(elem).find(".query_param_value").val();
      if(typeof key !== 'undefined' && key && key !=="") {
        queryParams[key] =  value;
      }
      localStorage[random_key +"."+index+".key" ] =  key;
      localStorage[random_key +"."+index+".value" ] =  value;
      console.log(random_key +"."+index+".key", key, value);
    });

    localStorage[random_key +".url" ] =  requestUrl;
    localStorage[random_key +".base_url" ] =  $("#base_url").val();
    localStorage[random_key +".api_request" ] =  $("#api_request").val();
    localStorage[random_key +".request_method" ] =  requestType;
    localStorage[random_key +".data_type" ] =  dataType;
    
    localStorage[random_key +".url" ] =  requestUrl;
    localStorage[random_key +".html"] =   $("#api_request_form").html();
    
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





















