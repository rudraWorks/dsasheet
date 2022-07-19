const contentControllers = require('../controllers/contentControllers')
const {Router}  = require('express')

const contentRouter = Router() 

contentRouter.get('/striverSheet',contentControllers.striverSheet)
contentRouter.post('/checkQuestion',contentControllers.checkQuestion)
contentRouter.post('/getNotes',contentControllers.getNotes)
contentRouter.post('/saveNote',contentControllers.saveNote)
contentRouter.post('/likeQuestion',contentControllers.likeQuestion)

module.exports = contentRouter