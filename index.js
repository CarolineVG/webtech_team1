/* algemeen */


/* packages */


/* middleware */


/* luister naar poort */

//const chalk = require('chalk');
//console.log(chalk.blue("JS")); // werkt niet?

const express = require('express')
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'pug');

app.use(bodyParser.json() );
app.use('/', require('./routes/index') );

app.listen(3000, () => console.log('Example app listening on port 3000!'))