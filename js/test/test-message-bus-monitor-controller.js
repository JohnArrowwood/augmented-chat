describe( "MessageBusMonitorController", () => {

    test( 'happy path' )
    .given( 'an initialized monitor' )
    .when(  'a message crosses over the bus' )
    .then(  'content gets added to the element', 
        function( done ) {
            const bus = new GlobalMessageBus();
            const container = document.createElement( 'div' );
            const controller = new MessageBusMonitorController( container );
            expect( container.children.length ).to.equal( 0 );
            bus.emit( Symbol( 'foo' ), 'bar' );
            setTimeout( () => {
                expect( container.children.length ).to.equal( 1 );
                const event = container.children[0];
                expect( event.children.length ).to.equal( 3 );
                expect( event.children[0].classList.contains( 'time' ) ).to.be.true;
                expect( event.children[1].textContent ).to.equal( 'Symbol(foo)' );
                expect( event.children[2].textContent ).to.equal( '"bar"' );
                done();
            }, 0 );
        }
    );

});
