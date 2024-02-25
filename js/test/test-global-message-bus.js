describe('GlobalMessageBus', function() {
    
    test( 'Is an Observable' )
    .given( 'a GlobalMessageBus' )
    .when(  'a subscriber is added' )
    .and(   'an event fired ' )
    .then(  'the object behaves exactly like an Observable', 
        function( done ) {
            const bus = new GlobalMessageBus();
            const callback = sinon.spy();
            const EVENT = Symbol( 'testEvent' );

            bus.subscribe( EVENT, callback);
            bus.emit( EVENT, { message: 'Hello World' } );
            setTimeout(() => {
                expect( callback.calledOnce ).to.be.true;
                expect( 
                    callback.calledWith(
                        sinon.match.has("detail", 
                            sinon.match.has("message", "Hello World")
                        )
                    )
                ).to.be.true;
                done();
            }, 0);
        }
    );

    test( 'Is a Singleton' )
    .given( 'a GlobalMessageBus' )
    .and(   'a second GlobalMessageBus' )
    .when(  'the objects are compared' )
    .then(  'they are the same object',
        function( done ) {
            const bus1 = new GlobalMessageBus();
            const bus2 = new GlobalMessageBus();
            expect( bus1 == bus2 ).to.be.true;
            done();
        }
    );

});
