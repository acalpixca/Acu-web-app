//var metodoSAAM=require('../../sintomas/metodoSAAM');
//var Organo=require('../../sintomas/organo');
var acuLogic=require('acu-logic');
var calculadoraSolar=require('calculadora_solar');

module.exports = function(app)
{
     app.get('/',function(req,res){
        console.log("a ver si carga la pagina index");
		res.render('index.ejs')
     });
     app.get('/about',function(req,res){
        res.render('about.html');
    });

	app.get('/calculadoraSaam',function(req,res){
        res.render('calculadoraSaam.ejs');
    });

	app.get('/calculadoraSol',function(req,res){
        res.render('calculadoraSol.ejs');
    });

	app.get('/shuAntiguos',function(req,res){
        res.render('shuAntiguos.ejs');
    });

	app.get('/resultadoSaam',function(req,res){
		response= {
			organo: req.query.organo,
			tonificarDispersar: req.query.tonificarDispersar
		};
		//console.log(response);
		//console.log(metodoSAAM.tratamientoSAAM(Organo.organoPorNombre(response.organo), response.tonificarDispersar));

		res.render('resultadoSaam',{
			organo: response.organo,
			tonificarDispersar: response.tonificarDispersar,
			listaPuntos: acuLogic.tratamientoSAAM(acuLogic.Organo.organoPorNombre(response.organo), response.tonificarDispersar)
			//listaPuntos: metodoSAAM.tratamientoSAAM(Organo.organoPorNombre(response.organo), response.tonificarDispersar)
			});

		//res.send('html estatico');
		//res.end(JSON.stringify(response));
		});

	app.get('/resultadoSol', function(req,res) {
		response = {
			hora: req.query.hora,
			dia: req.query.dia,
			latitud: req.query.latitud,
			longitud: req.query.longitud
		};
		res.render('resultadoSol', {
			hora:response.hora,
			dia:response.dia,
			latitud:response.latitud,
			longitud:response.longitud,
			horaSolar: calculadoraSolar.calculoHoraLocal(response.dia, response.hora, response.longitud)
		});

		//res.render('about.html');
	});
}
