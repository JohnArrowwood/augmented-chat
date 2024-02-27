describe( 'NavigationController', function() {

    const BUS = new GlobalMessageBus();
    let CLASS;
    let NAV;
    let EVERYTHING_CALLBACK;
    let TOGGLE_CALLBACK;
    let NAVIGATE_CALLBACK;
    let NC;

    function randomString( length ) {
        return Array.from({ length: length }, () => String.fromCharCode(Math.floor(Math.random() * 26) + (Math.random() > 0.5 ? 65 : 97))).join('');
    }
    const setup = () => {
        let nav = document.getElementById( 'nav' );
        if ( ! nav ) {
            nav = document.createElement('div');
            nav.id = 'nav';
            document.body.appendChild( nav );    
        }
        NAV = nav;
        CLASS = randomString( 8 );
        EVERYTHING_CALLBACK = sinon.spy();
        TOGGLE_CALLBACK = sinon.spy();
        NAVIGATE_CALLBACK = sinon.spy();
        BUS.subscribe( MessageType.EVERYTHING, EVERYTHING_CALLBACK );
        BUS.subscribe( MessageType.CONFIG_TOGGLE, TOGGLE_CALLBACK );
        BUS.subscribe( MessageType.USER_NAVIGATION, NAVIGATE_CALLBACK );
    };

    const teardown = () => {
        const nav = document.getElementById( 'nav' );
        if ( nav ) {
            document.body.removeChild( nav );
        }
        BUS.unsubscribe( MessageType.EVERYTHING, EVERYTHING_CALLBACK );
        BUS.unsubscribe( MessageType.CONFIG_TOGGLE, TOGGLE_CALLBACK );
        BUS.unsubscribe( MessageType.USER_NAVIGATION, NAVIGATE_CALLBACK );
    }

    beforeEach( setup );
    afterEach( teardown );

    test( 'handle with data-config' )
    .given( 'a DOM item with a data-config attribute' )
    .and(   'handle( item ) has been applied to it' )
    .when(  'the item is clicked' )
    .then(  'the handler triggers an event',
        function( done ) {
            const item = document.createElement( 'div' );
            item.setAttribute( 'data-config', CLASS );
            NC = new NavigationController();
            NC.handle( item );
            item.click();
            setTimeout( () => {
                expect( TOGGLE_CALLBACK.calledOnce ).to.be.true;
                done();
            }, 0 );
        }
    );

    test( 'handle without data-config' )
    .given( 'a DOM item without a data-config attribute' )
    .and(   'handle( item ) has been applied to it' )
    .when(  'the item is clicked' )
    .then(  'the handler does not trigger an event',
        function( done ) {
            const item = document.createElement( 'div' );
            NC = new NavigationController();
            NC.handle( item );
            item.click();
            setTimeout( () => {
                expect( TOGGLE_CALLBACK.calledOnce ).to.be.false;
                done();
            }, 0 );
        }
    );

    test( 'all pre-existing items get handled automatically' )
    .given( 'a nav element containing a few items with data-config attributes' )
    .and(   'the NavigationController is initialized' )
    .when(  'the the items are clicked' )
    .then(  'the appropriate evets are automatically raised',
        function( done ) {
            let i;
            let items = [];
            for ( i = 0 ; i < 5 ; i++ ) {
                let item = document.createElement( 'div' );
                item.classList.add( 'item' );
                item.classList.add( randomString(8) );
                item.setAttribute( 'data-config', randomString(8) );
                items.push( item );
                NAV.appendChild( item );
            }
            NC = new NavigationController( NAV );
            for ( i = 0 ; i < 5 ; i++ ) {
                items[i].click();
            }
            setTimeout( () => {
                expect( EVERYTHING_CALLBACK.callCount ).to.equal( 10 );
                expect( TOGGLE_CALLBACK.callCount ).to.equal( 5 );
                expect( NAVIGATE_CALLBACK.callCount ).to.equal( 5 );
                done();
            }, 0 );
        }
    );
});