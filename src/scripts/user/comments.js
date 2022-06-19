function getUsersComments() { //Получение комментов
    out.innerHTML = '';
    let posts_id_arr = [];
    let ids = uid.value;
    let ids_arr = ids.split(",");
    let exceptions = except.value;
    let exc_arr = exceptions.split(",");
    let exc; //шаблон для слов-исключений
    let tags = utags.value;
    let tags_arr = tags.split(",");
    let text, user_id, comment_id, post_id, n, tag;
    let x = y = z = 0; // переменная для хранения номера массива
    let links_arr = [];
    let html = "Комментарии пользователей";
    for (let a = 0; a < ids_arr.length; a++){ //обработка разных сообществ
        sendRequest('wall.get', {count: 100, owner_id: ids_arr[a]}, function (data) {	//получение постов со стены
            //console.log(data);
            for (let i = 0; i < data.response.items.length; i++) { //цикл для проверки текста в каждой публикации
                posts_id_arr[i] = data.response.items[i].id;
            }
            data = undefined;
            for(let b = 0; b < posts_id_arr.length; b++){ //цикл проверки каждой публикации
                sendRequest('wall.getComments', {owner_id: ids_arr[a], post_id: posts_id_arr[b], count: 100}, function (data) {
                    sleep(333);
                    console.log(data);
                    top: for (let i = 0; i < data.response.items.length; i++){ //цикл для получения текста с каждого комментария
                        text = data.response.items[i].text;//текст из комментария
                        if(except.value !== ''){
                            for (let e = 0; e < exc_arr.length; e++){
                                exc = new RegExp("\(" + exc_arr[e] + "\)" , "gi");
                                n = text.search(exc);
                                if(n >= 0){continue top;}
                            }
                        }
                        for (let j = 0; j < tags_arr.length; j++){ //цикл для проверки разных тегов
                            tag = new RegExp("\(" + tags_arr[j] + "\)" , "i"); //использование тега в качестве шаблона регулярного выражения
                            //console.log(tag);
                            n = text.search(tag);
                            //console.log(n);
                            if(n > 0){
                                comment_id = data.response.items[i].id;
                                //console.log(comment_id);
                                user_id = data.response.items[i].owner_id;
                                links_arr[x] = 'https://vk.com/wall' + user_id + '_' + posts_id_arr[b] + '?reply=' + comment_id;
                                x++;
                                //console.log(links_arr.length);
                            }
                        }
                    }
                    for (let i = y; i < links_arr.length; i++) { //формирование отображаемого html-кода, используя ссылки из массива links_arr[]
                        html += '<p><a target ="_blank" href="' + links_arr[y] + '">' + links_arr[y] + '</a></p>';	
                        y++;	
                    }
                    if(links_arr.length == 0){out.innerHTML = 'Результатов не найдено :с';}
                    else{out.innerHTML = html;}
                })
            }
        })
    }
}