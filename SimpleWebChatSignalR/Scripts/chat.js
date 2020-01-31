$(function () {

    // Reference the auto-generated proxy for the hub.
    var chatHub = $.connection.chatHub;


    //update user list when new user log in
    UpdateUsersList();

    // Create a function that the hub can call back to display messages.
    chatHub.client.SendMessage = function (firstName, lastName, picture, message) {

        var msg = '<div class="incoming_msg">' +
            '<div class="incoming_msg_img"> <img src="' + picture + '"></div>' +
            '<div class="received_msg">' +
            '<div class="received_withd_msg">' +
            '<p> ' + message + '</p>' +
            '<span class="time_date"> ' + firstName + ' ' + lastName + ' 11:01 AM    |    June 9</span>' +
            '</div>' +
            '</div>' +
            '</div>';

        $('#messages').append(msg);
    };

    // Start the connection.
    $.connection.hub.start().done(function () {

        var firstName = "";
        var lastName = "";
        var picture = "";

        $.ajax({
            url: 'https://randomuser.me/api/',
            dataType: 'json',
            success: function (data) {
                firstName = data.results[0].name.first;
                lastName = data.results[0].name.last;
                picture = data.results[0].picture.medium;

                chatHub.server.connect(firstName, lastName, picture);
            }
        });

        $('#sendmessage').click(function () {
            chatHub.server.send(firstName, lastName, picture, $('#message').val());
            $('#message').val('').focus();
        });

    });

});

function UpdateUsersList() {
    var chatHub = $.connection.chatHub;
    chatHub.on('updateUsersList', function (usersList) {
        GetUserList(usersList);
    });
}

function GetUserList(usersList) {
    $('#user_list').empty();

    var chatHub = $.connection.chatHub;
    //get connection id
    var connectionId = chatHub.connection.id;

    $.map(usersList, function (item) {

        var div = '<div title="online" class="chat_list active_chat">' +
            '<div class="chat_people">' +
            '<div class="chat_img"> <img src="' + item.Picture + '" > </div>' +
            '<div class="chat_ib">' +
            '<h5>' + item.FirstName + ' ' + item.LastName + ' <span style="color:green;" title="online" class="chat_date fa fa-circle"></span></h5>' +
            '</div>' +
            '</div>' +
            '</div>';

        if (item.ConnectionId === connectionId) {
            div = '<div title="online" class="chat_list active_chat">' +
                '<div class="chat_people">' +
                '<div class="chat_img"> <img src="' + item.Picture + '" > </div>' +
                '<div class="chat_ib">' +
                '<h5>' + item.FirstName + ' ' + item.LastName + ' <b>(me)</b> <span style="color:green;" title="online" class="chat_date fa fa-circle"></span></h5>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        $('#user_list').append(div);
    });

}

function htmlEncode(value) {
    var encodedValue = $('<div />').text(value).html();
    return encodedValue;
}