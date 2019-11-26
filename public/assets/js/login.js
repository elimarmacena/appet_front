function verificarRotaLogado() {
    var rotas_unlogged = ['index.html', 'login.html', 'novo-usuario.html'];
    var rotaAberta = document.location.href.match(/[^\/]+$/);

    if (rotaAberta == null) return;

    var rotaAtual = rotaAberta[0];

    if ($.cookie('login_error') === 'true') {
        mensagem($.cookie('error_message'), "Erro", 5000);
        
        setTimeout(function () {
            $.cookie('login_error', "false");
            $.cookie('error_message', "");
        }, 1000);
    }

    if (!rotas_unlogged.includes(rotaAtual)) {
        $.ajaxSetup({
            headers: {
                'x-access-token': $.cookie('token')
            }
        });

        $.get(rota_sessao, function (logged_user) {
            var data = JSON.parse(logged_user);

            if (data['token_required'] == true) {
                if (!rotas_unlogged.includes(rotaAtual)) {
                    $.cookie('login_error', "true");
                    $.cookie('error_message', "Usuário deve estar logado para acessar.");

                    window.location = './login.html';
                }
            }
        }).fail(function (msg) {
            var texto = " " + msg.status + " | Motivo: " + msg.responseText;
            mensagem(texto, "Erro", 5000);
        });;
    }

    
}

$(function () {
    verificarRotaLogado();
})


function logout(){

    $.removeCookie("token");
    window.open('./logoutgoogle.html');
    setTimeout( function () { window.location = './index.html'; }, 500);

    


    
}