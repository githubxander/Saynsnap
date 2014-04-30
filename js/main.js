//app.initialize();

var hostname 		= 'http://saynsnap.com/';
var domainApi 		= 'http://saynsnap.com/mobile-apps/';
var domainMobile 	= 'http://saynsnap.com/mobile/';

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
	console.log("checkPreAuth");
	var form = $("#frmLogin");
	
	if(window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        handleLogin();
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


function handleLogin() {
    
    var form = $("#frmLogin");
    
    //disable the button so we can't resubmit while we wait
    $("#submitLogin", form).attr("disabled","disabled");
    
	var e = $("#username", form).val();
	var p = $("#password", form).val();
    
    if(e != '' && p!= '') {
        $("#submitLogin",form).attr("disabled","disabled");
        
		$.getJSON (domainApi + 'login-api?callback=?', {
			username	: e,
			password	: p,
		}, function(data){
		  
			if (data.status == 'success') {
                
                window.localStorage["username"] 	= e;
                window.localStorage["password"]     = p;
                window.localStorage["user_id"] 	    = data.userId;
				
				if (window.localStorage["last_visit"] == '' || typeof window.localStorage['last_visit'] === "undefined") {
					var path = 'home.html';
				} else {
					var path = window.localStorage["last_visit"];
				}

				var home = domainMobile + path;
				
				setTimeout(function() {                           
                    path == 'home.html'
					$.mobile.changePage(path, {
						transition	: "slide",
					});
				}, 2000);

			} else {
			 
				alert('Login Failed: Incorrect username or password');
                document.getElementById('frmLogin').reset();
                $("#submitLogin").removeAttr("disabled");
                //navigator.notification.alert("Your login failed", function() {});
            }
		});
        
    } else {
        $("#submitLogin").removeAttr("disabled");
    }
}



//Fetch User Info
function getUserInfoDetails(id) {
    
    
	$.getJSON (domainApi + 'get-user-info?callback=?', {
		user_id 		: id,
	}, function(data){
       
		if (data.status == 'success') {
			$('#name').html(data.firstname +' '+ data.middlename +' '+ data.lastname);
			$('#address').html(data.address);
			$('#status').html(data.aboutMe);
            $('#profile-pic').attr('src', hostname + 'public/upload/pic/'+ data.userId +'/' + data.pictureName);
		}
	});
}


//Fetch User Post
function getUserPostDetails() {
    
	$.getJSON (domainApi + 'get-user-post?callback=?', {
		user_id 		: window.localStorage["user_id"],
	}, function(data){
		
        for(x in data.posts){  
            
            var postId;
            if(data.posts[x].repost == 'yes'){
                postId = data.posts[x].imageName;
            }else{
                postId = data.posts[x].userId+'/'+data.posts[x].postId;
            }
            
            html    ="<div class='post-hldr'>"
					+"<div class='bs-example bs-example-images image-holder'>"
                    +"<div id='div1'><img id='img2' src='"+hostname+"public/upload/posts/"+postId+"/600.jpg' style='width:100%;' /></div>"
					+"</div>"
					+"<div class='post-user-hldr'>"
					+"<div class='user-prof-img'>"
					+"<img id='img3'  width='53px' height='53px' src='"+hostname+"public/upload/pic/"+data.posts[x].userId+"/"+data.posts[x].pictureName+"' >"
					+"</div>"	
					+"<p class='user-prof-info'>"
                    +"<a class='user-name' data-role='none'>"+data.posts[x].username+"</a>"
                    +"<br/>"
					+"<span class='post-date'>4 Days Ago</span></p>"
					+"<div class='flip-icon'>"
					+"<a href='social.html' data-rel='dialog' data-transition='flip'><span class='icon'></span></a>"
		            +"</div><div class='clearfix'></div></div></div>";
            
            
            if(data.posts[x].repost != 'yes'){
                $('#profile-image-container').append(html);    
            }
            
        }
        
	});
}


//Fetch Collection Post
function getCollectionDetails(id) {
    
	$.getJSON (domainApi + 'get-post?callback=?', {
		user_id 		: id,
        request 		: 'collection',
	}, function(data){
		if (data.status == 1) {
		  
            var html = '';
            
            for(x in data.collection){
                
                if(data.collection[x].repost == ''){
                    
                    html    +='<div class="item">'
                            +'<div class="top">'
                            +'<a href="profile.html?id='+data.collection[x].userId+'">'
                            +'<div class="pic" style="background-image:url('+hostname+'public/upload/pic/'+data.collection[x].userId+'/'+data.collection[x].pictureName+');"></div>'
                            +'<div class="name" align="left">'
                            +'@'+data.collection[x].username
                            +'</div>'
                            +'</div>'
                            +'</a>'
                            +'<div class="post">'
                            +'<img src="'+hostname+'public/upload/posts/'+data.collection[x].userId+'/'+data.collection[x].postId+'/600.jpg" alt="post">'
                            +'</div>'
                            +'<div class="post-info">'
                            +'<ul>'
                            +'<li><a class="heart-count" >'+data.collection[x].likeCount+'</a></li>'
                            +'<li><a class="instate-count" >'+data.collection[x].repostCount+'</a></li>'
                            +'<li><a class="comment-count" title="Add Comment" >'+data.collection[x].commentCount+'</a></li>'
                            +'<li><a href="social.html" class="flip-icon" data-rel="dialog" data-transition="flip"><span class="icon"></span></a></li>'
                            +'</ul>'
                            +'</div>'
                            +'</div>';
                            
                }
            }
            
            $('#collection-tab').html(html);
            
		}else{
		  
            $().message("Collection: No collection.");
            
		}
	});
}


//Fetch Following Post
function getFollowingDetails(id) {
    
	$.getJSON (domainApi + 'get-post?callback=?', {
		user_id 		: id,
        request 		: 'following',
	}, function(data){
		if (data.status == 1) {
            var html = '';
            for(x in data.following){
                
                if(data.following[x].repost == ''){
                    
                    html    +='<div class="item">'
                            +'<div class="top">'
                            +'<a href="profile.html?id='+data.following[x].userId+'">'
                            +'<div class="pic" style="background-image:url('+hostname+'public/upload/pic/'+data.following[x].userId+'/'+data.following[x].pictureName+');"></div>'
                            +'<div class="name" align="left">'
                            +'@'+data.following[x].username
                            +'</div>'
                            +'</div>'
                            +'</a>'
                            +'<div class="post">'
                            +'<img src="'+hostname+'public/upload/posts/'+data.following[x].userId+'/'+data.following[x].postId+'/600.jpg" alt="post">'
                            +'</div>'
                            +'<div class="post-info">'
                            +'<ul>'
                            +'<li><a class="heart-count" >'+data.following[x].likeCount+'</a></li>'
                            +'<li><a class="instate-count" >'+data.following[x].repostCount+'</a></li>'
                            +'<li><a class="comment-count" title="Add Comment" >'+data.following[x].commentCount+'</a></li>'
                            +'<li><a href="social.html" class="flip-icon" data-rel="dialog" data-transition="flip"><span class="icon"></span></a></li>'
                            +'</ul>'
                            +'</div>'
                            +'</div>';
                            
                }
            }
            
            $('#following-tab').html(html);
		}else{
            $().message("Following: No following.");
		}
	});
}


//Fetch Followers Post
function getFollowersDetails(id) {
    
	$.getJSON (domainApi + 'get-post?callback=?', {
		user_id 		: id,
        request 		: 'followers',
	}, function(data){
		if (data.status == 1) {
            var html = '';
            for(x in data.followers){
                
                if(data.followers[x].repost == ''){
                    
                    html    +='<div class="item">'
                            +'<div class="top">'
                            +'<a href="profile.html?id='+data.followers[x].userId+'">'
                            +'<div class="pic" style="background-image:url('+hostname+'public/upload/pic/'+data.followers[x].userId+'/'+data.followers[x].pictureName+');"></div>'
                            +'<div class="name" align="left">'
                            +'@'+data.followers[x].username
                            +'</div>'
                            +'</div>'
                            +'</a>'
                            +'<div class="post">'
                            +'<img src="'+hostname+'public/upload/posts/'+data.followers[x].userId+'/'+data.followers[x].postId+'/600.jpg" alt="post">'
                            +'</div>'
                            +'<div class="post-info">'
                            +'<ul>'
                            +'<li><a class="heart-count" >'+data.followers[x].likeCount+'</a></li>'
                            +'<li><a class="instate-count" >'+data.followers[x].repostCount+'</a></li>'
                            +'<li><a class="comment-count" title="Add Comment" >'+data.followers[x].commentCount+'</a></li>'
                            +'<li><a href="social.html" class="flip-icon" data-rel="dialog" data-transition="flip"><span class="icon"></span></a></li>'
                            +'</ul>'
                            +'</div>'
                            +'</div>';
                            
                }
            }
            
            $('#followers-tab').html(html);
		}else{
            $().message("Followers: No followers.");
		}
	});
}


function time_ago(time){
    time = '5';
    switch (typeof time) {
        case 'number': break;
        case 'string': time = +new Date(time); break;
        case 'object': if (time.constructor === Date) time = time.getTime(); break;
        default: time = +new Date();
    }
    var time_formats = [
        [60, 'seconds', 1], // 60
        [120, '1 minute ago', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
        token = 'ago', list_choice = 1;
    
    if (seconds == 0) {
        return 'Just now'
    }
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        list_choice = 2;
    }
    var i = 0, format;
    while (format = time_formats[i++])
        if (seconds < format[0]) {
            if (typeof format[2] == 'string')
                return format[list_choice];
            else
                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
        }
    return time;
}


//Fetch Tagged Post
function getTaggedDetails(id) {
    
	$.getJSON (domainApi + 'get-post?callback=?', {
		user_id 		: id,
        request 		: 'tagged',
	}, function(data){
		if (data.status == 1) {
            var html = '';
            for(x in data.tagged){
                
                if(data.tagged[x].repost == ''){
                    
                    html    +='<div class="item">'
                            +'<div class="top">'
                            +'<a href="profile.html?id='+data.tagged[x].userId+'">'
                            +'<div class="pic" style="background-image:url('+hostname+'public/upload/pic/'+data.tagged[x].userId+'/'+data.tagged[x].pictureName+');"></div>'
                            +'<div class="name" align="left">'
                            +'@'+data.tagged[x].username
                            +'</div>'
                            +'</div>'
                            +'</a>'
                            +'<div class="post">'
                            +'<img src="'+hostname+'public/upload/posts/'+data.tagged[x].userId+'/'+data.tagged[x].postId+'/600.jpg" alt="post">'
                            +'</div>'
                            +'<div class="post-info">'
                            +'<ul>'
                            +'<li><a class="heart-count" >'+data.tagged[x].likeCount+'</a></li>'
                            +'<li><a class="instate-count" >'+data.tagged[x].repostCount+'</a></li>'
                            +'<li><a class="comment-count" title="Add Comment" >'+data.tagged[x].commentCount+'</a></li>'
                            +'<li><a href="social.html" class="flip-icon" data-rel="dialog" data-transition="flip"><span class="icon"></span></a></li>'
                            +'</ul>'
                            +'</div>'
                            +'</div>';
                            
                }
            }
            
            $('#tagged-tab').html(html);
		}else{
            $().message("Tagged: No tagged.");
		}
	});
}


//Fetch Liked Post
function getLikedDetails(id) {
    
	$.getJSON (domainApi + 'get-post?callback=?', {
		user_id 		: id,
        request 		: 'liked',
	}, function(data){
		if (data.status == 1) {
		  
            var html = '';
            
            for(x in data.liked){
                
                if(data.liked[x].repost == ''){
                    
                     html   +='<div class="item">'
                            +'<div class="top">'
                            +'<a href="profile.html?id='+data.liked[x].ownerId+'">'
                            +'<div class="pic" style="background-image:url('+hostname+'public/upload/pic/'+data.liked[x].ownerId+'/'+data.liked[x].pictureName+');"></div>'
                            +'<div class="name" align="left">'
                            +'@'+data.liked[x].username
                            +'</div>'
                            +'</div>'
                            +'</a>'
                            +'<div class="post">'
                            +'<img src="'+hostname+'public/upload/posts/'+data.liked[x].ownerId+'/'+data.liked[x].postId+'/600.jpg" alt="post">'
                            +'</div>'
                            +'<div class="post-info">'
                            +'<ul>'
                            +'<li><a class="heart-count">'+data.liked[x].likeCount+'</a></li>'
                            +'<li><a class="instate-count" >'+data.liked[x].repostCount+'</a></li>'
                            +'<li><a class="comment-count" title="Add Comment" >'+data.liked[x].commentCount+'</a></li>'
                            +'<li><a href="social.html" class="flip-icon" data-rel="dialog" data-transition="flip"><span class="icon"></span></a></li>'
                            +'</ul>'
                            +'</div>'
                            +'</div>';
                            
                    
                }
            }
            
            $('#liked-tab').html(html);
		}else{
            $().message("Liked: No liked.");
		}
	});
}


//Fetch Count Post
function countPostDetails(id) {
    
	$.getJSON (domainApi + 'get-post?callback=?', {
		user_id 		: id,
        request 		: 'count',
	}, function(data){
            
        var following    = data.countFollowing;
        var followers    = data.countFollowers;
        var tagged    = data.countTagged;
        var liked    = data.countLiked;
            
        $('.following-count').html(following);
        $('.followers-count').html(followers);
        $('.tagged-count').html(tagged);
        $('.liked-count').html(liked);
        
	});
}


//Like and Unlike Post
function like(postId){
    
    var userId = window.localStorage["user_id"];
    
	$.getJSON (domainApi + 'like?callback=?', {
		userId        : userId,
        postId        : postId,
	}, function(data){
            
            if(data['data'] == 1){
                $('.slike a').attr('class', 'active');
                $().message("Like post successful.");
            }else{
                $('.slike a').attr('class', '');
                $().message("UnLike post successful.");
            }
        
	});
    
    return false;
}


//Init Login Page
$(document).on('pageinit','#index-page', function(){
    
    var form = $('#frmLogin');
    
    $(form).validate({
        submitHandler: function( form ) {
            checkConnection();
            handleLogin();
        }
    });
    
	checkPreAuth();
    
});	




//Init Profile Page
$(document).on('pageshow','#profile-page', function(){
    var id = getUrlVars()['id'];
    if (typeof(id) == 'undefined') {
        id = window.localStorage["user_id"];
    }
    
    checkConnection();
	getUserInfoDetails(id);
    getCollectionDetails(id);
    countPostDetails(id);
    
    $('#collection').click(function(){
        getCollectionDetails(id);
        countPostDetails(id);
        $('#collection-tab').addClass('show');
        $('#collection-tab').removeClass('hide');
        $('#followers-tab').removeClass('show');
        $('#tagged-tab').removeClass('show');
        $('#liked-tab').removeClass('show');
        $('#following-tab').removeClass('show');
    });
    
    $('#following').click(function(){
        countPostDetails(id);
        getFollowingDetails(id);
        $('#collection-tab').addClass('hide');
        $('#collection-tab').removeClass('show');
        $('#followers-tab').removeClass('show');
        $('#tagged-tab').removeClass('show');
        $('#liked-tab').removeClass('show');
        $('#following-tab').addClass('show');
    });
    
    $('#followers').click(function(){
        getFollowersDetails(id);
        countPostDetails(id);
        $('#collection-tab').addClass('hide');
        $('#collection-tab').removeClass('show');
        $('#following-tab').removeClass('show');
        $('#tagged-tab').removeClass('show');
        $('#liked-tab').removeClass('show');
        $('#followers-tab').addClass('show');
    });
    
    $('#tagged').click(function(){
        getTaggedDetails(id);
        countPostDetails(id);
        $('#collection-tab').addClass('hide');
        $('#collection-tab').removeClass('show');
        $('#following-tab').removeClass('show');
        $('#tagged-tab').addClass('show');
        $('#liked-tab').removeClass('show');
        $('#followers-tab').removeClass('show');
    });
    
    $('#liked').click(function(){
        getLikedDetails(id);
        countPostDetails(id);
        $('#collection-tab').addClass('hide');
        $('#collection-tab').removeClass('show');
        $('#following-tab').removeClass('show');
        $('#tagged-tab').removeClass('show');
        $('#liked-tab').addClass('show');
        $('#followers-tab').removeClass('show');
    });    
});




//Init Register Page
$(document).on('pageinit','#register-page', function(event){
    checkConnection();
    var form = $('#frmRegister');
    $(form).validate({
        
        submitHandler: function( form ) {
  
            $("#submitRegister",form).attr("disabled","disabled");
            
            var formData = $("form#frmRegister").serialize();
            
            $.getJSON (domainApi + 'signup-api?'+formData+'&callback=?', {
    		}, function(data){
    		        
                    if (data.status == 'success') {
                        $().message("Registration: Successfully Registered. Check your Email for Confirmation.");
                        document.getElementById('frmRegister').reset();
                    }
                    
                    if (data.status == 'failed') {
                        $().message('Registration: '+data.message+'');
                    }  
                     
                    $("#submitRegister").removeAttr("disabled");
    		});
        }
    });
    
});


//Init Forgot Password Page
$(document).on('pageinit','#forgot-password-page', function(){
              
    checkConnection();
    
    var form = $('#frmForgotPass');
    
    $(form).validate({
         
        submitHandler: function( form ) {
        
            //$().message("Form has been submitted. Please check your email!");
            $('#email').val('');
        }
    });
    
});



//Init Add Post Page
$(document).on('pageinit','#add-post-page', function(){
    
    checkConnection();
    
    var form = $('#frmAddPost');
    
    $(form).validate({
        
        submitHandler: function( form ) {
            
            var formData = $("form#frmAddPost").serialize();
            
            $("#submitPost",form).attr("disabled","disabled");
            
            $.getJSON (domainApi + 'collection?'+formData+'&user_id='+window.localStorage["user_id"]+'&callback=?', {
            }, function(data){
                
               if(data['status'] == 'success'){
                    
                    alert("Form has been submitted.");
                    
                    document.getElementById('frmAddPost').reset();
                    
                    $("#submitPost").removeAttr("disabled"); 
                    
                    //$('#image-holder').prepend('<span style="margin:10px 10px;"><img  class="img-thumbnail" alt="140x140" src="'+hostname+'public/upload/posts/'+window.localStorage["user_id"]+'/'+data.imageName+'" style="width: 282px;" ></span>')
                    
                    //$("#submitPost").removeAttr("disabled");
                    
                }else{
                    
                    alert("Form has been failed submitted.");
                    $("#submitPost").removeAttr("disabled");   
                    
                } 
                
            })
        }
        
    });
    
    $("#submitPost").removeAttr("disabled");
});

//Init Collection Page
$(document).on('pageinit','#home-page', function(){
   
    checkConnection();
    var html = "";
    $('#loading').addClass('hide');
    
    $('#loadmore').click(function(){
        $('#loading a').addClass('hide');
        $('#loading span').removeClass('hide');
        
        var p = document.getElementById('loadmore').getAttribute('page-num');
            
        $.getJSON (domainApi + 'home-api?callback=?', {
    	    request 		: 'getCollection',
    		user_id 		: window.localStorage["user_id"],
            page            : p,
    	}, function(data){
           
           for(x in data.posts){
                var postId;
                if(data.posts[x].repost == 'yes'){
                    postId = data.posts[x].imageName;
                }else{
                    postId = data.posts[x].userId+'/'+data.posts[x].postId;
                }
            
                html    ='<div class="item">'
                        +'<div class="top">'
                        +'<a href="profile.html?id='+data.posts[x].userId+'">'
                        +'<div class="pic" style="background-image:url('+hostname+'public/upload/pic/'+data.posts[x].userId+'/'+data.posts[x].pictureName+');"></div>'
                        +'<div class="name" align="left">'
                        +'@'+data.posts[x].username
                        +'</div>'
                        +'</div>'
                        +'</a>'
                        +'<div class="post">'
                        +'<img src="'+hostname+'public/upload/posts/'+postId+'/600.jpg" alt="post">'
                        +'</div>'
                        +'<div class="post-info">'
                        +'<ul>'
                        +'<li><a class="heart-count" >'+data.posts[x].likeCount+'</a></li>'
                        +'<li><a class="instate-count" >'+data.posts[x].repostCount+'</a></li>'
                        +'<li><a href="comment.html?&postId='+data.posts[x].postId+'" class="comment-count"  title="Add Comment" >'+data.posts[x].commentCount+'</a></li>'
                        +'<li><a href="social.html?&postId='+data.posts[x].postId+'" class="flip-icon" data-rel="page" ><span class="icon"></span></a></li>'
                        +'</ul>'
                        +'</div>'
                        +'</div>';
                        
                $('#container').append(html);
                $('#loading a').removeClass('hide');
                $('#loading span').addClass('hide');                
            }
            
            if(data.posts == null){
                $('#loading span').addClass('hide');
                $(this).message("No more item.");
            }
    	});
        
        x=++p;
        $('#loading a').attr('page-num', x);
        return false;   
    });
    
    
    
    $.getJSON (domainApi + 'home-api?callback=?', {
	    request 		: 'getCollection',
		user_id 		: window.localStorage["user_id"],
	}, function(data){
	   
       for(x in data.posts){  
            var postId;
            if(data.posts[x].repost == 'yes'){
                postId = data.posts[x].imageName;
            }else{
                postId = data.posts[x].userId+'/'+data.posts[x].postId;
            }
            
            html    +='<div class="item">'
                    +'<div class="top">'
                    +'<a href="profile.html?id='+data.posts[x].userId+'">'
                    +'<div class="pic" style="background-image:url('+hostname+'public/upload/pic/'+data.posts[x].userId+'/'+data.posts[x].pictureName+');"></div>'
                    +'<div class="name" align="left">'
                    +'@'+data.posts[x].username
                    +'</div>'
                    +'</div>'
                    +'</a>'
                    +'<div class="post">'
                    +'<img src="'+hostname+'public/upload/posts/'+postId+'/600.jpg" alt="post">'
                    +'</div>'
                    +'<div class="post-info">'
                    +'<ul>'
                    +'<li><a class="heart-count" >'+data.posts[x].likeCount+'</a></li>'
                    +'<li><a class="instate-count" >'+data.posts[x].repostCount+'</a></li>'
                    +'<li><a href="comment.html?&postId='+data.posts[x].postId+'" class="comment-count" title="Add Comment" >'+data.posts[x].commentCount+'</a></li>'
                    +'<li><a href="social.html?&postId='+data.posts[x].postId+'" class="flip-icon"  data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span"><span class="icon"></span></a></li>'
                    +'</ul>'
                    +'</div>'
                    +'</div>';
            
            
        }
        
        $('#container').append(html);
        $('#loading').removeClass('hide');
        $('#loading span').addClass('hide');
	});
    
});


//Init Collection Page
$(document).on('pageinit','#search-page', function(){

    checkConnection();
    
    var form = $("#frmSearch");     
    $('#search-basic').keyup(function(e) {
        var text = $(this).val();
        
        if(text.length <= 2){
            $('#container').html('');
        }
        
        if(text.length >= 3){
           
            $.getJSON (domainApi + 'search-api?callback=?', {
        		user_id 		: window.localStorage["user_id"],
                search          : $("#search-basic", form).val(),
        	}, function(data){
                var html = '';
                for(x in data.posts){
                  
                    var postId;
                    if(data.posts[x].repost == 'yes'){
                        postId = data.posts[x].imageName;
                    }else{
                        postId = data.posts[x].userId+'/'+data.posts[x].postId;
                    }
                
                    html    +='<div class="item">'
                            +'<div class="top">'
                            +'<a href="profile.html?id='+data.posts[x].userId+'">'
                            +'<div class="pic" style="background-image:url('+hostname+'public/upload/pic/'+data.posts[x].userId+'/'+data.posts[x].pictureName+');"></div>'
                            +'<div class="name" align="left">'
                            +'@'+data.posts[x].username
                            +'</div>'
                            +'</div>'
                            +'</a>'
                            +'<div class="post">'
                            +'<img src="'+hostname+'public/upload/posts/'+postId+'/600.jpg" alt="post">'
                            +'</div>'
                            +'<div class="post-info">'
                            +'<ul>'
                            +'<li><a class="heart-count" >'+data.posts[x].likeCount+'</a></li>'
                            +'<li><a class="instate-count" >'+data.posts[x].repostCount+'</a></li>'
                            +'<li><a class="comment-count" title="Add Comment" >'+data.posts[x].commentCount+'</a></li>'
                            +'<li><a href="social.html" class="flip-icon" data-rel="dialog" data-transition="flip"><span class="icon"></span></a></li>'
                            +'</ul>'
                            +'</div>'
                            +'</div>';
                }
                
                if(data.posts == null){
                    $().message("No search found.");
                }
                
                $('#container-search').html(html);
                
            });
        }
	});
});


//Init Collection Page
$(document).on('pageinit','#comment-page', function(){
    
    var link = $(this).attr('data-url');
    var postId = getUrlVars(link)['postId'];
    
    
    $.getJSON (domainApi + 'comment-api?callback=?', {
    		user_id 	: window.localStorage["user_id"],
            postId      : postId,
    }, function(data){
        
        $('.username-holder').html('@'+data.user.username);
        $('.profile-holder').html('<div class="pic" style="background-image: url(http://saynsnap.com/public/upload/pic/'+data.user.userId+'/'+data.user.pictureName+');">')
        
        $('.image-holder').attr('src','http://saynsnap.com/public/upload/posts/'+data.user.userId+'/'+data.user.postId+'/600.jpg');
       
        if(data.countcomment > 0){
            $('.comment-counter').html(data.countcomment + ' comments'); 
        }
        
        var commentHtml = '';
        
        for(x in data.comment){
            
             commentHtml+='<li>'
                        +'<div class="user-comment-hldr">'
                        +'<a href="profile.html?id='+data.comment[x].commenterUserId+'">'
                        +'<div class="pic" style="background-image: url(http://saynsnap.com/public/upload/pic/'+data.comment[x].commenterUserId+'/'+data.comment[x].pictureName+');">'
                        +'</div>'
                        +'</a>'
                        +'<div class="user-comment-details">'
                        +'<ul>'
                        +'<li class="name"><a href="profile.html?id='+data.comment[x].commenterUserId+'">@'+data.comment[x].username+'</a></li>'
                        +'<li class="date">2014-01-29</li>'
                        +'<li class="comment-txt">'+data.comment[x].comment+'</li>'
                        +'</ul>'
                        +'</div>'
                        +'</div>'
                        +'</li>';
       }
       
       $('.comment-list').html(commentHtml);
       
    });
    
    
    $('#comment-frm').submit(function(){
        $().message("Sorry Unavailable.");
    });
    
});



//Init Collection Page
$(document).on('pageshow','#social-page', function(){
    var url = window.location.href;
    var postId = getUrlVars(url)['postId'];
    
    $('.slike').click(function(){
        like(postId);
    });
    
    $('.sfacebook').click(function(){
       $().message("Shared Facebook.");
    });
    
    $('.stwitter').click(function(){
       $().message("Shared Twitter.");
    });
    
    $('.srepost').click(function(){
       $().message("Repost successful.");
    });
    
});


$(document).on('pageinit','#notification-page', function(){
    checkConnection();
	$.getJSON (domainApi + 'get-notifications?callback=?', {
		user_id : window.localStorage["user_id"],
	}, function(data){
		if (data.status == 'success') {
			var html = '';
			for (x in data.merges) {

				if (typeof data.merges[x].notification_id === 'undefined') {
					var name = '';
					var array_count = data.merges[x].length;
					for (var i=0; i<array_count; i++) {
						var content = data.merges[x][i]['content'];
						var time = data.merges[x][i]['timePosted'];
						var icon = hostname + "public/themes/frontend/images/notification/" + data.merges[x][i]['icon'] + "' alt='" + data.merges[x][i]['icon'];
						
						name += "<a href='profile.html?id=" + data.merges[x][i]['from_id'] + "'>" + data.merges[x][i]['firstname']  + ' ' + data.merges[x][i]['lastname'] + "</a>";
						
						if (array_count == 2 || (i == 1 && array_count == 3)) {
							name += ' and ';
						} else if (i < 2) {
							name += ', ';
						} else if (array_count > 3) {
							var other_query = 'to_id=' + data.merges[x][i]['to_id'] + '&type=' + data.merges[x][i]['type'] + '&post_id=' + data.merges[x][i]['post_id'] ;
							name += " and <a href='notification-other.html?" + other_query + "'>" + (array_count-(i+1)) + " others</a>";
							i = array_count;
						}
					}
				} else {
					var name = "<a href='profile.html?id=" + data.merges[x]['from_id'] + "'>" + data.merges[x]['firstname'] + ' ' + data.merges[x]['lastname'] + "</a>";
					var content = data.merges[x]['content'];
					var time = data.merges[x]['timePosted'];
					var icon = hostname + "public/themes/frontend/images/notification/" + data.merges[x]['icon'] + "' alt='" + data.merges[x]['icon'];
				}
				
				html += "<div class='noti-details clearfix'>"
					  + "  <img src='" + icon + "' />"
					  + "  <div class='noti-message'>"
					  + "    " + name + ' ' + content + ". <span>" + time + "</span>"
					  + "  </div>"
					  + "</div>";
			}
			$('.noti-container').html(html);
		}
	});
});

$(document).on('pageshow','#notification-other-page', function(){
	var to_id 	= getUrlVars()['to_id'];
	var type	= getUrlVars()['type'];
	var post_id = getUrlVars()['post_id'];
	$.getJSON (domainApi + 'get-notif-others?callback=?', {
		to_id	: getUrlVars()['to_id'],
		type	: getUrlVars()['type'],
		post_id	: getUrlVars()['post_id'],
	}, function(data){
		console.log(data);
		if (data.status == 'success') {
			var html = '<ul>';
			for (x in data.result) {
				var img_bg = hostname + "/public/upload/pic/" + data.result[x]['from_id'] + "/" + data.result[x]['picture_name'];
				html += "<li class='clearfix'>"
					  + "  <a href='profile.html?id=" + data.result[x]['from_id'] + "'>"
					  + "     <div class='img-cont' style='background-image: url(" + img_bg + ");'></div>"
					  + "  </a>"
				      + "  <a class='other-name' href='profile.html?id=" + data.result[x]['from_id'] + "'>" + data.result[x]['firstname'] + " " +  data.result[x]['lastname'] + "</a>"
					  + "</li>";
			}
			html += '</ul>';
			$('.noti-other-container').html(html);
		}
	});
});


//Ajax Loader
function ajaxLoader(a){
    
    if(a){
        $.mobile.loading( 'show', {
        	text: '',
        	textVisible: true,
        	theme: 'z',
        	html: ""
        });
    }else{
        $.mobile.loading( 'hide', {
        });
    }
    
}

//Get URL data
function getUrlVars(link) {
    
    if (typeof(link) == 'undefined') {
        var url = window.location.href;
        var vars = {};
        var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
    }else{
        var url = link;
        var vars = {};
        var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
    }
    
    return vars;
}

$(document).on('pageinit','[data-role=page]', function(){
	loadMenu(); 
});





