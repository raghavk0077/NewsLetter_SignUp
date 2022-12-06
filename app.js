const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
})

app.post('/', function(req, res){
    const firstname = req.body.fName;
    const lastname = req.body.lName;
    const email = req.body.email;


    //way we can send data to mailchimp servers
    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };

    //stringify the javascript object
    const jsonData = JSON.stringify(data);

    //https options
    const options = {
        method: 'POST',
        auth: 'raghav13:538546363284f599454f9fe9989a30aa-us21'
    }

    const url = "https://us21.api.mailchimp.com/3.0/lists/eac598d236"

    const request1 = https.request(url, options, function(response){
        response.on('data', function(data){
            console.log(JSON.parse(data));
        })

        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        }
        else{
            res.sendFile(__dirname + '/failure.html')
        }
    })

    request1.write(jsonData);
    request1.end();
})

app.post('/failure', function(req, res){
    res.redirect('/');
})

app.listen(Process.env.PORT || 3000, function(){
    console.log("Server is listening at port 3000");
})


//list id
// eac598d236

// api Key
// 538546363284f599454f9fe9989a30aa-us21