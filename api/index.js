//                       _oo$oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                       \  =  /*
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const port = process.env.PORT || 3001;
// Syncing all the models at once.
//
/* require('dotenv').config();  // liberia dotenv configurar var de entornos
const {PORT} = process.env;  // variable entorno
// Syncing all the models at once.
conn.sync({ alter: true }).then(() => {
  server.listen(PORT , () => {
    console.log('%s listening at ', PORT); // eslint-disable-line no-console
  });
}); */

server.listen(process.env.PORT, () => console.log("Server is running on port",port))
/******************** conn.sync({ alter: true }).then(() => {
  server.listen(port, () => {
    console.log('listening at',port); // eslint-disable-line no-console
  });
});  ***********/
/* conn.sync({ force: true }).then(() => {
  server.listen(3001, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  }); */
 /*  server.listen(process.env.PORT, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  }); */ //Si cambio el server.listeing en el back por esto se rompre todo
//})