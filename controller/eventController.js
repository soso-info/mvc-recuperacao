const Event = require("../model/Event");
/** @async @param {import('express').Request} req @param {import('express').Response} res @returns {Promise<void>} @throws {Error} */
exports.home = async (req, res, next) => {
  try {
    res.render("home", {
      title: "PrÃ³ximos eventos",
      events: await Event.listUpcoming(),
    });
  } catch (error) {
    next(error);
  }
};
/** @async @param {import('express').Request} req @param {import('express').Response} res @param {import('express').NextFunction} next @returns {Promise<void>} @throws {Error} */
exports.details = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).render("error", {
        title: "Evento nÃ£o encontrado",
        message: "O evento nÃ£o existe.",
      });
    const enrolled = req.session.user
      ? await Event.isEnrolled(event.id, req.session.user.id)
      : false;
    res.render("event-details", { title: event.titulo, event, enrolled });
  } catch (error) {
    next(error);
  }
};
/** @async @param {import('express').Request} req @param {import('express').Response} res @param {import('express').NextFunction} next @returns {Promise<void>} @throws {Error} */
exports.dashboard = async (req, res, next) => {
  try {
    res.render("dashboard", {
      title: "Meus eventos",
      events: await Event.byOrganizer(req.session.user.id),
    });
  } catch (error) {
    next(error);
  }
};
/** @async @param {import('express').Request} req @param {import('express').Response} res @param {import('express').NextFunction} next @returns {Promise<void>} @throws {Error} */
exports.create = async (req, res, next) => {
  try {
    await Event.create(req.body, req.session.user.id);
    req.flash("success", "Evento criado.");
    res.redirect("/organizer/events");
  } catch (error) {
    next(error);
  }
};
/** @async @param {import('express').Request} req @param {import('express').Response} res @param {import('express').NextFunction} next @returns {Promise<void>} @throws {Error} */
exports.update = async (req, res, next) => {
  try {
    await Event.update(req.params.id, req.body, req.session.user.id);
    req.flash("success", "Evento atualizado.");
    res.redirect("/organizer/events");
  } catch (error) {
    next(error);
  }
};
/** @async @param {import('express').Request} req @param {import('express').Response} res @param {import('express').NextFunction} next @returns {Promise<void>} @throws {Error} */
exports.remove = async (req, res, next) => {
  try {
    await Event.remove(req.params.id, req.session.user.id);
    req.flash("success", "Evento excluÃ­do.");
    res.redirect("/organizer/events");
  } catch (error) {
    next(error);
  }
};
/** @async @param {import('express').Request} req @param {import('express').Response} res @param {import('express').NextFunction} next @returns {Promise<void>} @throws {Error} */
exports.enroll = async (req, res, next) => {
  try {
    if (await Event.isEnrolled(req.params.id, req.session.user.id)) {
      req.flash("error", "VocÃª jÃ¡ estÃ¡ inscrito neste evento.");
    } else if (await Event.enroll(req.params.id, req.session.user.id)) {
      req.flash("success", "InscriÃ§Ã£o realizada com sucesso.");
    } else {
      req.flash(
        "error",
        "NÃ£o foi possÃ­vel realizar a inscriÃ§Ã£o: evento inexistente ou sem vagas.",
      );
    }
    res.redirect(`/events/${req.params.id}`);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      req.flash("error", "VocÃª jÃ¡ estÃ¡ inscrito neste evento.");
      return res.redirect(`/events/${req.params.id}`);
    }
    next(error);
  }
};
