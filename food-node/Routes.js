const multer = require("multer");
const connect = require("./Connect");
const connectBook = require("./ConnectBookTable")
const connectOTP = require("./ConnectOTP")
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json())
app.use(cors())
var chefImgConnection = require("./MongooseConnection");










//nodemailer------------------------------------------------------------------------------------
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
    auth: {
      user: 'anshsaini27@gmail.com',
      pass: 'kusxqlfijlvfptqd'
    }
  });
  
//   // Example email message options
//   const mailOptions = {
//     from: 'anshsaini27@gmail.com',
//     to: 'proper.pri@gmail.com',
//     subject: 'Test email from Node.js',
//     text: 'Hello world!'
//   };
  
//   // Send the email message
//   transporter.sendMail(mailOptions, function(error, info) {
//     if (error) {
//       console.error(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });

//send email api------------------------------------------------------------------------------
app.post("/send-email",(req,res)=>{
    const { recipient, subject, message } = req.body;
  
    const mailOptions = {
      from: 'anshsaini27@gmail.com',
      to: recipient,
      subject: subject,
      text: message,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully');
      }
    })
    
  })




// contact page------------------------------------------------------------------
// api for contact page form insertion
app.post("/ContactPageInsert", async(req,res)=>{
    var collection = await connect();
    let result = await collection.insertOne(req.body)
    res.send(result);
})

// api for getting all the database from contact page
app.get("/ContactAdminQuery", async(req,res)=>{
    var collection = await connect();
    let result = await collection.find().toArray();
    res.send(result);
})


//api to delete selected data from admin query page
app.post("/ContactAdminQueryDel", async(req,res)=>{
    var collection = await connect();
    var result = await collection.deleteOne(req.body)
    res.send(result)
}) 

app.post("/ContactAdminViewQuery", async(req,res)=>{
    var collection = await connect();
    var result = await collection.findOne(req.body)
    res.send(result)
}) 

//login page _----------------------------------------------------------------------
//otp connection api
app.post("/sendLoginOTP" , async(req,res)=>{
  var collection = await connectOTP();
  var result = await collection.insertOne(req.body);
  res.send(result);
})

// book table page-----------------------------------------------------------

//insertion api for booking table
app.post("/BookTableInsert", async(req,res)=>{
    var collection = await connectBook();
    var result  = await collection.insertOne(req.body);
    res.send(result)
})

app.get("/Bookings", async(req,res)=>{
    var collection = await connectBook();
    let result = await collection.find().toArray();
    res.send(result);
})

app.post("/BookingDel", async(req,res)=>{
  var collection = await connectBook();
  var result = await collection.deleteOne(req.body)
  res.send(result)
}) 

app.post("/ViewBooking", async(req,res)=>{
  var collection = await connectBook();
  var result = await collection.findOne(req.body)
  res.send(result)
}) 

// admin upload images for chef-----------------------------------------------------

  //multer upload folder creation
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
}).single("user_file");

//api
app.post("/uploadImgChef", upload, async (req, res) => {
 // mongodb code
  const { filename } = req.file;
  const { fname } = req.body;
  const { position } = req.body;
  const { details } = req.body;
  const ProductModel = await chefImgConnection();
  let data = new ProductModel({ imgpath: filename, fname: fname,position:position,details:details });
  let result = await data.save();
  res.send(result);
});

// to acces uploads folder publicly on this port------------------------------------------------------
app.use("/uploads", express.static("./uploads"));

// //get all the data of chef 

app.get("/getChef",async(req,res)=>{
  const ProductModel = await chefImgConnection();
  var result = await ProductModel.find()
  res.send(result)  
});


app.listen(5000)