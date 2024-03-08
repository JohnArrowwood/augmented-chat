describe( 'UserInputController', function() {

    let bus = new GlobalMessageBus();
    let input;
    let controller;

    beforeEach( () => {
        input = document.createElement( 'textarea' );
        controller = new UserInputController( input );
    });

    afterEach( () => {} );

    test( 'clear input' )
    .given( 'the input has data in it' )
    .when(  'the CLEAR message is received' )
    .then(  'the element is cleared',
        function( done ) {
            input.value = 'anything';
            bus.emit( MessageType.USER_INPUT_CLEAR, null );
            setTimeout( () => {
                expect( input.value ).to.be.empty;
                done();
            }, 0 );
        }
    );

    test( 'clear conversation' )
    .given( 'the input has data in it' )
    .when(  'the CONVERSATION_CLEAR message is received' )
    .then(  'the element is cleared',
        function( done ) {
            input.value = 'anything';
            bus.emit( MessageType.CONVERSATION_CLEAR, null );
            setTimeout( () => {
                expect( input.value ).to.be.empty;
                done();
            }, 0 );
        }
    );

    test( 'get value' )
    .given( 'the input has data in it' )
    .when(  'get() is called' )
    .then(  'the content is returned',
        function() {
            input.value = 'something';
            expect( controller.get() ).to.equal( input.value );
        }
    );

    test( 'set value' )
    .given( 'the input has data in it' )
    .when(  'set() is called' )
    .then(  'the content is changed',
        function() {
            input.value = 'something';
            controller.set( 'new-value' )
            expect( controller.get() ).to.equal( 'new-value' );
        }
    );

    test( 'send on ENTER' )
    .given( 'the input has data in it' )
    .when(  'ENTER is typed' )
    .then(  'the send event is emitted',
        function( done ) {
            bus.emit( MessageType.CONVERSATION_ID, crypto.randomUUID() );
            input.value = 'something';
            const spy = sinon.spy();
            bus.subscribe( MessageType.USER_INPUT_SEND, spy );
            const event = new KeyboardEvent( 'keydown', { key: 'Enter', shiftKey: false } );
            input.dispatchEvent( event );
            expect( controller.get() ).to.be.empty;
            setTimeout( () => {
                expect( spy.calledOnce ).to.be.true;
                done();
            }, 0 );
        }
    );

    test( 'do not send on Shift-ENTER' )
    .given( 'the input has data in it' )
    .when(  'Shift-ENTER is typed' )
    .then(  'the send event is not emitted', 
        function( done ) {
            input.value = 'something';
            const spy = sinon.spy();
            bus.subscribe( MessageType.USER_INPUT_SEND, spy );
            const event = new KeyboardEvent( 'keydown', { key: 'Enter', shiftKey: true } );
            input.dispatchEvent( event );
            setTimeout( () => {
                // expect( controller.get() ).to.equal( "something\n" );
                expect( spy.calledOnce ).to.be.false;
                done();
            }, 0 );

        }
    );

    test( 'resize' )
    .given( 'several lines of text in the input' )
    .when(  'resize() is called' )
    .then(  'the height property is automatically adjusted',
        function() {
            input.value = "foo\nbar\nbaz";
            controller.resize();
            expect( input.style.height ).to.not.equal( 'auto' );
        }
    );

});