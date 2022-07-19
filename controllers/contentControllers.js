const quests= require('../models/questions')
const Notes = require('../models/notes')
const CompletedQuestions = require('../models/completedquestions')
const LikedQuestions = require('../models/likedquestions')


module.exports.striverSheet = async(req,res) =>{
    const q = await quests.find({})
    


    let trieDone=0,graphDone=0,bstDone=0,btDone=0,stringDone=0,sqDone=0,heapDone=0,bsDone=0,recBackDone=0,recDone=0,greedyDone=0,arrLLDone=0,LLDone=0,arrDone=0,dpDone=0 

    let questionsDoneInEachCategory=[arrDone,LLDone,arrLLDone,greedyDone,recDone,recBackDone,bsDone,sqDone,heapDone,btDone,bstDone,graphDone,dpDone,trieDone,stringDone]

    if(!res.locals.isAuthenticated)
    return res.render('striverSheet',{que:q,doneArr:[],likedQuestionsArr:[],questionsDoneInEachCategory,totalCompletedQuestions:0,percentageOfQuestionsDone:0})

    let fetchedCompletedQuestions = await CompletedQuestions.find({email:res.locals.user})
    let totalCompletedQuestions = fetchedCompletedQuestions.length
    let doneArr=[]
    for(let i=0;i<fetchedCompletedQuestions.length;++i)
    {
        doneArr.push(fetchedCompletedQuestions[i].qid)
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='array')
            ++arrDone 
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='linkedList')
            ++LLDone 
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='linkedListAndArrays')
            ++arrLLDone 
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='greedy')
            ++greedyDone 
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='recursion')
            ++recDone 
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='recursionAndBacktracking')
            ++recBackDone 
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='binarySearch')
            ++bsDone
        
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='heap')
            ++heapDone 
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='stackAndQueue')
            ++sqDone 
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='binaryTree')
            ++btDone 
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='binarySearchTree')
            ++bstDone 
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='graph')
            ++graphDone
        if((await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='dp')
            ++dpDone
        if( (await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='trie')
            ++trieDone
        if( (await quests.findOne({qid:fetchedCompletedQuestions[i].qid})).cat=='string')
         ++stringDone
            
    }
    
    let fetchedLikedQuestions = await LikedQuestions.find({email:res.locals.user})
    let likedQuestionsArr=[]
    for(let i=0;i<fetchedLikedQuestions.length;++i)
    likedQuestionsArr.push(fetchedLikedQuestions[i].qid)
    //trie-7, dp-15, graph-11, bst-22, bt-27, string-12, sq-17, heap-6, bs-8, rec&back-6, rec-6, greedy-6, a&l-6, ll-12,arr-24   

    questionsDoneInEachCategory=[100*arrDone/24,100*LLDone/12,100*arrLLDone/6,100*greedyDone/6,100*recDone/6,100*recBackDone/6,100*bsDone/8,100*sqDone/17,100*heapDone/6,100*btDone/27,100*bstDone/22,100*graphDone/11,100*dpDone/15,100*trieDone/7,100*stringDone/26]

    for(let i=0;i<questionsDoneInEachCategory.length;++i)
        questionsDoneInEachCategory[i]=questionsDoneInEachCategory[i].toFixed(0)
    console.log(questionsDoneInEachCategory)
    res.render('striverSheet',{que:q,doneArr,likedQuestionsArr,questionsDoneInEachCategory,totalCompletedQuestions,percentageOfQuestionsDone:(100*totalCompletedQuestions/185).toFixed(0)})
}

module.exports.checkQuestion = async (req,res) => {

    if(!res.locals.isAuthenticated)
    {   
        return res.json({error:"Please login to save your progress."})
    }
    const {qid,done}=req.body

    let fetchedCompletedQuestions = await CompletedQuestions.find({email:res.locals.user})

    let doneArr=[]
    for(let i=0;i<fetchedCompletedQuestions.length;++i)
    doneArr.push(fetchedCompletedQuestions[i].qid)

    if(doneArr.includes(qid) && done==false)
        await CompletedQuestions.deleteOne({qid:qid,email:res.locals.user})
    

    else if(done==true && !doneArr.includes(qid))
        await CompletedQuestions.create({qid:qid,email:res.locals.user})


    return res.json({qid,done})
} 

module.exports.getNotes = async (req,res)=>{
    const {qid} = req.body
    
    let fetchedNote = await Notes.findOne({email:res.locals.user,qid:qid})
    if(fetchedNote)
    fetchedNote=fetchedNote.note
    return res.json({notes:fetchedNote})
}

module.exports.saveNote = async (req,res)=>{

    if(!res.locals.user)
    return res.json({error:"Please login!"})
    let {qid,noteToBeSaved}=req.body 

    console.log(qid+" "+res.locals.user)
    let fetchedNote=await Notes.findOneAndUpdate(
        {
            qid:qid,
            email:res.locals.user
        },
        {
            "$set":{note:noteToBeSaved}
        }
    )

    if(!fetchedNote){
        await Notes.create({qid:qid,email:res.locals.user,note:noteToBeSaved})
    }
    res.json({qid,noteToBeSaved:fetchedNote})
}

module.exports.likeQuestion = async (req,res)=>{
    
    const {qid,status} = req.body
    
    if(!res.locals.isAuthenticated)
    {   
        return res.json({error:"Please login to save your progress."})
    }
  

    let fetchedLikedQuestions = await LikedQuestions.find({email:res.locals.user})

    let likedQuestionsArr=[]
    for(let i=0;i<fetchedLikedQuestions.length;++i)
    likedQuestionsArr.push(fetchedLikedQuestions[i].qid)

    if(likedQuestionsArr.includes(qid) && status=='notLiked')
        await LikedQuestions.deleteOne({qid:qid,email:res.locals.user})
    

    else if(status=='liked' && !likedQuestionsArr.includes(qid))
        await LikedQuestions.create({qid:qid,email:res.locals.user})

    let message 
    if(status=='liked')
        message="Yeah! you liked this question"
    else 
        message=false
    res.json({message})
}