var app = app || {};

app.Book = Backbone.Model.extend({
    parse: function(response){
    	response.id = response._id;
    	return response;
    },
    defaults: {
        coverImage: 'img/placeholder.png',
        title: 'No title',
        author: 'Unknown',
        releaseDate: 'Unknown',
        keywords: 'None'
    }
});
