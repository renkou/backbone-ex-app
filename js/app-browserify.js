// es5 polyfills, powered by es5-shim
require("es5-shim")

// es6 polyfills, powered by babel
require("babel/polyfill")

var Promise = require('es6-promise').Promise

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');


// just Node?
// var fetch = require('node-fetch')
// Browserify?
// require('whatwg-fetch') //--> not a typo, don't store as a var

// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
    // start app
    // new Router()
// }

// Backbone Model (properties each instance will have)

var Blog = Backbone.Model.extend({
	defaults: {
		author: '',
		title: '',
		url: ''
	}
});

//Backbone Collection (Collection of models)

var Blogs = Backbone.Collection.extend({

});

//Test Blogs

// var blog1 = new Blog({
// 	author: 'Steven',
// 	title: 'Steven\'s Blog',
// 	url: 'http://stevensblog.com'
// });

// var blog2 = new Blog({
// 	author: 'Peter',
// 	title: 'Peter\'s Blog',
// 	url: 'http://petersblog.com'
// });

// Instantiate a Collection

var blogs = new Blogs();

//Backbone Views

//Backbone view for one blog
var BlogView = Backbone.View.extend({
	model: new Blog(), //When new Blog is created, View will use it
	tagName: 'tr', //each new blog will have a table row

	initialize: function() {
		this.template = _.template($('.blogs-list-template').html()); 
		//this.template accesses the html of the script template class 'blogs-list-template'
		//template used for markup language or HTML
	},

	events: {
		'click .edit-blog': 'edit', //when edit button clicked, run function edit
		'click .update-blog': 'update',
		'click .cancel': 'cancel',
		'click .delete-blog': 'delete'
	},

	edit: function() {
		$('.edit-blog').hide();
		$('.delete-blog').hide();
		this.$('.update-blog').show();
		this.$('.cancel').show();

		var author = this.$('.author').html();
		var title = this.$('.title').html();
		var url = this.$('.url').html();

		this.$('.author').html('<input type="text" class="form-control author-update" value="' + author + '">');
		this.$('.title').html('<input type="text" class="form-control title-update" value="' + title + '">');
		this.$('.url').html('<input type="text" class="form-control url-update" value="' + url + '">');
	},

	update: function() {
		this.model.set('author', $('.author-update').val());
		this.model.set('title', $('.title-update').val());
		this.model.set('url', $('.url-update').val());
	},

	cancel: function() {
		blogsView.render(); //re-renders page with same values
	},

	delete: function(){
		this.model.destroy(); //destroys the selected/current individual blog
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		//this.$el = tr or a single table row
		//insert this.template into the tr's html properties
		//{model: this.model.toJSON()} is used to populate the template script's html (author, title, url)
		//refer to the Blog model above to see what properties are being filled in the <% %>
		return this;

	}
});

//Backbone view for all blogs
var BlogsView = Backbone.View.extend({
	model: blogs,
	el: $('.blogs-list'), //creating new tr for each item in blog collection

	initialize: function() {
		var self = this;
		this.model.on('add', this.render, this); //every time a blog is added to the blogs collection, render this view (BlogsView) in 'this'(the window)
		//this.render calls the render function below
		
		this.model.on('change', function() {
			setTimeout(function() {
				self.render();
			}, 30);
		}, this); //run on change or edit, call to render new values after 30 millisecs

		this.model.on('remove', this.render, this); //re-render the page after item has been destroyed
	},

	render: function() {
		var self = this;
		this.$el.html(''); //this.$el refers to the .blogs-list, empties it

		//this.model refers to the above model: blogs, toArray changes it into usable data
		_.each(this.model.toArray(), function(blog) { //function(blog) = for each individual blog
			self.$el.append((new BlogView({model: blog})).render().$el);
			// new BlogView({model:blog}) creates a new BlogView following the model of the current blog recieved in the function and fills the model and tagName
			// .render() uses the render function in the BlogView ro render the .$el or the current view
		});
		//the _.each goes through each blog in the blogs collection and renders each tr or view or BlogView into this view
		return this;
	}
});

var blogsView = new BlogsView();

//when document is all ready and loaded up, run this
// this code is the interaction (add, edit, delete button)
$(document).ready(function(){
	//add button event
	$('.add-blog').on('click', function() {
		var blog = new Blog({
			author: $('.author-input').val(),
			title: $('.title-input').val(),
			url: $('.url-input').val(),
		});
		
		//clears the input box after adding
		$('.author-input').val(''); 
		$('.title-input').val('');
		$('.url-input').val('');
		blogs.add(blog); // adds the newly created blog to the instantiated blogs collection, not Blogs
	});
});


























