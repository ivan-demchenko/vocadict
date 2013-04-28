
/*
 * GET home page.
 */

exports.index = function (req, res) {
  var file = process.env.NODE_ENV + '_index';
  res.render(file, { title: 'Vocadict', env: process.env.NODE_ENV });
};

exports.vkauth = function (req, res) {
  res.render('vkauth');
};