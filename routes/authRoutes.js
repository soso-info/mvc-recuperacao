const router = require('express').Router();
const { body } = require('express-validator');
const controller = require('../controller/authController');
const { validate } = require('../middleware/validation');
/** @openapi
 * /auth/register:
 *   post:
 *     summary: Registers an organizer or participant
 *     requestBody: { required: true, content: { application/x-www-form-urlencoded: { schema: { $ref: '#/components/schemas/UserRegistration' } } } }
 *     responses: { '302': { description: Redirect after registration } }
 * /auth/login:
 *   post:
 *     summary: Starts an authenticated session
 *     requestBody: { required: true, content: { application/x-www-form-urlencoded: { schema: { type: object, required: [email, senha], properties: { email: { type: string, format: email }, senha: { type: string } } } } } }
 *     responses: { '302': { description: Redirect after login } }
 * /auth/logout:
 *   post:
 *     summary: Destroys the current session
 *     security: [{ bearerAuth: [] }]
 *     responses: { '302': { description: Redirect after logout } }
 */
router.get('/login', (req, res) => res.render('login', { title: 'Entrar' }));
router.get('/register', (req, res) => res.render('register', { title: 'Criar conta' }));
router.post('/register', [body('nome').trim().isLength({ min: 3 }).withMessage('Informe um nome vÃ¡lido.'), body('email').isEmail().normalizeEmail().withMessage('Informe um e-mail vÃ¡lido.'), body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'), body('papel').isIn(['participante', 'organizador']).withMessage('Perfil invÃ¡lido.')], validate, controller.register);
router.post('/login', [body('email').isEmail().normalizeEmail(), body('senha').notEmpty()], validate, controller.login);
router.post('/logout', controller.logout);
module.exports = router;

