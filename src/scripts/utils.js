function timeConverter(UNIX_timestamp) {
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    date = (parseInt(date, 10) < 10 ) ? ('0'+date) : (date);
    //let hour = a.getHours();
    //let min = a.getMinutes();
    //let sec = a.getSeconds();
    //let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    let time = year + '-' + month + '-' + date;
    return time;
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } 
    while (currentDate - date < milliseconds);
}

function getUrl(method, params) {
    params = params || {};					
    params['access_token'] = '###';
    return 'https://api.vk.com/method/' + method + '?' + $.param(params) + '&v=5.131';
}

function sendRequest(method, params, func) {
    $.ajax({
        url: getUrl(method, params),
        async: false,
        method: 'GET',
        dataType: 'JSONP',
        success: func
    });	
}