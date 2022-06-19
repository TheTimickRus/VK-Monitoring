function getUsersPosts() {
    //ПОСТЫ СО СТЕНЫ ПОЛЬЗОВАТЕЛЯ
    out.innerHTML = '';
    let ids = uid.value;
    let exceptions = except.value;
    let exc_arr = exceptions.split(",");
    let exc; //шаблон для слов-исключений
    let n;
    let ids_arr = ids.split(",");
    let tag; //здесь будет лежать шаблон для регулярного выражения
    let tags = utags.value;
    let tags_arr = tags.split(",");
    let text;
    let user_id;
    let post_id;
    let unix_date;
    let post_date;
    let x = 0; // переменная для хранения номера элемента в массиве со ссылками
    let y = 0;
    let links_arr = [];
    let text_arr = [];
    let html = "Пользователи";
    let new_text;
    let dates_arr = [];
    let startDate = min.value;
    let endDate = max.value;
    startDate = Date.parse(startDate);
    endDate = Date.parse(endDate);
    // В условии цикла расчет ведется миллисекундах
    let t = 0; 
    for (let i = startDate; i <= endDate; i=i+24*60*60*1000){
        dates_arr[t] = new Date(i).toISOString().substr(0, 10);
        t++;
    }
    for (let a = 0; a < ids_arr.length; a++){ //обработка разных пользователей
        sendRequest('wall.get', {count: 100, owner_id: ids_arr[a]}, function (data) {	//получение постов со стены
            //console.log(data);
            top: for (let i = 0; i < data.response.items.length; i++) { //запись ссылки на пост в массив links_arr[]
                text = data.response.items[i].text;
                unix_date = data.response.items[i].date;//дата публикации в unix формате
                post_date = timeConverter(unix_date); //дата публикации в формате гггг-мм-дд
                //console.log(text); //вывод текста со всех постов
                if(except.value !== ''){
                    for (let e = 0; e < exc_arr.length; e++){
                        exc = new RegExp("\(" + exc_arr[e] + "\)" , "gi");
                        n = text.search(exc);
                        if(n >= 0){continue top;}
                    }
                }
                for (let j = 0; j < tags_arr.length; j++){ //проверка нескольких ключевых слов
                    if(match.checked){
                        tag = new RegExp("\(" + tags_arr[j] + "\)" , "gi"); //использование тега в качестве шаблона регулярного выражения
                        new_text = text.replace(tag,'<span style="background: yellow">$&</span>');
                    }
                    else if(word.checked){
                        tag = new RegExp("\(\\s?\)\(" + tags_arr[j] + "\)\(\[\^A-Za-zа-яА-Я0-9\]?\|\\s\)" , "i"); //использование тега в качестве шаблона регулярного выражения
                        new_text = text.replace(tag,'<span style="background: yellow">$&</span>');
                        //console.log(tag);
                    }
                    n = text.search(tag);
                    if(min.value.length > 0 && max.value.length > 0){
                        for (let p = 0; p < dates_arr.length; p++){
                            if(post_date == dates_arr[p]){  //если поиск дал какой-либо результат и дата совпадает, то:
                                if(n >= 0){
                                    post_id = data.response.items[i].id;
                                    user_id = data.response.items[i].owner_id;
                                    text_arr[x] = new_text;
                                    links_arr[x] = 'https://vk.com/wall' + user_id + '_' + post_id;
                                    x++;
                                }
                            }
                        }
                    }
                    else{
                        if(n >= 0){
                            post_id = data.response.items[i].id;
                            user_id = data.response.items[i].owner_id;
                            text_arr[x] = new_text;
                            links_arr[x] = 'https://vk.com/wall' + user_id + '_' + post_id;
                            x++;
                        }
                    }
                }
            }
            for (let i = y; i < links_arr.length; i++) { //формирование отображаемого html-кода, используя ссылки из массива links_arr[]
                html += '<BR><div><a target ="_blank" href="' + links_arr[y] + '">' + links_arr[y] + '</a></div>';
                html += '<div>' + text_arr[y] + '</div>';
                y++;	
            }
            if(links_arr.length > 0){out.innerHTML = html;}
            else{out.innerHTML = 'Результатов не найдено :с';}
        })	
    }
}