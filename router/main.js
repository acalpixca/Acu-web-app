var metodoSAAM=require('../../sintomas/metodoSAAM');
var Organo=require('../../sintomas/organo');
module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('index.html')
     });
     app.get('/about',function(req,res){
        res.render('about.html');
    });
	app.get('/resultado',function(req,res){
		response= {
			organo: req.query.organo,
			tonificarDispersar: req.query.tonificarDispersar
		};
		//console.log(response);
		//console.log(metodoSAAM.tratamientoSAAM(Organo.organoPorNombre(response.organo), response.tonificarDispersar));
		
		res.render('resultado',{
			organo: response.organo,
			tonificarDispersar: response.tonificarDispersar,
			listaPuntos: metodoSAAM.tratamientoSAAM(Organo.organoPorNombre(response.organo), response.tonificarDispersar)
			});
		
		//res.send('html estatico');
		//res.end(JSON.stringify(response));
		});
}