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
		//var organo   = req.body.organo;  //req.body.organo;
		response= {
			organo: req.query.organo,
			tonificarDispersar: req.query.tonificarDispersar
		};
		console.log(response);
		console.log(metodoSAAM.tratamientoSAAM(Organo.organoPorNombre(response.organo), response.tonificarDispersar));
		res.send('Para ' + response.tonificarDispersar + ' el &oacute;rgano ' + response.organo + ':<br>' + metodoSAAM.tratamientoSAAM(Organo.organoPorNombre(response.organo), response.tonificarDispersar)  );
		//res.end(JSON.stringify(response));
		});
}