$(function(){
  // 画面上の最新ID
  var last_message_id = 0;

  function buildHTML(message){
    var MessageImage = ``
    if (message.image){
      MessageImage = `<img class="lower-message__image" src="${message.image}">`
    }
    var html = ` <div class= "message" "data-message-id"=${message.id}>
                    <div class= upper-message>
                      <div class= upper-message__user-name>
                        ${message.user_name}
                      </div>
                      <div class= upper-message__date>
                        ${message.date}
                      </div>
                    </div>
                    <div class= lower-message>
                      <div class= lower-message__content>
                        ${message.content}
                      </div>
                        ${MessageImage}
                    </div>
                </div>`
    return html;
  }

  function reload() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)) {
      $.ajax({
        url: 'api/messages',
        type: "GET",
        dataType: 'json',
        data: {id: last_message_id}
      })
      .done(function(new_messages){

        // 画面初期表示時のみ実行
        if (last_message_id == 0) {
          last_message_id = $('.message').last().data('messageId');
        }

        var chatHTML = '';
        new_messages.forEach(function(message){
          if (message.id > last_message_id){
            chatHTML += buildHTML(message);
          $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, "first");

          // 画面上の最新IDを更新
          last_message_id = message.id;
          }
        });
      $('.messages').append(chatHTML);
      })
      .fail(function(new_messages){
        alert('メッセージ取得に失敗しました');
      });
    }
    else {
      clearInterval(intarval);
    }
  }
  
  $('.js-form').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');   
      $('form')[0].reset();
    })
     .fail(function(){
       alert('メッセージを入力してください');
     });
     return false;
  })

  setInterval(reload, 7000);
})