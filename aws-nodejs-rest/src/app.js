const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const { getUserContext, getUserFromLDAP } = require('./authorize.js');
const YAML = require('yamljs');

const { API_ROOT } = process.env;

const swaggerDoc = YAML.load('./src/swagger.yaml');
swaggerDoc.servers[0].url = `${API_ROOT}`;
const app = express();
const router = express.Router();

router.use(compression());
router.use(cors());
router.use(bodyParser.json({ type: '*/*' }));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());
router.use(getUserContext(getUserFromLDAP));

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDoc);
});
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/healthcheck', (req, res) => {
  res.json({ status: 'ok' });
});

routes.setup(router);
app.use('/', router);

// Custom error handler since the default error handler
// returns the stack trace to the client
app.use((err, req, res, next) => {
  // If we've already started sending response headers
  // we have to delegate to the Express default error handler
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  res.status(err.httpStatusCode || 500);
  return res.send(err.message || 'Unexpected Error');
});

// Export your express server so you can import it in the lambda function.
module.exports = app;
