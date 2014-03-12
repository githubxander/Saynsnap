//app.initialize();



var hostname = 'http://saynsnap.com/';
var domainApi = 'http://saynsnap.com/mobileapi/api/';
var domainSite = 'http://saynsnap.com/application/';
var domainMobile = 'http://saynsnap.com/mobile/';



function init()
{
	document.addEventListener("deviceready", deviceReady, true);
	delete init;
}

function checkConnection() {
    
    if(!navigator.onLine){
        alert('Internet connection problem.');
        window.location = 'index.html';
        
        
    }
    return false;
}

function loadMenu()
{
	$('.toggle-menu').click(function(){
		if ($('.menu-nav').hasClass('hide')) {
			$('.menu-nav').removeClass('hide');
			$('.menu-nav').addClass('show');
		} else if ($('.menu-nav').hasClass('show')) {
			$('.menu-nav').removeClass('show');	
			$('.menu-nav').addClass('hide');
		}
		return false;
	});	

	$('.toggle-settings').click(function(){
		if ($('.settings-nav').hasClass('hide')) {
			$('.settings-nav').removeClass('hide');
			$('.settings-nav').addClass('show');
		} else if ($('.settings-nav').hasClass('show')) {
			$('.settings-nav').removeClass('show');	
			$('.settings-nav').addClass('hide');
		}
		return false;				
	});
	
	$('.logout').click(function(){
                   
		localStorage.clear();
		var url = 'index.html';

		window.location = url;
		return false;
	});
}

	
function checkPreAuth() {
//	console.log("checkPreAuth");
//    var form = $("#loginForm");
//    if(window.localStorage["email"] != undefined && window.localStorage["password"] != undefined) {
//        $("#email", form).val(window.localStorage["email"]);
//        $("#password", form).val(window.localStorage["password"]);
//        handleLogin();
//    }
}


function handleLogin() {
    
    
    var form = $("#loginForm");  
    //disable the button so we can't resubmit while we wait
    $("#submit", form).attr("disabled","disabled");
    
	var e = $("#username", form).val();
	var p = $("#password", form).val();
    
    if(e != '' && p!= '') {
        $("#submit",form).attr("disabled","disabled");
		$.post (domainApi + 'login', {
			username	: e,
			password	: p,
		}, function(data){
                
                
		  
			if (data.status == 'success') {
                window.localStorage["username"] 	= e;
                window.localStorage["password"] = p;
                window.localStorage["user_id"] 	= data.user_id;
				
				if (window.localStorage["last_visit"] == '' || typeof window.localStorage['last_visit'] === "undefined") {
					var path = 'home.html';
				} else {
					var path = window.localStorage["last_visit"];
				}

				var home = domainMobile + path;
				
				setTimeout(function() {
					if (path == 'home.html') {
						alert('Login Successful... Redirecting...');
					}                           
                    
					$.mobile.changePage(path, {
						transition	: "slide",
					});
				}, 2000);

			} else {
				alert('Login Failed: Incorrect username or password');
                $("#submit").removeAttr("disabled");
                navigator.notification.alert("Your login failed", function() {});
                
            }
            
            
		});
        
    } else {
		alert('Login Failed: You must enter a username and password');
        $("#submit").removeAttr("disabled");
    }
	
}




function deviceReady() 
{
	console.log("deviceReady");
	//checkPreAuth();
	/*
	$("#login-page").on("pageinit",function() {
		console.log("pageinit run");
		$("#loginForm").on("submit",handleLogin);
		checkPreAuth();
	});
	*/
}


$(document).bind( "mobileinit", function() {
	// Make your jQuery Mobile framework configuration changes here!
	$.mobile.allowCrossDomainPages = true;
});

$(document).on('pageinit','#login-page', function(){
               
               
               
               
	$('#submit').click(function(){
                       
        checkConnection();
	    
		handleLogin();
        
		return false;
	});
	checkPreAuth();

});	

//Init Homepage

function getHomeDetails() {
    
	$.getJSON (domainApi + 'process?callback=?', {
	    request 		: 'getUserInfo',
		user_id 		: window.localStorage["user_id"],
	}, function(data){
		if (data.status == 'success') {
			$('#name').html(data.firstname +' '+ data.middlename +' '+ data.lastname);
			$('#address').html(data.address);
			$('#aboutme').html(data.about_me);
            $('#picture').attr('src', hostname + 'public/upload/pic/'+ data.user_id +'/' + data.picture_name);
		}
	});
    
}

$(document).on('pageinit','#home-page', function(){
    checkConnection();
	getHomeDetails();
});



$(document).on('pageinit','#forgot-password-page', function(){
               
    checkConnection();
               
    $('#forgot-submit').click(function(){
            var form = $("#forgotPasswordForm");
                                         
            var e = $("#forgot-email", form).val();
                                         
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e))) {
                alert("You have entered an invalid email address!");
                return (false);
            }
                                         
            if(e != '') {
                $("#submit",form).attr("disabled","disabled");
                $.post (domainApi + 'forgotpass', {
                email	: e,
                }, function(data){
                                                 
                        if (data.status == 'success') {
                            window.localStorage["username"] 	= e;
                            } else {
                                alert('Forgot Password Failed: Incorrect email address');
                                $("#submit").removeAttr("disabled");
                        }
                                                 
                });
                                         
            } else {
                alert('Forgot Password Failed: You must enter a email address');
                $("#submit").removeAttr("disabled");
            }
                                         
                                    return false;
       });
});


$(document).on('pageinit','#collection-page', function(){
    checkConnection();
    
    
	$('#submitPost').click(function(){
	   
	    $('form').submit(false);
        var form = $("#formCollection");  
        var post = $("#inputPost").val();
        var hashtags = $("#inputHashtags").val();
        var tagsomeone = $("#inputTagsomeone").val();
        var author = $("#inputAuthor").val();
      
        if(post == ""){
            alert("Please enter your Post in the form");
            return false;                 
        }
        
        if(hashtags == ""){
            alert("Please enter your Hash Tags in the form");
            return false;                 
        }
        
        if(tagsomeone == ""){
            alert("Please enter your Tag Someone in the form");
            return false;                 
        }
        
        
        $("#submitPost",form).attr("disabled","disabled");
        
             
        $.getJSON (domainSite + 'collection-api?callback=?', {
        	user_id 	: window.localStorage["user_id"],
        	content 	: post,
            hashtag 	: hashtags,
            tagfriend 	: tagsomeone,
            author 		: author,
        }, function(data){
            
            if(data['status'] == 'success'){
                
                alert("Form has been submitted.");
                
                document.getElementById('formCollection').reset();
                
                $('#image-holder').prepend('<span style="margin:10px 10px;"><img  class="img-thumbnail" alt="140x140" src="'+hostname+'public/upload/posts/'+window.localStorage["user_id"]+'/'+data.imageName+'" style="width: 282px;" ></span>')
                
                $("#submitPost").removeAttr("disabled");
                
            }else{
                
                alert("Form has been failed submitted.");
                $("#submitPost").removeAttr("disabled");   
                
            }
            
        })     
    });
    
    $.getJSON (domainApi + 'process?callback=?', {
	    request 		: 'getCollection',
		user_id 		: window.localStorage["user_id"],
	}, function(data){
	   
       for(x in data){
        $('#image-holder').append('<span style="margin:10px 10px;"><img  class="img-thumbnail" alt="140x140" src="'+hostname+'public/upload/posts/'+window.localStorage["user_id"]+'/'+data[x].imageName+'" style="width: 282px;" ></span>')
       }
		
	});
    
});



$(document).on('pageinit','[data-role=page]', function(){
	loadMenu();
});