// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ), //Web framework
    bodyParser = require('body-parser'), //Parser for reading request body
    path = require( 'path' ), //Utilities for dealing with file paths
    mongoose = require( 'mongoose' ); //MongoDB integration

//Create server
var app = express();

//Where to serve static content
//app.use( express.static( path.join( application_root, 'site') ) );
//app.use(bodyParser());

//Start server
var port = 4711;

app.listen( port, function() {
   console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});

// Routes
app.get( '/api', function( request, response ) {
   response.send( 'Library API is running' );
});
//


//Connect to database
mongoose.connect( 'mongodb://localhost/library_database' );

//Schemas
var Keywords = new mongoose.Schema({
    keyword: String
});

//Schemas
var Book = new mongoose.Schema({
    title: String,
    author: String,
    releaseDate: Date,
    keywords: [ Keywords ] 
});

//Models
var BookModel = mongoose.model( 'Book', Book );

// Configure server
app.configure( function() {
    app.use( express.static( path.join( application_root, 'site') ) );
    app.use(bodyParser());
    
    //parses request body and populates request.body
    //app.use( express.bodyParser() );

    //checks request.body for HTTP method overrides
    app.use( express.methodOverride() );

    //perform route lookup based on url and HTTP method
    app.use( app.router );

    //Where to serve static content
    app.use( express.static( path.join( application_root, 'site') ) );

    //Show all errors in development
    app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//Get a list of all books
app.get( '/api/books', function( request, response ) {
    return BookModel.find( function( err, books ) {
        if( !err ) {
            return response.send( books );
        } else {
            return console.log( err );
        }
    });
});

//To test our API, we need to do a little typing in a JavaScript console. Restart node and go to localhost:4711 in your browser. Open up the JavaScript console.  In the console type the following:
//jQuery.get( '/api/books/', function( data, textStatus, jqXHR ) {
//    console.log( 'Get response:' );
//    console.dir( data );
//    console.log( textStatus );
//    console.dir( jqXHR );
//});

//Insert a new book
app.post( '/api/books', function( request, response ) {
    var book = new BookModel({
        title: request.body.title,
        author: request.body.author,
        releaseDate: request.body.releaseDate,
        keywords: request.body.keywords     
    });

    return book.save( function( err ) {
        if( !err ) {
            console.log( 'created' );
            return response.send( book );
        } else {
            console.log( err );
        }
    });
});

//Restart node and go back to the console and type:
//jQuery.post( '/api/books', {
//    'title': 'JavaScript the good parts',
//    'author': 'Douglas Crockford',
//    'releaseDate': new Date( 2008, 4, 1 ).getTime()
//}, function(data, textStatus, jqXHR) {
//    console.log( 'Post response:' );
//    console.dir( data );
//    console.log( textStatus );
//    console.dir( jqXHR );
//});
//
//..and then
//
//jQuery.get( '/api/books/', function( data, textStatus, jqXHR ) {
//    console.log( 'Get response:' );
//    console.dir( data );
//    console.log( textStatus );
//    console.dir( jqXHR );
//});

//Get a single book by id
app.get( '/api/books/:id', function( request, response ) {
    return BookModel.findById( request.params.id, function( err, book ) {
        if( !err ) {
            return response.send( book );
        } else {
            return console.log( err );
        }
    });
});

//jQuery.get( '/api/books/4f95a8cb1baa9b8a1b000006', function( data, textStatus, jqXHR ) {
//    console.log( 'Get response:' );
//    console.dir( data );
//    console.log( textStatus );
//    console.dir( jqXHR );
//});

//Update a book
app.put( '/api/books/:id', function( request, response ) {
    console.log( 'Updating book ' + request.body.title );
    return BookModel.findById( request.params.id, function( err, book ) {
        book.title = request.body.title;
        book.author = request.body.author;
        book.releaseDate = request.body.releaseDate;
        book.keywords = request.body.keywords;

        return book.save( function( err ) {
            if( !err ) {
                console.log( 'book updated' );
                return response.send( book );
            } else {
                console.log( err );
            }
        });
    });
});

//you will need to replace the id property with one that matches an item in your own database:
//jQuery.ajax({
//    url: '/api/books/4f95a8cb1baa9b8a1b000006',
//    type: 'PUT',
//    data: {
//        'title': 'JavaScript The good parts',
//        'author': 'The Legendary Douglas Crockford',
//        'releaseDate': new Date( 2008, 4, 1 ).getTime()
//    },
//    success: function( data, textStatus, jqXHR ) {
//        console.log( 'Put response:' );
//        console.dir( data );
//        console.log( textStatus );
//        console.dir( jqXHR );
//    }
//});

//Delete a book
app.delete( '/api/books/:id', function( request, response ) {
    console.log( 'Deleting book with id: ' + request.params.id );
    return BookModel.findById( request.params.id, function( err, book ) {
        return book.remove( function( err ) {
            if( !err ) {
                console.log( 'Book removed' );
                return response.send( '' );
            } else {
                console.log( err );
            }
        });
    });
});

//jQuery.ajax({
//    url: '/api/books/4f95a5251baa9b8a1b000001',
//    type: 'DELETE',
//    success: function( data, textStatus, jqXHR ) {
//        console.log( 'Delete response:' );
//        console.dir( data );
//        console.log( textStatus );
//        console.dir( jqXHR );
//    }
//});


//After adding the keyword subscema to Book schema try this in console
//jQuery.post( '/api/books', {
//    'title': 'Secrets of the JavaScript Ninja',
//    'author': 'John Resig',
//    'releaseDate': new Date( 2008, 3, 12 ).getTime(),
//    'keywords':[
//        { 'keyword': 'JavaScript' },
//        { 'keyword': 'Reference' }
//    ]
//}, function( data, textStatus, jqXHR ) {
//    console.log( 'Post response:' );
//    console.dir( data );
//    console.log( textStatus );
//    console.dir( jqXHR );
//});