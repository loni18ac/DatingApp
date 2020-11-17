const express = require('express')
//Vi importerer express
const app = express()
//server sættes til at kalde på express
const port = 4000
//vi vælger port 4000, vi kunne også vælge fx 5000

var router = require('./Routes/router')

app.use('/routes', router)


app.get('/', (req,res) => {
    res.sendFile(__dirname + '/Client/Views/index.html');
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


//login controller nedenfor
function loginController(req, res) {
    //Normalt vil man kigge om password og brugernavn stemmer, men det springer vi over
    //normalt vil man gemme secret key et andet sted. 
    //Her laves en token, som dør om en time (no access)
    const token = jwt.sign({user}, 'my_secret', { expiresIn: '1h' })
    res.json({
        token: token
    })
}

module.exports = loginController