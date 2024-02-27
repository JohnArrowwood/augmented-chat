describe('Observable', function() {
    let observable;
    let callback;
    let anotherCallback;
    const EVENT = Symbol( 'testEvent' );
    const ANOTHER_EVENT = Symbol( 'otherEvent' );
    
    beforeEach(function() {
        observable = new Observable();
        callback = sinon.spy();
        anotherCallback = sinon.spy();
    });

    test( 'Subscribe' )
    .given( 'an observable' )
    .when(  'a user subscribes' )
    .and(   'the corresponding event is triggered' )
    .then(  'the callback is called', function( done ) {
        observable.subscribe( EVENT, callback);
        observable.emit( EVENT, { message: 'Hello World' } );
        setTimeout(() => {
            expect( callback.calledOnce ).to.be.true;
            done();
        }, 0);
    });

    test( 'Event Detail' )
    .given( 'an observable' )
    .when(  'a user subscribes' )
    .and(   'the corresponding event is triggered' )
    .and(   'the callback is called' )
    .then(  'the event has the expected detail', function( done ) {
        observable.subscribe( EVENT, callback);
        observable.emit( EVENT, { message: 'Hello World' } );
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
    });

    test( 'Unsubscribe' )
    .given( 'an observable' )
    .and(   'a subscribed listener' )
    .when(  'the listener unsubscribes' )
    .and(   'an event is emitted' )
    .then(  'the callback should not be called', function(done) {
        observable.subscribe( EVENT, callback );
        observable.unsubscribe( EVENT, callback );

        observable.emit( EVENT, { message: 'Hello World' } );

        setTimeout(() => {
            expect( callback.called ).to.be.false;
            done();
        }, 0);
    });

    test( 'Multiple Listeners' )
    .given( 'an observable' )
    .and(   'two separate listeners to the same event' )
    .when(  'an event fires' )
    .then(  'both listeners are called', function(done) {
        const anotherCallback = sinon.spy();

        observable.subscribe( EVENT, callback );
        observable.subscribe( EVENT, anotherCallback );

        observable.emit( EVENT, { message: 'Hello again' });

        setTimeout(() => {
            expect(callback.calledOnce).to.be.true;
            expect(anotherCallback.calledOnce).to.be.true;
            done();
        }, 0);
    });

    test( 'Event Differentiation' )
    .given( 'an observable' )
    .and(   'a listener for one event' )
    .and(   'a listener on another event' )
    .when(  'an event fires for one event' )
    .and(   'not the other' )
    .then(  'only the intended listener fires', function(done) {
        observable.subscribe( EVENT, callback );
        observable.subscribe( ANOTHER_EVENT, anotherCallback );

        observable.emit( EVENT, { message: 'Event handling' });

        setTimeout(() => {
            expect( callback.calledOnce ).to.be.true;
            expect( anotherCallback.calledOnce ).to.be.false;
            done();
        }, 0);
    });

    test( 'begin()' )
    .given( 'an observable' )
    .when(  'the begin method is called' )
    .then(  'a "begin" event should be triggered', function(done) {
        observable.subscribe( MessageType.TRANSACTION_BEGIN, callback );
        observable.begin();
        setTimeout( () => {
            expect( callback.calledOnce ).to.be.true;
            done();
        }, 0);
    });

    test( 'end()' )
    .given( 'an observable' )
    .when(  'the end method is called' )
    .then(  'an "end" event should be triggered', function(done) {
        observable.subscribe( MessageType.TRANSACTION_END, callback );
        observable.end();
        setTimeout(() => {
            expect( callback.calledOnce ).to.be.true;
            done();
        }, 0);
    });

    test( 'MessageType.EVERYTHING' )
    .given( 'an observable' )
    .and(   'a subscriber on the TRANSACTION_BEGIN event' )
    .and(   'a subscriber on the EVERYTHING event' )
    .when(  '.begin() is called' )
    .then(  'both event handlers receive a notification', 
        function( done ) {
            observable.subscribe( MessageType.TRANSACTION_BEGIN, callback );
            observable.subscribe( MessageType.EVERYTHING, callback );
            observable.begin();
            setTimeout( () => {
                expect( callback.calledTwice ).to.be.true;
                done();
            }, 0 );
        }
    );
});
