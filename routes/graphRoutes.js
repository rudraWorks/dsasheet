const {Router} = require('express')
const graphController = require('../controllers/graphController')

const router = Router()

router.get('/graph',graphController.home)
router.get('/graph/*',graphController.comingSoon)

module.exports = router