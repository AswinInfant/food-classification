const express = require('express');
const app = express();
const path = require('path');
const request = require('request');

const router = express.Router();
const upload = require('./uploadMiddleware');
const Resize = require('./Resize');

router.get('/', async function (req, res) {
  await res.render('index');
});

router.post('/post', upload.single('image'), async function (req, res) {
  const imagePath = path.join(__dirname, '/public/images');
  const fileUpload = new Resize(imagePath);
  if (!req.file) {
    res.status(401).json({error: 'Please provide an image'});
  }
  const filename = await fileUpload.save(req.file.buffer);
  //return res.status(200).json({ name: filename });

  let answer;
  var spawn = require("child_process").spawn;
	var process = spawn('python',["./image_processer.py"] );
	process.stdout.on('data', function(data) {
		//res.send(data.toString());
    setTimeout(function(){
      answer = data.toString();
      console.log(answer);
      var query = answer;
      request.get({
        url: 'https://api.calorieninjas.com/v1/nutrition?query='+query,
        headers: {
          'X-Api-Key': 'YXC9wHz0W/ebIP7HTJvnSA==6I0nMhcEbdoFzA5R'
        },
      }, function(error, response, body) {
      if(error) return console.error('Request failed:', error);
      else if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
      //else return res.status(200).json({ foodname: answer, food_Details: body.toString()});
      else {
        let cal = JSON.parse(body);

        let final = {
                      "calories": cal.items[0].calories,
                      "sugar": cal.items[0].sugar_g,
                      "name": cal.items[0].name,
                      "fiber": cal.items[0].fiber_g,
                      "protein": cal.items[0].protein_g,
                      "carbohydrates": cal.items[0].carbohydrates_total_g,
                      "fat":cal.items[0].fat_total_g,
                      "size":cal.items[0].serving_size_g
                    };
        console.log(final);
        res.render('details', {'docs':final});
      }
    });
    }, 500);
	} )
});

module.exports = router;