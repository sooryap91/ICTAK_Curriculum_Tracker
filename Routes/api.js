const express = require('express')
const router = express.Router();

const DATA = require('../models/user')
const userrequirement = require('../models/requirementform')
const curriculum = require('../models/curriculum')

const multer = require('multer')
const path = require('path');

const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/jwtVerify')

// multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });



router.post('/signup', async (req, res) => {
    try {
        let item = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        let user = await DATA.findOne({ email: req.body.email })
        if (!user) {
            const newuser = new DATA(item)
            const saveuser = await newuser.save()
            res.send(saveuser)
        }
        return res.json({ message: "Email already registered" });
    } catch (error) {
        console.log(error)
    }
})

router.post('/login', async (req, res) => {
    try {
        let user = await DATA.findOne({ email: req.body.email, password: req.body.password })
        let payload = {'email':req.body.email,'password':req.body.password}
        let token = jwt.sign(payload,'secretkey')

        if (!user) {
            
            return res.json({ message: "Invalid Credentials" });


        }
        // res.send(user)
        res.send({ 'token': token, 'email': user.email, 'password': user.password });


    } catch (error) {
        console.log(error)
    }
})
//admin delete
router.delete("/list/:id" , async(req,res)=>{
    try{
        
            const data = await curriculum.deleteOne(
                {
                    _id: req.params.id
                     })
            console.log("data deleted = ", data);//to view in terminal
            res.send(data);//to view in database
        }
        catch (e) {
            console.log(`delete error occured ${e}`);
        }
    })
    //Admin Edit
router.put('/adminedit', async (req, res) => {
    let id = req.body._id
    let item = {  //to fetch and save data from front end in server
        namereq: req.body.namereq,
        institution: req.body.institution,
        category: req.body.category,
        area: req.body.area,
        hours: req.body.hours,
        fileupload: req.body.fileupload

    }
    let updateData = { $set: item }

    await curriculum.findOneAndUpdate({ _id: id }, updateData)

    res.json();
})
//requirementform
router.post('/requirement', async (req, res) => {
    try {
        let item = {
            namereq: req.body.namereq,
            institution: req.body.institution,
            category: req.body.category,
            area: req.body.area,
            hours: req.body.hours,
            fileupload: req.body.fileupload

        }
        const newreq = new userrequirement(item)
        const savereq = await newreq.save()
        res.send(savereq)


    } catch (error) {
        console.log(error)
    }
})
//get single data by id admin side
router.get('/getdataid').get((req,res)=>{
   curriculum.findById(req.params.id,(error,data)=>{
    if(error){
        return next (error)
    
    }else{
        res.json(data)
    }
   })
})
//get data from admin
router.get('/reqlist', async (req, res) => {
    try {
        let list = await userrequirement.find({ "status": "notrespond" }).sort({"_id":-1})

        res.send(list)


    } catch (error) {
        console.log(error)
    }
})
router.get('/req/:id', async (req, res) => {
    try {
        let id = req.params.id
        const singlereq = await userrequirement.findById(id)
        res.send(singlereq)

    } catch (error) {
        console.log(error)
    }
})

//curriculum faculty
router.post('/curriculum',upload.single('file'), async (req, res) => {
    try {
        let item = {
            namereq: req.body.namereq,
            institution: req.body.institution,
            category: req.body.category,
            area: req.body.area,
            comments: req.body.comments,
            hours: req.body.hours,
            fileuploadname: req.file.filename,
            fileuploadpath: req.file.path

        }
        const newcur = new curriculum(item)
        const savecur = await newcur.save()
        res.send(savecur)


    } catch (error) {
        console.log(error)
    }
})

// requirement form status change  after respond
router.put('/statusupdate', async (req, res) => {
    let id = req.body._id
    let item = {  //to fetch and save data from front end in server
        status: req.body.status,

    }
    let updateData = { $set: item }

    await userrequirement.findOneAndUpdate({ _id: id }, updateData)

    res.json();
})

// get past curriculam

