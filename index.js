require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStoreFactory = require('express-mysql-session');
const helmet = require('helmet');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const pool = require('./config/database');
const { attachLocals, notFound, errorHandler } = require('./middleware/common');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
app.set('view engine', 'ejs');
app.set('views', './view');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore({ createDatabaseTable: true }, pool);
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: isProduction, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 }
}));
app.use(flash());
app.use(attachLocals);

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'EventHub MVC', version: '1.0.0' },
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        EventInput: { type: 'object', required: ['titulo', 'descricao', 'local', 'data_hora', 'vagas'], properties: { titulo: { type: 'string', minLength: 3 }, descricao: { type: 'string', minLength: 10 }, local: { type: 'string' }, data_hora: { type: 'string', format: 'date-time' }, vagas: { type: 'integer', minimum: 1, maximum: 10000 } } },
        UserRegistration: { type: 'object', required: ['nome', 'email', 'senha', 'papel'], properties: { nome: { type: 'string', minLength: 3 }, email: { type: 'string', format: 'email' }, senha: { type: 'string', minLength: 6 }, papel: { type: 'string', enum: ['participante', 'organizador'] } } },
        Event: { allOf: [{ $ref: '#/components/schemas/EventInput' }, { type: 'object', required: ['id', 'organizador_id'], properties: { id: { type: 'integer' }, organizador_id: { type: 'integer' } } }] }
      }
    }
  },
  apis: ['./routes/*.js']
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);
app.use('/', eventRoutes);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 3000);
pool.getConnection().then((connection) => { connection.release(); app.listen(port, () => console.log(`EventHub em http://localhost:${port}`)); }).catch((error) => { console.error('NÃ£o foi possÃ­vel conectar ao banco de dados.', error.message); process.exit(1); });
