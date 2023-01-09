const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
const multer = require('multer')
const { graphqlHTTP } = require('express-graphql');

dotenv.config()

//  setting up mongoose
const mongoose = require("mongoose");
const connectionString = process.env.MONGO_CONNECT




const app = express()
const feedRouter = require('./routes/feedRoutes')
const authRouter = require('./routes/authRouter')
const graphqlSchema = require('./graphql/schema')
const graphqlResolver = require('./graphql/resolvers')

app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images')))

// setting up multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use(multer({storage: fileStorage, fileFilter,}).single('image'))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}))

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({
        message,
        data
    })
})

// Routes
app.use('/feed', feedRouter)
app.use('/auth', authRouter)

mongoose.set("strictQuery", true);
mongoose.connect(
    connectionString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log(err);
      }
  
      console.log("Successfully connected to MongoDB");
    }
  );

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`Server listening on port ${process.env.PORT}`)
})
