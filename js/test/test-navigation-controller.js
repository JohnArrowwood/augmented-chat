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

    test( 'div#nav not found' )
    .given( 'a document that does not contain the prerequisite element' )
    .when(  'instantiating the object' )
    .then(  'an error is thrown', function() {
        const nav = document.getElementById( 'nav' );
        if ( nav ) {
            document.body.removeChild( nav );
        }
        expect( () => new NavigationController() ).to.throw();
    });

    beforeEach( setup );
    afterEach( teardown );

    test( 'Singleton' )
    .given( 'a configuration manager object' )
    .when(  'a second one is defined' )
    .then(  'the first one is returned',
        function( done ) {
            const nc1 = new NavigationController();
            const nc2 = new NavigationController();
            expect( nc1 ).to.equal( nc2 );
            done();
        }
    );

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
            NC = new NavigationController();
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
    /*
    test( 'Set' )
    .given( 'a configuration manager object' )
    .when(  'a CONFIG_SET event comes across the bus' )
    .then(  'the the associated class is added',
        function( done ) {
            expect( CONFIG.classList.contains( CLASS ) ).to.be.false;
            expect( CONFIG.classList.contains('transitioning') ).to.be.false;

            BUS.emit( MessageType.CONFIG_SET, CLASS );

            expect( CONFIG.classList.contains( CLASS ) ).to.be.true;
            expect( CONFIG.classList.contains('transitioning') ).to.be.true;

            setTimeout( () => {
                expect( CONFIG.classList.contains( CLASS ) ).to.be.true;
                expect( CONFIG.classList.contains('transitioning') ).to.be.false;    
                done();
            }, 1000 * 1/60 );
        }
    );

    test( 'Set Unnecessarily' )
    .given( 'a configuration manager object' )
    .and(   'the config DOM element already has the target class')
    .when(  'a CONFIG_SET event comes across the bus' )
    .then(  'the the associated class is not modified',
        function( done ) {

            CONFIG.classList.add( CLASS );

            expect( CONFIG.classList.contains( CLASS ) ).to.be.true;
            expect( CONFIG.classList.contains('transitioning') ).to.be.false;

            BUS.emit( MessageType.CONFIG_SET, CLASS );

            expect( CONFIG.classList.contains( CLASS ) ).to.be.true;
            expect( CONFIG.classList.contains('transitioning') ).to.be.false;

            done();
        }
    );

    test( 'Clear' )
    .given( 'a configuration manager' )
    .and(   'the config DOM element has the target class' )
    .when(  'a CONFIG_CLEAR event comes across the bus' )
    .then(  'the class is removed',
        function( done ) {
            CONFIG.classList.add( CLASS );
            BUS.emit( MessageType.CONFIG_CLEAR, CLASS );

            expect( CONFIG.classList.contains( CLASS ) ).to.be.true;
            expect( CONFIG.classList.contains('transitioning') ).to.be.true;

            setTimeout( () => {
                expect( CONFIG.classList.contains( CLASS ) ).to.be.false;
                expect( CONFIG.classList.contains('transitioning') ).to.be.false;    
                done();
            }, 1000 * 1/60 );

        }
    );

    test( 'Clear Unnecessarily' )
    .given( 'a configuration manager' )
    .and(   'the config DOM element LACKS the target class' )
    .when(  'a CONFIG_CLEAR event comes across the bus' )
    .then(  'the class is unchanged',
        function( done ) {
            BUS.emit( MessageType.CONFIG_CLEAR, CLASS );

            expect( CONFIG.classList.contains( CLASS ) ).to.be.false;
            expect( CONFIG.classList.contains('transitioning') ).to.be.false;

            done();
        }
    );

    test( 'Toggle On' )
    .given( 'a configuration manager' )
    .and(   'the config DOM element LACKS the target class' )
    .when(  'a CONFIG_TOGGLE event comes across the bus' )
    .then(  'the class is added',
        function( done ) {
            BUS.emit( MessageType.CONFIG_TOGGLE, CLASS );

            expect( CONFIG.classList.contains( CLASS ) ).to.be.true;
            expect( CONFIG.classList.contains('transitioning') ).to.be.true;

            setTimeout( () => {
                expect( CONFIG.classList.contains( CLASS ) ).to.be.true;
                expect( CONFIG.classList.contains('transitioning') ).to.be.false;    
                done();
            }, 1000 * 1/60 );
        }
    );

    test( 'Toggle Off' )
    .given( 'a configuration manager' )
    .and(   'the config DOM element HAS the target class' )
    .when(  'a CONFIG_TOGGLE event comes across the bus' )
    .then(  'the class is removed',
        function( done ) {
            CONFIG.classList.add( CLASS );
            BUS.emit( MessageType.CONFIG_TOGGLE, CLASS );

            expect( CONFIG.classList.contains( CLASS ) ).to.be.true;
            expect( CONFIG.classList.contains('transitioning') ).to.be.true;

            setTimeout( () => {
                expect( CONFIG.classList.contains( CLASS ) ).to.be.false;
                expect( CONFIG.classList.contains('transitioning') ).to.be.false;    
                done();
            }, 1000 * 1/60 );
        }
    );
    */
});