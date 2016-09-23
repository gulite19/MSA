/// <reference path="jquery.d.ts" />
/// <reference path="bootstrap-tagsinput.d.ts" />
/// <reference path="jsapi.d.ts" />

declare var google: any;

var Module_feed = function () {

    /*initial content array*/
    var title_arr = new Array();
    var desc_arr = new Array();
    var link_arr = new Array();
    var img_arr = new Array();

    /*number of feeds have been parsed*/
    var meta_number = null;    /*unused*/

    function parse_input() {
        var meta = $('#input_feed').val();
        if (meta != null && meta.length > 0) {
            // need to add regex to filter input
            var u_array = $('#input_feed').tagsinput('items');
            var meta_number = u_array.length;
            //console.log(u_array);
        }
        for (var i = 0; i < u_array.length; i++) {
            console.log('delegate No.' + i);
            parseFeed(u_array[i]);

        }

        /*get img tag from content. this may vary because of non-standardized format of feed*/

        console.log(meta_number);

    }

    function parseFeed(url) {

        //console.log('parsing:' + url);
        function parseF() {
            var feed = new google.feeds.Feed(url);
            feed.setNumEntries(10);
            //console.log(feed);

            feed.load(function (result) {
                //console.log(result.error);
                if (!result.error) {
                    //console.log(result.feed);
                    for (var i = 0; i < result.feed.entries.length; i++) {
                        var entry = result.feed.entries[i];
                        title_arr.push(entry.title);
                        desc_arr.push(entry.content);
                        link_arr.push(entry.link);


                    }
                    /**/

                    (function () {
                        desc_arr.forEach(function (element, index, array) {

                            var rei = /<img[^><]*?>/;  //image
                            var rec = /([^a]>|\/>)[^><]+(?=<|$)/;  //content
                            var result = rei.exec(element);
                            var result1 = rec.exec(element);

                            var str = result1[0].substr(2);
                            if (result != null && result[0].length > 0) {
                                var reimg = /src=".*?"/;
                                var res = reimg.exec(result[0]);
                                img_arr[index] = res[0].slice(5, -1);

                            }
                            if (result1 != null && result1[0].length > 0) {
                                array[index] = str;
                            }
                        })
                    } ())


                    console.log(img_arr);
                    console.log(desc_arr);

                    render();

                }
            });
        }

        parseF();

        google.setOnLoadCallback(function () {
            parseF();
        });


    }

    function render() {  /*fill first, then arrange*/

        $('#main_container').html("");

        console.log('in render');
        console.log(img_arr.length);

        var win_height = $(window).height();
        var win_width = $(window).width();

        var to_top = $(window).scrollTop();


        var num = null;
        /*number of column*/

        var item_width = null;

        /*item's width -- ipad- 170px with margin:10px 5px; pc 236px with padding: 24px 12px;*/

        if (win_width <= 768) {
            item_width = 180;

            /*later make it to be an interface to public*/
        } else {
            item_width = 260;

            /*later make it to be an interface to public*/
        }

        num = Math.floor(win_width / item_width);
        $('#main_container').css('width', num * item_width);

        var current_height = new Array();


        var sum_height = new Array(num);


        /*initialize image obj from [array] img_arr*/

        console.log('num=' + num + ';item_width=' + item_width + ';current_height=' + current_height + 'img_arr.length=' + img_arr.length);

        for (var i = 0; i < img_arr.length; i++) {
            var img = $('<img>');
            img.attr('src', img_arr[i]);
            img.unbind("load");
            img.bind("load", (function (obj, input) {
                var j = input;
                console.log('height=' + obj[0].height);
                current_height[j] = Math.ceil(obj[0].height / obj[0].width * 100);
                console.log('current_height=' + current_height[j]);

                if (i < num) {
                    $('#main_container').append('<div class="item_block" style="width:' + item_width + 'px; left:' + (i * item_width) + 'px; top:0;"><a class="item_link" href="' + link_arr[i] + '"></a><div class="img_wrapper" style="padding-bottom:' + current_height[i].toString() + '%;"><img src="' + img_arr[i] + '"></div><div class="content_wrapper"><h3>' + title_arr[i] + '</h3><p>' + desc_arr[i] + '</p></div></div>');
                    sum_height[i] = current_height[i] + 20000 / item_width;    /*200px for title and description*/
                    console.log('sumheight=' + sum_height[i]);
                } else {
                    console.log('minimal=' + Math.min.apply(null, sum_height))
                    var next_column = sum_height.indexOf(Math.min.apply(null, sum_height));
                    console.log(next_column);
                    if (sum_height[next_column] > 1.5 * win_width) {
                        $('#main_container').append('<div class="item_block" style="width:' + item_width + 'px; left:' + (next_column * item_width) + 'px; top:' + (sum_height[next_column] * item_width / 100) + 'px;"><a class="item_link" href="' + link_arr[i] + '"></a><div class="img_wrapper" style="padding-bottom:' + current_height[i].toString() + '%;"><img class="lazy" data-original="' + img_arr[i] + '"></div><div class="content_wrapper"><h3>' + title_arr[i] + '</h3><p>' + desc_arr[i] + '</p></div></div>');

                    } else {
                        $('#main_container').append('<div class="item_block" style="width:' + item_width + 'px; left:' + (next_column * item_width) + 'px; top:' + (sum_height[next_column] * item_width / 100) + 'px;"><a class="item_link" href="' + link_arr[i] + '"></a><div class="img_wrapper" style="padding-bottom:' + current_height[i].toString() + '%;"><img src="' + img_arr[i] + '"></div><div class="content_wrapper"><h3>' + title_arr[i] + '</h3><p>' + desc_arr[i] + '</p></div></div>');
                    }
                    var temp = sum_height[next_column];
                    sum_height[next_column] = temp + current_height[i] + 20000 / item_width;;
                }

            } (img, i)))
        }
    }

    return {
        init: function () {    /*entrance of function*/

            parse_input();
        },

        modify: function () {
            render();
        }
    }
}

var m = Module_feed();    /*initialize object*/

$(window).on('load resize', function () {    /*modify padding for main_wrapper*/
    var height = $('#input_container').height();
    $('#main_wrapper').css('padding-top', height);

})


$('#input_submit').on('click', function () {    /*entrance of main function*/

    google.load("feeds", "1");

    m.init();

})

$(window).on('resize', function () {
    if (m) {
        m.modify();
    } else {
        var n = Module_feed();
        n.modify();
    }
})

$('#aj_login').on('click', function () {
    var in_email = $('#in_email').val();
    var in_pwd = $('#in_pwd').val();
    if (in_email.length > 0 && in_pwd.length > 0 && in_email != null && in_pwd != null) {
        $.ajax({
            type: 'get',
            url: '/api/Account',
            data: {
                'account': in_email,
                'password': in_pwd
            }, success: function (data) {
                if (data == true) {
                    alert('welcome ' + in_email);
                } else {
                    alert('login failed');
                }
            }
        })
    }
})

$('#aj_reg').on('click', function () {
    var in_email = $('#in_email').val();
    var in_pwd = $('#in_pwd').val();
    if (in_email.length > 0 && in_pwd.length > 0 && in_email != null && in_pwd != null) {
        $.ajax({
            type: 'post',
            url: '/api/Account',
            data: {
                'account': in_email,
                'password': in_pwd
            }, success: function (data) {
                alert(data);
            }
        })
    }
})