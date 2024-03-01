describe( 'Message', function() {

    let message;

    beforeEach( () => {
        message = new Message()
            .withSource( Source.USER )
            .withMessage( 'foo' );
    });

    test( 'automatic ID' )
    .given( 'a Message where ID has not been explicitly set' )
    .when(  'the ID is inspected' )
    .then(  'it has been initialized to a valid UUID', 
        function() {
            expect( message.id ).to.match( /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i );
        }
    );

    test( 'automated Date' )
    .given( 'a Message where Date has not been explicitly set' )
    .when(  'the date is inspected' )
    .then(  'it is within one second of the current time', 
        function() {
            const now = Date.now();
            expect( message.date <= now ).to.be.true;
            expect( (now - message.date) < 1000 ).to.be.true;
        }
    );

    // TODO: Add more test cases
    BDD.DISABLED
    .test( 'other contract details - TODO' )
    .given( '<precondition>' )
    .when(  '<action>' )
    .then(  '<validation>', 
        function() {

        }
    );

});