router.get('/currilist',verifyToken, async (req, res) => {
    try {
        let curr = await curriculum.find()
        res.send(curr)

    } catch (error) {
        console.log(error)
    }
})
//get curriculum from faculty(not approved)
router.get('/currfac', async (req, res) => {
    try {
        let currfa = await curriculum.find({ "status": "notapproved" })
        res.send(currfa)

    } catch (error) {
        console.log(error)
    }
})
//admin approved(status)
router.put('/curriculumstatus', async (req, res) => {
    let id = req.body._id
    let item = {  //to fetch and save data from front end in server
        status: req.body.status,

    }
    let updateData = { $set: item }

    await curriculum.findOneAndUpdate({ _id: id }, updateData)

    res.json();
})
//approved in  admin dashboard
router.get('/dashlists',verifyToken, async (req, res) => {
    try {
        let currdash = await curriculum.find({ "status": "approved" }).sort({_id:-1})

        res.send(currdash)
        
    } catch (error) {
        console.log(error)
    }
})
// faculty dashboard,admin dashboard
// curriclam approved count
router.get('/currapprovedcount', async (req, res) => {
    try {
        let currcount = await curriculum.find({ "status": "approved" }).count();
        res.json(currcount);

    } catch (error) {
        console.log(error)
    }
})
// curriculam notapproved count
router.get('/currnotapprovedcount', async (req, res) => {
    try {
        let currcount = await curriculum.find({ "status": "notapproved" }).count();
        res.json(currcount);

    } catch (error) {
        console.log(error)
    }
})
// requirement form pending count
router.get('/reqpendingcount', async (req, res) => {
    try {
        let reqcount = await userrequirement.find({ "status": "notrespond" }).count();
        res.json(reqcount);

    } catch (error) {
        console.log(error)
    }
})
// curriculam approved list
router.get('/approvedcurrilist',verifyToken, async (req, res) => {
    try {
        let currlist = await curriculum.find({ "status": "approved" })
        res.send(currlist)

    } catch (error) {
        console.log(error)
    }
})
//get single data by id admin side for editing anatharaman
router.get('/getdataid/:id', async (req, res) => {
    try {
        let id = req.params.id
        const singlecurredit = await curriculum.findById(id);
        res.send(singlecurredit);
        console.log(singlecurredit);
    } catch (error) {
        console.log(error)
    }
})

//curriculam edit admin side
router.put('/adminedit', async (req, res) => {
    try {
        let id = req.body._id
        let item = {  //to fetch and save data from front end in server
            namereq: req.body.namereq,
            institution: req.body.institution,
            category: req.body.category,
            area: req.body.area,
            hours: req.body.hours,

        }
        let updatecurriculum = { $set: item }

        await curriculum.findOneAndUpdate({ _id: id }, updatecurriculum)

        res.json();
    } catch (error) {
        console.log(error)
    }

})




// single curriculam for downloading

router.get('/singlecurr/:id', async (req, res) => {
    try {
        let id = req.params.id
        const singlecurr = await curriculum.findById(id)
        res.send(singlecurr)


    } catch (error) {
        console.log(error)
    }
})


//amal

// curriculam not approved list

router.get('/ncurrlist', async (req, res) => {
    try {
        let ncurrlist = await curriculum.find({ "status": "notapproved" })
        res.send(ncurrlist)

    } catch (error) {
        console.log(error)
    }
})



// get edit curriculam single

router.get('/singlecurriculam/:id', async (req, res) => {
    try {
        let id = req.params.id
        let curr = await curriculum.findById(id)
        res.send(curr)

    } catch (error) {
        console.log(error)
    }
})


//Faculty Edit
router.put('/faculedit', upload.single('file'), async (req, res) => {
    let id = req.body.id
    let item = {  //to fetch and save data from front end in server
        comments: req.body.comments,
        fileuploadname: req.file.filename,
        fileuploadpath: req.file.path

    }
    let updateData = { $set: item }

    await curriculum.findOneAndUpdate({ _id: id }, updateData)

    res.json();
})



module.exports = router;
