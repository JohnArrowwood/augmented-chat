describe( 'Message', function() {

    let init;

    beforeEach( () => {
        init = {
            id: crypto.randomUUID(),
            conversation_id: crypto.randomUUID(),
            created_date: Date.now(),
            source: Source.USER,
            message: "foo"
        };
    });

    describe( 'Constructor', function() {

        test( 'creates immutable object' )
        .given( 'a properly initialized Message' )
        .when(  'inspected' )
        .then(  'the object will be frozen/immutable', 
            function() {
                const message = new Message( init );
                expect( Object.isFrozen(message) ).to.be.true;
            }
        )

        test( 'default constructor' )
        .given( 'no parameters to the constructor' )
        .when(  'a Message is constructed' )
        .then(  'an error is thrown', 
            function () {
                expect( () => new Message() ).to.throw();
            }
        );

        test( 'id omitted' )
        .given( 'everything but id is provided' )
        .when(  'a Message is constructed' )
        .then(  'a default id is generated', 
            function() {
                delete init.id;
                const message = new Message( init );
                ValidateMessage( message )
                    .id_is_uuid
                    .validate();
            }
        );

        test( 'id provided' )
        .given( 'everything including id is provided' )
        .when(  'a Message is constructed' )
        .then(  'the provided id is used', 
            function() {
                const message = new Message( init );
                ValidateMessage( message )
                    .id_is( init.id )
                    .validate();
            }
        );

        test( 'id malformed' )
        .given( 'id is not a UUID string' )
        .when(  'a Message is constructed' )
        .then(  'an error is thrown', 
            function() {
                init.id = "not-a-uuid";
                expect( () => new Message( init ) ).to.throw();
            }
        );

        test( 'conversation_id omitted' )
        .given( 'everything but conversation_id is provided' )
        .when(  'a Message is constructed' )
        .then(  'an error is thrown', 
            function () {
                delete init.conversation_id;
                expect( () => new Message( init ) ).to.throw();
            }
        );

        test( 'conversation_id provided' )
        .given( 'everything is provided' )
        .when(  'a Message is constructed' )
        .then(  'provided conversation_id is used', 
            function() {
                const message = new Message( init );
                ValidateMessage( message )
                    .conversation_id_is( init.conversation_id )
                    .validate();
            }
        );

        test( 'conversation_id malformed' )
        .given( 'conversation_id is not a UUID string' )
        .when(  'a Message is constructed' )
        .then(  'an error is thrown', 
            function() {
                init.conversation_id = "not-a-uuid";
                expect( () => new Message( init ) ).to.throw();
            }
        );

        test( 'created_date omitted' )
        .given( 'everything but created_date is provided' )
        .when(  'a Message is constructed' )
        .then(  'the created_date is initialized to the current Date and time', 
            function() {
                delete init.created_date;
                const message = new Message( init );
                ValidateMessage( message )
                    .created_date_is_within( 10 )
                    .validate();
            }
        );

        test( 'created_date provided' )
        .given( 'everything is provided' )
        .when(  'a Message is constructed' )
        .then(  'the provided created_date is used', 
            function() {
                init.created_date = Date.now() - 123456;
                const message = new Message( init );
                ValidateMessage( message )
                    .created_date_is( init.created_date )
                    .validate();
            }
        );

        test( 'created_date malformed' )
        .given( 'id is not a number' )
        .when(  'a Message is constructed' )
        .then(  'an error is thrown', 
            function() {
                init.created_date = "2024-01-02 12:34:56";
                expect( () => new Message( init ) ).to.throw();
            }
        );

        test( 'source omitted' )
        .given( 'everything but source is provided' )
        .when(  'a Message is constructed' )
        .then(  'an error is thrown', 
            function () {
                delete init.source;
                expect( () => new Message( init ) ).to.throw();
            }
        );

        test( 'source provided' )
        .given( 'everything is provided' )
        .when(  'a Message is constructed' )
        .then(  'the provided source is used', 
            function () {
                init.source = Source.AUGMENTED;
                const message = new Message( init );
                ValidateMessage( message )
                    .source_is( init.source )
                    .validate();
            }
        );

        test( 'source wrong type' )
        .given( 'a source string instead of a symbol' )
        .when(  'a Message is constructed' )
        .then(  'an error is thrown', 
            function () {
                init.source = 'not-a-symbol';
                expect( () => new Message( init ) ).to.throw();
            }
        );

        test( 'source unrecognized' )
        .given( 'a source symbol that is not known' )
        .when(  'a Message is constructed' )
        .then(  'an error is thrown', 
            function () {
                init.source = Symbol('unique');
                expect( () => new Message( init ) ).to.throw();
            }
        );

        test( 'message omitted' )
        .given( 'everything but message is provided' )
        .when(  'a Message is constructed' )
        .then(  'an error is thrown', 
            function () {
                delete init.message;
                expect( () => new Message( init ) ).to.throw();
            }
        );

        test( 'message empty' )
        .given( 'message is empty' )
        .when(  'a Message is constructed' )
        .then(  'an error is thrown', 
            function () {
                init.message = "";
                expect( () => new Message( init ) ).to.throw();
            }
        );

        test( 'message provided' )
        .given( 'everything is provided' )
        .when(  'a Message is constructed' )
        .then(  'the provided message is used', 
            function () {
                const message = new Message( init );
                ValidateMessage( message )
                    .message_is( init.message )
                    .validate();
            }
        );

        test( 'extraneous init fields ignored' )
        .given( 'the initialization object has extra fields' )
        .when(  'a Message is constructed' )
        .then(  'the extraneous fields have no effect',
            function() {
                init.foo = "bar";
                const message = new Message( init );
                ValidateMessage( message )
                    .id_is( init.id )
                    .conversation_id_is( init.conversation_id )
                    .created_date_is( init.created_date )
                    .source_is( init.source )
                    .message_is( init.message )
                    .validate();
            }
        );

    });

    describe( 'Getters', function() {

        // NOTE: Everything in this section is redundant
        // as the MessageValidator exercises the getters
        // but this will help isolate any getter related problems

        test( 'get id' )
        .given( 'an initialized Message' )
        .when(  'the id getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const message = new Message( init );
                expect( message.id ).to.equal( init.id );
            }
        );

        test( 'get conversation_id' )
        .given( 'an initialized Message' )
        .when(  'the conversation_id getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const message = new Message( init );
                expect( message.conversation_id ).to.equal( init.conversation_id );
            }
        );

        test( 'get created_date' )
        .given( 'an initialized Message' )
        .when(  'the created_date getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const message = new Message( init );
                expect( message.created_date ).to.equal( init.created_date );
            }
        );

        test( 'get source' )
        .given( 'an initialized Message' )
        .when(  'the source getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const message = new Message( init );
                expect( message.source ).to.equal( init.source );
            }
        );

        test( 'get message' )
        .given( 'an initialized Message' )
        .when(  'the message getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const message = new Message( init );
                expect( message.message ).to.equal( init.message );
            }
        );

    });

    describe( 'Fluent but immutable initialization', function() {

        test( 'withId' )
        .given( 'a Message' )
        .when(  'calling .withId' )
        .then(  'a new Message is returned', 
            function() {
                const new_id = crypto.randomUUID();
                const message1 = new Message( init );
                const message2 = message1.withId( new_id );
                expect( message1 ).to.not.equal( message2 );
                expect( message1.id ).to.not.equal( message2.id );
            }
        );

        test( 'withConversationId' )
        .given( 'a Message' )
        .when(  'calling .withConversationId' )
        .then(  'a new Message is returned', 
            function() {
                const new_id = crypto.randomUUID();
                const message1 = new Message( init );
                const message2 = message1.withConversationId( new_id );
                expect( message1 ).to.not.equal( message2 );
                expect( message1.conversation_id ).to.not.equal( message2.conversation_id );
            }
        );

        test( 'withCreatedDate' )
        .given( 'a Message' )
        .when(  'calling .withCreatedDate' )
        .then(  'a new Message is returned', 
            function() {
                const new_date = Date.now() - 123456;
                const message1 = new Message( init );
                const message2 = message1.withCreatedDate( new_date );
                expect( message1 ).to.not.equal( message2 );
                expect( message1.created_date ).to.not.equal( message2.created_date );
            }
        );

        test( 'withSource' )
        .given( 'a Message' )
        .when(  'calling .withSource' )
        .then(  'a new Message is returned', 
            function() {
                const new_source = Source.STRONG;
                const message1 = new Message( init );
                const message2 = message1.withSource( new_source );
                expect( message1 ).to.not.equal( message2 );
                expect( message1.source ).to.not.equal( message2.source );
            }
        );

        test( 'withMessage' )
        .given( 'a Message' )
        .when(  'calling .withMessage' )
        .then(  'a new Message is returned', 
            function() {
                const new_message = 'bar';
                const message1 = new Message( init );
                const message2 = message1.withMessage( new_message );
                expect( message1 ).to.not.equal( message2 );
                expect( message1.new_message ).to.not.equal( message2.message );
            }
        );

    });

    describe( 'Factory', function() {

        test( 'basic factory' )
        .given( 'a valid initialization object' )
        .when(  'factory method is called' )
        .then(  'an object is properly created', 
            function() {
                const message = Message.from( init );
                ValidateMessage( message )
                    .id_is( init.id )
                    .conversation_id_is( init.conversation_id )
                    .created_date_is( init.created_date )
                    .source_is( init.source )
                    .message_is( init.message )
                    .validate();

            }
        );

        test( 'factory from Message' )
        .given( 'a valid Message object' )
        .when(  'factory method is called' )
        .then(  'a new Message object is created', 
            function() {
                const message1 = Message.from( init );
                const message2 = Message.from( message1 );
                ValidateMessage( message1 )
                    .id_is( init.id )
                    .conversation_id_is( init.conversation_id )
                    .created_date_is( init.created_date )
                    .source_is( init.source )
                    .message_is( init.message )
                    .validate();
                ValidateMessage( message2 )
                    .id_is( init.id )
                    .conversation_id_is( init.conversation_id )
                    .created_date_is( init.created_date )
                    .source_is( init.source )
                    .message_is( init.message )
                    .validate();
                expect( message1 ).to.not.equal( message2 );
            }
        );

    });
});