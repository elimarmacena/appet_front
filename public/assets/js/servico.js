function adicionaServico (){


	var horario_servico = strip (String( $("#tableHorarioServico").children("tbody").children("tr").data("ids_horario_servico") ) );
	horario_servico = horario_servico.replace(new RegExp('^[ ]','m'), '');
    horario_servico = horario_servico.replace(new RegExp('[ ]$','m'), '');
	var lista = horario_servico.split(" ")

	console.log ( "horario_servico " +  horario_servico);
	

	if ( (horario_servico == "undefined") || (horario_servico.length == 0) ){
		lista = [];
	}

	var owner_list = [$("#id").val()];
	var data_request = {
		title:$("#titulo").val(),
		about:$("#descricao").val(),
		price:$("#valor").val(),
		ownerId:JSON.stringify(owner_list),
		typeService: $("#tiposervico").val(),
		hourService: JSON.stringify( lista )
	};

	if (validaServico(data_request) == true) {

		$.post(rota_servico, data_request, function(){
		}).done( function (){

		$("#titulo").val("");
		$("#descricao").val("");
		$("#valor").val("");
		$('#tiposervico').val("");		

		var texto = "Cadastro do serviço realizado!";
		mensagem(texto, "Sucesso", 2000);

		}).fail( function (msg) {

		var texto = "Falha ao realizar cadastro do serviço! Status: " + msg.status + " | Motivo: " + msg.responseText ;
		mensagem(texto, "Erro",5000);
		});
	}
	
console.log(data_request);
}

function validaServico(servico){
	var msg = "";
	try {
		if (servico.title.length == 0){
		msg = "Preencha o campo titulo";
		throw msg;}	
		if (servico.typeService.length == 0){
		msg = "Selecione o tipo de serviço";
		throw msg;}
		if (servico.about.length == 0) {
		msg = "Preencha o campo descricao";
		throw  msg;}
		if (servico.price.length == 0) {
		msg = "Preencha o campo valor"
		throw msg;}
		if ($.isNumeric(servico.price) == false) {
		msg = "Campo valor só aceita números"
		throw msg;}
		if ( servico.hourService.includes("[]") ) {
		msg = "Selecione um periodo de atividade";
		throw msg;}

		return true;
	}catch(err) {
	mensagem(msg, "Atencao", 2000);
	    return false;
	 }
}

function pegaListaServico (){
	var owner_list =[$("#id").val()];

	var data_request = {
		title:"",
		about:"",
		price:"",
		ownerId:JSON.stringify(owner_list),
		typeService: "",
		hourService: ""
	};

	$.get(rota_servico, data_request, function () {
	}).done(function (dados) {

		var data_request1 = {
			id_ts: "",
			nome_ts:""
		};

		$.get(rota_tipo_servico, data_request1, function () {
		}).done(function (dados2) {

			// convert a strgin em objeto e ao mesmo tempo
			// acessa a chave data
			var servico = JSON.parse(dados).data;
			var tipo_servivo = JSON.parse(dados2).data;

			console.log(servico);
			console.log(tipo_servivo);




			var texto = ""
			$(servico).each(function(index, elemento) {


				var nome_tipo_servico = Enumerable.From(tipo_servivo)
			  	  .Where(function (x) { return x.id == elemento.id_type })
			  	  .Select(function (x) { return x.nome })
			      .ToArray();
				
				texto += "<p onclick='mostrar(this)'> 	&bull; <em style='cursor:pointer; font-style: oblique; text-shadow'>"+elemento.title.toUpperCase()+"</em> <em style='font-size:14px; margin-left:4px;  cursor:pointer'>  &#8212; R$ "+
				 formataPreco(String(elemento.price)) +" </em> <i style='float:right; cursor:pointer; color: gray ' class='fa fa-chevron-down'></i> <br>"+
				"<span data-idServico='"+ elemento.id_service +"'class='display-none' style='font-size:15px;'>&nbsp;&nbsp;&nbsp;tipo: "+ String(nome_tipo_servico).toLowerCase() + "<i  style='float:right; color: gray; margin-left:10px;cursor:pointer;' class='fa fa-pencil'  title='Editar'></i> <i onclick='removeServico(this)' style='float:right; cursor:pointer; color: gray;' class='fa fa-times'  title='Excluir'></i>" +
				" <br>&nbsp;&nbsp;&nbsp;sobre: " +String(elemento.about).toLowerCase()+ "<br>"+"</span></p>";
			});

			if(texto.length == 0){

				texto = "Você ainda não possui serviços cadastrados.";
			}

			$("#cardServicoConteudo").html( texto);

		})

			
		}).fail(function (msg) {

			var texto = "Falha ao tentar recuperar os dados do servidor! Status: " + msg.status + " | Motivo: " + msg.responseText;
			mensagem(texto, "Erro", 5000);
		});
	
	
}





