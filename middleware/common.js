exports.attachLocals = (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
};
exports.requireAuth = (req, res, next) =>
  req.session.user
    ? next()
    : (req.flash("error", "Faça login para continuar."),
      res.redirect("/auth/login"));
exports.requireOrganizer = (req, res, next) =>
  req.session.user?.role === "organizador"
    ? next()
    : (req.flash("error", "Acesso exclusivo de organizadores."),
      res.redirect("/"));
exports.notFound = (req, res) =>
  res.status(404).render("error", {
    title: "Página não encontrada",
    message: "A página solicitada não existe.",
  });
exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).render("error", {
    title: "Erro interno",
    message: "Ocorreu um erro. Tente novamente mais tarde.",
  });
};
