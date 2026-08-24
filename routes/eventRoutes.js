const router = require("express").Router();
const { body, param } = require("express-validator");
const c = require("../controller/eventController");
const { requireAuth, requireOrganizer } = require("../middleware/common");
const { validate } = require("../middleware/validation");
const eventValidation = [
  body("titulo")
    .trim()
    .isLength({ min: 3 })
    .withMessage("TÃ­tulo deve ter ao menos 3 caracteres."),
  body("descricao")
    .trim()
    .isLength({ min: 10 })
    .withMessage("DescriÃ§Ã£o deve ter ao menos 10 caracteres."),
  body("local").trim().notEmpty().withMessage("Informe o local."),
  body("data_hora").isISO8601().withMessage("Informe data e hora vÃ¡lidas."),
  body("vagas")
    .isInt({ min: 1, max: 10000 })
    .withMessage("Informe entre 1 e 10.000 vagas."),
];
const idValidation = [
  param("id")
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Identificador de evento invalido."),
];
/** @openapi
 * /events/{id}:
 *   get:
 *     summary: Exibe a pÃ¡gina de detalhes de um evento
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer } }]
 *     responses: { '200': { description: PÃ¡gina HTML do evento } }
 */
/** @openapi
 * /:
 *   get:
 *     summary: Lists upcoming events
 *     responses: { '200': { description: HTML page with events } }
 * /organizer/events:
 *   get:
 *     summary: Shows organizer dashboard
 *     security: [{ bearerAuth: [] }]
 *     responses: { '200': { description: HTML page } }
 *   post:
 *     summary: Creates an event
 *     security: [{ bearerAuth: [] }]
 *     requestBody: { required: true, content: { application/x-www-form-urlencoded: { schema: { $ref: '#/components/schemas/EventInput' } } } }
 *     responses: { '302': { description: Redirect after creation } }
 * /organizer/events/{id}:
 *   put:
 *     summary: Updates an owned event
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer, minimum: 1 } }]
 *     requestBody: { required: true, content: { application/x-www-form-urlencoded: { schema: { $ref: '#/components/schemas/EventInput' } } } }
 *     responses: { '302': { description: Redirect after update } }
 *   delete:
 *     summary: Deletes an owned event
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer, minimum: 1 } }]
 *     responses: { '302': { description: Redirect after deletion } }
 * /events/{id}/enroll:
 *   post:
 *     summary: Enrolls the authenticated participant
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: integer, minimum: 1 } }]
 *     responses: { '302': { description: Redirect after enrollment } }
 */
router.get("/", c.home);
router.get("/events/:id", idValidation, validate, c.details);
router.get("/organizer/events", requireAuth, requireOrganizer, c.dashboard);
router.get("/organizer/events/new", requireAuth, requireOrganizer, (req, res) =>
  res.render("event-form", {
    title: "Novo evento",
    event: {},
    action: "/organizer/events",
  }),
);
router.post(
  "/organizer/events",
  requireAuth,
  requireOrganizer,
  eventValidation,
  validate,
  c.create,
);
router.get(
  "/organizer/events/:id/edit",
  requireAuth,
  requireOrganizer,
  idValidation,
  validate,
  async (req, res, next) => {
    try {
      const Event = require("../model/Event");
      const event = await Event.findById(req.params.id);
      if (!event || event.organizador_id !== req.session.user.id)
        return res.status(404).render("error", {
          title: "Evento nÃ£o encontrado",
          message: "Evento nÃ£o encontrado.",
        });
      res.render("event-form", {
        title: "Editar evento",
        event,
        action: `/organizer/events/${event.id}?_method=PUT`,
      });
    } catch (error) {
      next(error);
    }
  },
);
router.put(
  "/organizer/events/:id",
  requireAuth,
  requireOrganizer,
  idValidation,
  eventValidation,
  validate,
  c.update,
);
router.delete(
  "/organizer/events/:id",
  requireAuth,
  requireOrganizer,
  idValidation,
  validate,
  c.remove,
);
router.post(
  "/events/:id/enroll",
  requireAuth,
  idValidation,
  validate,
  c.enroll,
);
module.exports = router;