// Código para Cadastro de Serviço



function preencheTabelaHorario( id_periodo ) {
			var lista_periodo =[id_periodo];
			var data_request = {
			id:"",
			periodId:JSON.stringify(lista_periodo),
			beginTime: "",
			endTime: "",
			weekDay: ""
		};

		$.get(rota_cronograma_servico, data_request, function () {
		}).done(function (dados) {

			
			// convert a strgin em objeto 
			var horarios = JSON.parse(dados).data;
			var lista = JSON.stringify(horarios);
			// console.log(horarios);
			// console.log(lista);
		
			var linha = "";
			var ids_horarios = "";
			
			// var dom, seg, ter, qua, qui, sex, sab


			for (var i = 1; i <= 7; i++) {
				
				  var coluna = "";
				  var queryResult = Enumerable.From(horarios)
				  	  .Where(function (x) { return x.week_day == i })
				      .OrderBy(function (x) { return x.week_day, x.begin_time, x.end_time })
				      .ToArray();

				      if (queryResult.length != 0){

					      $(queryResult).each(function(key, item) {

					      	ids_horarios = ids_horarios + item.schedule_id + " ";
					      	var ini = item.begin_time;
							var fim = item.end_time;
							var intervalo =' '+ini.substring(0,2) +":"+ ini.substring(2,4)  + " - "+ fim.substring(0,2) +":"+ fim.substring(2,4);
							
							coluna = coluna + "<span style='font-weight:bold; padding:3px' >"+ intervalo + "</span> <br><br>";

					     });


					  	}

					  	linha =  linha + "<td>" +  coluna + "</td>";
				
			}

		// se na tabela existir linha então remova
		if (	$("#tableHorarioServico").children("tbody").children("tr").length ){

			$("#tableHorarioServico").children("tbody").children("tr").remove();
			
		}


		$("#tableHorarioServico").append("<tr data-ids_horario_servico='"+ids_horarios+"'>"+linha+"</tr>");



				      // var queryResult = Enumerable.From(horarios)
				      // .Where(function (x) { return x.week_day == 7 })
				      // .OrderBy(function (x) { return x.week_day})
				      // .OrderByDescending(function (x) { return x.schedule_id})
				      // .ToArray();

				    console.log(JSON.stringify(queryResult));



		// $("#horaservico").html(texto );


		//console.log(horarios);

		}).fail(function (msg) {

			var texto = "Falha ao tentar recuperar os dados do servidor! Status: " + msg.status + " | Motivo: " + msg.responseText;
			mensagem(texto, "Erro", 5000);
		});
}



function removeServico(elemento){

	var id = $(elemento).parents("span")[0].attributes[0].value;
	$.post(rota_remove_service, {serviceId: id}, function(){
    }).done( function (){
        $(elemento).parents("p").remove();
        var texto = "Remoção do Serviço realizada!";
        mensagem(texto, "Sucesso", 2000);
    }).fail( function (msg) {
        var texto = "Falha ao realizar remoção do Serviço! Status: " + msg.status + " | Motivo: " + msg.responseText ;
        mensagem(texto, "Erro",5000);
    });

    pegaListaServico();

}



function formataPreco (preco){
	if( ! preco.includes('.')){
		preco = preco + ".00";}
	return preco;
}
