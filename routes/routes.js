exports.index = function (req, res) {
  // console.log('NODE_ENV: ' + process.env.NODE_ENV);

  var env = process.env.NODE_ENV.toString();

  /*if (env != 'dev' || env != 'prod') {
    env = 'prod';
  } else {
    env = process.env.NODE_ENV;
  }*/
  var file = env + '_index';

  console.log('Asked for index, env: ' + env + ', file is ' + file);

  res.render(file, { title: 'Vocadict' });
}

exports.vkauth = function (req, res) {
  res.render('vkauth');
};