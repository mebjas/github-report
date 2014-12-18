var default_access_token = "f070e6c0dd55ba5161740686fa2b7b6f2c0999ec";
var uname = location.pathname.replace('/','');
var script_url = chrome.extension.getURL("inject.js");
var icon_url = chrome.extension.getURL("resources/logo.png");


var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://osrc.dfm.io/' +uname +'.json');
xhr.onreadystatechange = function(e) {
    if (this.readyState == 4 && this.status == 200) {
        var hiddenJson = document.createElement('div');
        hiddenJson.style.display = 'none';
        hiddenJson.innerHTML = this.response;
        hiddenJson.setAttribute('id', 'json_data_source');
        hiddenJson.setAttribute('data-logo', icon_url);
        document.body.appendChild(hiddenJson);
        
        var data = JSON.parse(this.response);
        localStorage['lang'] = JSON.stringify(data.usage.languages);
        
        var temp = document.createElement('div');
        temp.style.display = 'none';
        temp.setAttribute('id', 'user_data_source');
        var s1 = document.createElement('script');
        var s2 = document.createElement('script');
        s1.src = 'https://code.highcharts.com/highcharts.js';
        s2.src = 'https://code.highcharts.com/modules/exporting.js';

        document.body.appendChild(s1);
        s1.onload = function() {
            document.body.appendChild(s2);    
        }
        
        document.body.appendChild(temp);

        var masterCount = 0;
        
        for(i = 0; i < data.connected_users.length; i++) {
            var ajax = new XMLHttpRequest();
            ajax.open('GET', 'https://api.github.com/users/' +data.connected_users[i].username +"?access_token=" +default_access_token);
            ajax.username = data.connected_users[i].username;
            ajax.name = data.connected_users[i].name;
            ajax.onreadystatechange = function() {
                if (this.status == 200 && this.readyState == 4) {
                    ++masterCount;
                    var t = document.createElement('div');
                    t.innerHTML = this.response;
                    t.setAttribute('user', this.username);
                    temp.appendChild(t);
                    
                    if (masterCount == data.connected_users.length + data.similar_users.length) {
                        // -- now inject the script
                        var scrpt = document.createElement('script');
                        scrpt.src = script_url;
                        document.body.appendChild(scrpt);
                    }
                } else if (this.readyState == 4) masterCount++;
            };
            ajax.send();
        }
        
        for(i = 0; i < data.similar_users.length; i++) {
            var ajax = new XMLHttpRequest();
            ajax.open('GET', 'https://api.github.com/users/' +data.similar_users[i].username);
            ajax.username = data.similar_users[i].username;
            ajax.name = data.similar_users[i].name;
            ajax.onreadystatechange = function() {
                if (this.status == 200 && this.readyState == 4) {
                    ++masterCount;
                    var t = document.createElement('div');
                    t.innerHTML = this.response;
                    t.setAttribute('user', this.username);
                    temp.appendChild(t);
                    
                    if (masterCount == data.connected_users.length + data.similar_users.length) {
                        // -- now inject the script
                        var scrpt = document.createElement('script');
                        scrpt.src = script_url;
                        document.body.appendChild(scrpt);
                    }
                }  else if (this.readyState == 4) masterCount++;
            };
            ajax.send();
        } 
        
        
    }
}
xhr.send();


