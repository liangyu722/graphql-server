const express = require('express');
const graphqlHTTP = require('express-graphql')
const mongoose = require('mongoose')
const schema = require('./schema/schema')
const app = express();
const port = process.env.PORT || 4000

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema

}))

mongoose.connect('mongodb+srv://liangyu42087:132087@cluster0-m1ngw.mongodb.net/test?retryWrites=true&w=majority', 
{useUnifiedTopology: true, useNewUrlParser: true})
mongoose.connection.once('open', () => {
    console.log('Yes, we are connected')
})

app.listen(port, () => {
    console.log('listening for requests on my awesome port 4000');
})