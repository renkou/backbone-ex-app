var express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    request = require('request'),
    session = require('express-session'),
    csrf = require('csurf'),
    override = require('method-override'),
    bodyParser = require('body-parser'),
    $ = require('jquery'),
    _ = require('underscore');

function startServer() {
console.log(process);
// mongoose.connect(process.MONGOLAB_URI);

var Schema = mongoose.Schema;

var BlogSchema = new Schema({
    author: String,
    title: String,
    url: String
});

mongoose.model('Blog', BlogSchema);

var Blog = mongoose.model('Blog');

// var blog = new Blog({
//     author: 'Michael',
//     title: 'Michael\'s Blog',
//     url: 'http://michaelsblog.com'
// });

// blog.save();

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '')));

// ROUTES

app.get('/api/blogs', function(req, res) {
    Blog.find(function(err, docs) {
        docs.forEach(function(item) {
            console.log("Received a GET request for _id: " + item._id);
        })
        res.send(docs);
    });
});

app.post('/api/blogs', function(req, res) {
    console.log('Received a POST request:')
    for (var key in req.body) {
        console.log(key + ': ' + req.body[key]);
    }
    var blog = new Blog(req.body); //.body comes from the body-parser
    blog.save(function(err, doc) {
        res.send(doc);
    });
});

app.delete('/api/blogs/:id', function(req, res) {
    console.log('Received a DELETE request for _id: ' + req.params.id);
    Blog.remove({_id: req.params.id}, function(err, doc) {
        res.send({_id: req.params.id});
    });
});

app.put('/api/blogs/:id', function(req, res) {
    console.log('Received an UPDATE request for _id: ' + req.params.id);
    Blog.update({_id: req.params.id}, req.body, function(err) {
        res.send({_id: req.params.id});
    });
});

app.set('port', process.argv[3] || process.env.PORT || 5000)

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'))
})

}
module.exports.startServer = startServer;