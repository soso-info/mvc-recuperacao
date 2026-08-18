const bcrypt = require('bcryptjs');
const User = require('../model/User');
/** @async @param {import('express').Request} req @param {import('express').Response} res @returns {Promise<void>} @throws {Error} */
exports.register = async (req, res, next) => { try { const { nome, email, senha, papel } = req.body; if (await User.findByEmail(email)) { req.flash('error', 'Este e-mail jÃ¡ estÃ¡ cadastrado.'); return res.redirect('/auth/register'); } const id = await User.create({ nome, email, senhaHash: await bcrypt.hash(senha, 12), papel }); req.session.user = { id, nome, email, role: papel }; req.flash('success', 'Conta criada com sucesso.'); res.redirect('/'); } catch (error) { next(error); } };
/** @async @param {import('express').Request} req @param {import('express').Response} res @returns {Promise<void>} @throws {Error} */
exports.login = async (req, res, next) => { try { const user = await User.findByEmail(req.body.email); if (!user || !(await bcrypt.compare(req.body.senha, user.senha_hash))) { req.flash('error', 'E-mail ou senha invÃ¡lidos.'); return res.redirect('/auth/login'); } req.session.regenerate((error) => { if (error) return next(error); req.session.user = { id: user.id, nome: user.nome, email: user.email, role: user.papel }; res.redirect('/'); }); } catch (error) { next(error); } };
/** @param {import('express').Request} req @param {import('express').Response} res @param {import('express').NextFunction} next @returns {void} @throws {Error} */
exports.logout = (req, res, next) => req.session.destroy((error) => error ? next(error) : res.redirect('/'));

