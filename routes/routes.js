exports.index = function (req, res) {
  var env;
  if (process.env.NODE_ENV !== 'dev' || process.env.NODE_ENV !== 'prod') {
    env = 'prod';
  } else {
    env = process.env.NODE_ENV;
  }
  var file = env + '_index';
  res.render(file, { title: 'Vocadict', env: env });
}

exports.vkauth = function (req, res) {
  res.render('vkauth');
};