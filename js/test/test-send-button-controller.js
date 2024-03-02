describe( 'SendButtonController', function() {

    let bus = new GlobalMessageBus();
    let button;
    let controller;

    beforeEach( () => {
        button = document.createElement( 'button' );
        controller = new SendButtonController( button );
    });

    afterEach( () => {} );

    test( 'click button' )
    .given( 'the button is associated to the controller' )
    .when(  'the button is clicked' )
    .then(  'the USER_INPUT_SEND event is generated',
        function( done ) {
            const callback = sinon.spy();
            bus.subscribe( MessageType.USER_INPUT_SEND, callback );
            button.click();
            setTimeout( () => {
                expect( callback.calledOnce ).to.be.true;
                done();
            }, 0 );
        }
    );

    test( 'enable' )
    .given( 'an initialized controller' )
    .and(   'the button is disabled' )
    .when(  'enable() is called' )
    .then(  'the button is enabled',
        function() {
            button.disabled = true;
            controller.enable();
            expect( button.disabled ).to.be.false;
        }
    );

    test( 'disable' )
    .given( 'an initialized controller' )
    .and(   'the button is enabled' )
    .when(  'disable() is called' )
    .then(  'the button is disabled',
        function() {
            button.disabled = false;
            controller.disable();
            expect( button.disabled ).to.be.true;
        }
    );

});