
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Vocadict' });
};

exports.vkauth = function(req, res) {
  res.render('vkauth');
};