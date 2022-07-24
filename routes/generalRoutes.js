const {Router} = require('express')
const generalEndpoints = require('../controllers/generalEndpoints')

const router = Router()

router.get('/about',generalEndpoints.about)

module.exports = router