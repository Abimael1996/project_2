const router = require("express").Router();

const {
  Patient,
  Nutritionist,
  Day,
  Meal,
  DayMeal,
  Ingredient,
  MealIngredient,
} = require("../models");
const withAuth = require("../utils/auth");

router.get("/", (req, res) => {
  res.render("homepage");
});

router.get("/admin", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    console.log(req.session.user_id);
    const userData = await Nutritionist.findByPk(req.session.user_id, {
      attributes: { exclude: ["last_name", "first_name"] },
    });
    const patientsData = await Patient.findAll({
      where: {
        nutritionist_id: req.session.user_id,
      },
      attributes: {
        exclude: ["password"],
      },
    });

    const user = userData.get({ plain: true });
    console.log(user);
    const patients = patientsData.map((patient) =>
      patient.get({ plain: true })
    );
    console.log(patients);

    res.render("adminpage", {
      ...user,
      patients,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/client/:id", async (req, res) => {
  try {
    const clientData = await Patient.findByPk(req.params.id, {
      attributes: {
        exclude: ["password"],
      },
    });
    const client = clientData.get({ plain: true });
    console.log(client);

    const clientsData = await Patient.findAll({
      where: {
        nutritionist_id: 1,
      }
    });
    const clients = clientsData.map((client) => client.get({plain: true}));
    console.log(clients);

    res.render("clientpage", {
      ...client,
      clients,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//TODO: change /client/plan/ for /client/plan/:id once db tables are all set.
router.get("/client/:id/plan/", async (req, res) => {
  try {
    //TODO: Get data by plan_id
    res.render("nutritionplan", {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
