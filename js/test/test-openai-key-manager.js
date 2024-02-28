describe( "OpenAIKeyManager", function() {
    let KM;
    let ORIGINAL;

    beforeEach( () => {
        KM = new OpenAIKeyManager();
        ORIGINAL = KM.key;
    });

    afterEach( () => {
        KM.key = ORIGINAL;
    });

    test( 'read/write' )
    .given( 'a key is stored' )
    .when(  'the key is retrieved' )
    .then(  'the value is returned', 
        function() {
            KM.key = 'foo';
            expect( KM.key ).to.equal( 'foo' );
            KM.key = 'bar';
            expect( KM.key ).to.equal( 'bar' );
            KM.key = '';
            expect( KM.key ).to.equal( '' );
        }
    );

    test( 'field-initialization' )
    .given( 'a key manager initialized with an input field' )
    .when(  'initialization is complete' )
    .then(  'the input value is the key',
        function() {
            const INPUT = document.createElement( 'input' );
            expect( INPUT.value ).to.be.empty;
            KM.key = 'pretend-this-is-the-key';
            KM.element( INPUT );
            expect( INPUT.value ).to.equal( KM.key );
        }
    );

    test( 'field-update' )
    .given( 'a key manager initialized with an input field' )
    .when(  'the field is updated' )
    .then(  'the key is also updated',
        function( done ) {
            const INPUT = document.createElement( 'input' );
            KM.key = 'initial-value';
            KM.element( INPUT );
            expect( INPUT.value ).to.equal( KM.key );

            INPUT.value = 'new-value'; // Set the new value programmatically
            INPUT.dispatchEvent( new Event( 'change', { bubbles: true, cancelable: true } ) );

            setTimeout( () => {
                expect( KM.key ).to.equal( 'new-value' );
                done();
            }, 0 );
        }
    );

});