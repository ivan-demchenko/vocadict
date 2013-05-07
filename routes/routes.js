exports.index = function (req, res) {
  var env = process.env.NODE_ENV;
  var file = env + '_index';
  res.render(file, { title: 'Vocadict' });
}

exports.vkauth = function (req, res) {
  res.render('vkauth');
};