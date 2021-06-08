window.addEventListener("load" , function (){

    $("#single_video_comments_submit").on("click",function(){ comments_submit(); });
    single_video_comments_form_initialize();

    $(document).on("click",".rating_good",function(){ rate_submit(true); });
    $(document).on("click",".rating_bad",function(){ rate_submit(false); });

    $(document).on("click","#mylist_submit",function(){ mylist_submit(); });


    $(document).on("click","#video_delete", function() { video_delete();});

    $(document).on("click",".comment_page",function(){ get_comment_page( $(this).val()); }); 


    const video   = document.querySelector("video");
    video.addEventListener("volumechange",(event) => {
        document.cookie = "volume=" + decodeURIComponent(event.target.volume) + ";Path=/single;SameSite=strict";
    });
 
    set_video_volume();
    
});

function set_video_volume(){

    let cookies         = document.cookie;
    console.log(cookies);

    let cookiesArray    = cookies.split(';');
    let volume          = 0;

    for(let c of cookiesArray) {
        console.log(c);

        let cArray = c.split('=');
        if( cArray[0] === "volume"){
            volume  = Number(cArray[1]);
            console.log(volume);
            break;
        }
    }

    const video     = document.querySelector("video");
    video.volume    = volume;
}

function comments_submit(){

    let form_elem   = "#single_video_comments_form";

    let data    = new FormData( $(form_elem).get(0) );
    let url     = $(form_elem).prop("action");
    let method  = $(form_elem).prop("method");

    for (let v of data.entries() ){ console.log(v); }

    $.ajax({
        url: url,
        type: method,
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json'
    }).done( function(data, status, xhr ) { 

        if (data.error){
            $("#comments_message").addClass("upload_message_error");
            $("#comments_message").removeClass("upload_message_success");
        }
        else{
            $("#comments_message").addClass("upload_message_success");
            $("#comments_message").removeClass("upload_message_error");
            single_video_comments_form_initialize();

            $("#video_comments_area").html(data.content);
        }

        $("#comments_message").text(data.message)

        console.log(data);

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    });

}
function single_video_comments_form_initialize() {
    $("[name='content']").val("");
}


function rate_submit(rate){

    console.log(rate);


    let form_elem   = ".single_video_rating_content";

    let data    = JSON.stringify({ "flag":rate });
    let url     = $(form_elem).prop("action");
    let method  = "PATCH";

    $.ajax({
        url: url,
        type: method,
        contentType : 'application/json; charset=utf-8',
        enctype     : "multipart/form-data",
        data: data,
    }).done( function(data, status, xhr ) { 

        if (data.error){
        }
        else{
            $("#single_video_rating_area").html(data.content);
        }

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    });


}

function mylist_submit(id){

    let form_elem   = "#mylist_form_area";

    let data    = new FormData( $(form_elem).get(0) );
    let url     = $(form_elem).prop("action");
    let method  = $(form_elem).prop("method");

    for (let v of data.entries() ){ console.log(v); }

    $.ajax({
        url: url,
        type: method,
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json'
    }).done( function(data, status, xhr ) { 

        if (data.error){
            $("#mylist_message").addClass("upload_message_error");
            $("#mylist_message").removeClass("upload_message_success");
        }
        else{
            $("#mylist_message").addClass("upload_message_success");
            $("#mylist_message").removeClass("upload_message_error");
        }

        $("#mylist_message").text(data.message)


        console.log(data);

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    });

}

//動画を削除する
function video_delete(){

    //#video_delete_formを指定、フォーム内のデータ、送信先URL、メソッドを抜き取る
    //TIPS:PUT、DELETE、PATCHはpropで参照しようとしてもGETに変換されてしまうので、直入力
    let form_elem   = "#video_delete_form";

    let data    = new FormData( $(form_elem).get(0) );
    let url     = $(form_elem).prop("action");
    let method  = "DELETE";

    //フォーム内のデータを確認できる
    for (let v of data.entries() ){ console.log(v); }

    //Ajaxを送信する
    //http://semooh.jp/jquery/api/ajax/jQuery.ajax/options/
    $.ajax({
        url: url,
        type: method,
        data: data,
        processData: false, // dataをクエリ文字列に指定しない trueにするとcontentTypeの値はデフォルトで"application/x-www-form-urlencoded"になる
        contentType: false, //content-typeヘッダの値。processDataでfalseを指定したので、これは無くても動く
        dataType: 'json' //サーバーから返却されるデータはjson形式を指定
    }).done( function(data, status, xhr ) {

        if (data.error){
            console.log(data.error);
            $("#delete_message").addClass("upload_message_error");
            $("#delete_message").removeClass("upload_message_success");
        }
        else{
            console.log("削除完了");
            $("#delete_message").addClass("upload_message_success");
            $("#delete_message").removeClass("upload_message_error");
        }

        $("#delete_message").text(data.message)

        console.log(data);

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    });

}



//コメントのページ移動
function get_comment_page(page){

    if (!(page)){ return false; }

    let form_elem   = "#comment_pagination_area";

    let url     = $(form_elem).prop("action") + "?page=" + page;
    let method  = $(form_elem).prop("method");

    console.log(url);

    $.ajax({
        url: url,
        type: "GET",
        dataType: 'json'
    }).done( function(data, status, xhr ) {

        if (data.error){
            console.log("error");
        }
        else{
            $("#video_comments_area").html(data.content);
            $(".single_video_comments").animate({scrollTop:0},100);
        }
    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    });


}

