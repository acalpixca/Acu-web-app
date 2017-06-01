//var metodoSAAM=require('../../sintomas/metodoSAAM');
//var Organo=require('../../sintomas/organo');
var acuLogic=require('acu-logic');

module.exports = function(app)
{
     app.get('/',function(req,res){
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
}