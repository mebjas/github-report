var source = document.getElementById('json_data_source');
var data;
var icon_url;

var show = true;
function click_listener() {
    $(".githubreport").clearQueue();
    if (show) { 
        $(".githubreport").slideUp();
        show = false;
    } else {
        $(".githubreport").slideDown();
        show = true;
    }
}

function init() {
    var dom = "<a href=\"#git-report\" class=\"minibutton tabnav-widget tooltipped tooltipped-n \" aria-label=\"Toggle Github Report\" id=\"gitreport_button\" style=\"padding-left: 17px;background-image: url(" +icon_url +");background-size: 16px 16px;background-repeat: no-repeat;background-position: 6px center;\"><span class=\"octicon\"></span></a>";
    $(".tabnav-right").append(dom);
    document.getElementById('gitreport_button').onclick = click_listener;
    
}

if (source != undefined && source != null) {
    // get data and remove the child element
    data = JSON.parse(source.innerHTML);
    icon_url = source.getAttribute('data-logo');
    source.parentElement.removeChild(source);
    init();
}




$(document).ready(function() {
    $(".popular-repos").eq(0).after("<div class=\"columns popular-repos githubreport\" id=\"gitreport\"></div>");
    $(".popular-repos").eq(0).after("<div class=\"boxed-group flush githubreport\" id=\"git_lang_graph\"><h3>Languages Used</h3><div id='gitreport_lang_graph' style='border: 1px solid rgb(216, 216, 216);'></div></div>");

    $("#gitreport").append('<div class="column one-half"><div class="boxed-group flush"><h3>Connected Users</h3><div class="boxed-group-inner"><div class="contrib-column" style="border:none" id="gitreport_connected_users"></div></div></div></div>');
    $("#gitreport").append('<div class="column one-half"><div class="boxed-group flush"><h3>Similar Users</h3><div class="boxed-group-inner"><div class="contrib-column" style="border:none" id="gitreport_similar_users"></div></div></div></div>');
    
    for(var i = 0; i < data.connected_users.length; i++) {
        var jstring = $("#user_data_source div[user='" +data.connected_users[i].username +"']").html();
        if (jstring != undefined) {
            var json = JSON.parse(jstring);
        $("#gitreport_connected_users").append('<a href="/' +data.connected_users[i].username +'" aria-label="@' +data.connected_users[i].username +'" class="tooltipped tooltipped-n  avatar-group-item" itemprop="follows"><img alt="' +data.connected_users[i].name +'" class="avatar" data-user="' +json.id +'" height="42" src="' +json.avatar_url +'" width="42"></a>&nbsp; ');
        }      
    };
    
    for(var i = 0; i < data.similar_users.length; i++) {
        var jstring = $("#user_data_source div[user='" +data.similar_users[i].username +"']").html();
        if (jstring != undefined) {
            var json = JSON.parse(jstring);
        $("#gitreport_similar_users").append('<a href="/' +data.similar_users[i].username +'" aria-label="@' +data.similar_users[i].username +'" class="tooltipped tooltipped-n  avatar-group-item" itemprop="follows"><img alt="' +data.similar_users[i].name +'" class="avatar" data-user="' +json.id +'" height="42" src="' +json.avatar_url +'" width="42"></a>&nbsp; ');
        }
    };

    if (typeof localStorage['lang'] != "undefined") {
        // plot graph
        var lang = JSON.parse(localStorage['lang']);
        var categories = new Array();
        var commits = new Array();
        for(i = 0; i < lang.length; i++) {
            categories[i] = lang[i].language;
            commits[i] = lang[i].count;
        }
        localStorage.removeItem('lang');
        $(function () {
            $('#gitreport_lang_graph').highcharts({
                chart: {
                    type: 'spline'
                },
                title: {
                    text: 'Language Used'
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    title: {
                        text: 'Commits'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'Commits',
                    data: commits
                }]
            });
        });
    }
    
});


