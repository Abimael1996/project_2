const router = require('express').Router();

const { Nutritionist } = require('../../models');


//POST route to create a new User/Nutritionist
router.post('/', async (req, res) => {
    try {
        const userData = await Nutritionist.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (error) {
        res.status(400).json(error);
    }
});

//POST route to login a Nutritionist
router.post('/login', async (req, res) => {
    try {
        const userData = await Nutritionist.findOne({ where: { email: req.body.email } });

        if(!userData){
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if(!validPassword){
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            
            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (error) {
        
    }
});


router.post('/logout', (req, res) => {
    if(req.session.logged_in){
        req.session.destroy(() => {
            res.status(204).end();
        });
    }else {
        res.status(404).end();
    }
});

module.exports = router;