function getGroupsPosts() { //ПОСТЫ СО СТЕНЫ ГРУППЫ
    $("#spn").css("display", "block");
    $("#out").css("display", "none");
    
    out.innerHTML = '';
    
    let ids = uid.value;
    let ids_arr = ids.split(",");
    let exceptions = except.value;
    let exc_arr = exceptions.split(",");
    let exc; //шаблон для слов-исключений
    let tags = utags.value;
    let tags_arr = tags.split(",");
    let unix_date,post_date,text,group_id,comment_id,post_id,n,tag;
    let x = y = 0; // переменная для хранения номера массива
    let links_arr = [];
    let text_arr = [];
    let html = "<div>Группы</div>";
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

    //обработка разных сообществ
    for (let a = 0; a < ids_arr.length; a++) { 
        //получение постов со стены
        sendRequest('wall.get', {count: 100, owner_id: -ids_arr[a]}, function (data) {
			console.log(data);
            //цикл для проверки текста в каждой публикации
            top: for (let i = 0; i < data.response.items.length; i++) { 
                text = data.response.items[i].text;//текст из поста
                unix_date = data.response.items[i].date;//дата публикации в unix формате
                post_date = timeConverter(unix_date); //дата публикации в формате гггг-мм-дд
                if(except.value !== '') {
                    for (let e = 0; e < exc_arr.length; e++) {
                        exc = new RegExp("\(" + exc_arr[e] + "\)" , "gi");
                        n = text.search(exc);
                        if(n >= 0){continue top;}
                    }
                }
                for (let j = 0; j < tags_arr.length; j++) {
                    if(match.checked){
                        tag = new RegExp("\(" + tags_arr[j] + "\)" , "gi"); //использование тега в качестве шаблона регулярного выражения
                        new_text = text.replace(tag,'<span style="background: yellow">$&</span>');
                    } else if(word.checked){
                        tag = new RegExp("\(\\s?\)\(" + tags_arr[j] + "\)\(\[\^A-Za-zа-яА-Я0-9\]\|\\s\)" , "i"); //использование тега в качестве шаблона регулярного выражения
                        new_text = text.replace(tag,'<span style="background: yellow">$&</span>');
                    }
                    n = text.search(tag);
                    if(min.value.length > 0 && max.value.length > 0) { //если дата выставлена в обоих полях, то:
                        for (let p = 0; p < dates_arr.length; p++) { //цикл проверки диапазона дат
                            if(post_date == dates_arr[p]){  //если дата публикации и дата из диапазона совпадают, то:
                                if(n >= 0) { //если поиск дал результат, то:
                                    post_id = data.response.items[i].id;
                                    group_id = data.response.items[i].owner_id;
                                    text_arr[x] = new_text;
                                    links_arr[x] = 'https://vk.com/wall' + group_id + '_' + post_id;
                                    x++;
                                }
                            }
                        }
                    } else { //если дата не выставлена в каком то из полей или вообще не выставлена:
                        if(n >= 0){
                            post_id = data.response.items[i].id;
                            group_id = data.response.items[i].owner_id;
                            text_arr[x] = new_text;
                            links_arr[x] = 'https://vk.com/wall' + group_id + '_' + post_id;
                            x++;
                        }
                    }
                }
            }

            //формирование отображаемого html-кода, используя ссылки из массива links_arr[]
            for (let i = y; i < links_arr.length; i++) { 
                html += '<BR><div><a target ="_blank" href="' + links_arr[y] + '">' + links_arr[y] + '</a></div>';
                html += '<div align="justify">' + text_arr[y] + '</div>';
                y++;	
            }

            if (links_arr.length == 0) {
                out.innerHTML = 'Результатов не найдено :с';
            } else {
                out.innerHTML = html
            }
        })
    }

    $("#spn").css("display", "none");
    $("#out").css("display", "block");
}