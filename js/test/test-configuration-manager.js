describe( 'ConfigurationManager', function() {

    let CONFIG;
    const BUS = new GlobalMessageBus();
    let CM;
    let CLASS;

    const setup = () => {
        let config = document.getElementById( 'config' );
        if ( ! config ) {
            config = document.createElement('div');
            config.id = 'config';
            document.body.appendChild( config );    
        }
        CONFIG = config;
        CM = new ConfigurationManager();
        CLASS = Array.from({ length: 8 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + (Math.random() > 0.5 ? 65 : 97))).join('');
    };

    const teardown = () => {
        const config = document.getElementById( 'config' );
        if ( config ) {
            document.body.removeChild( config );
        }
    }

    test( 'div#config not found' )
    .given( 'a document that does not contain the prerequisite element' )
    .when(  'instantiating the object' )
    .then(  'an error is thrown', function() {
        teardown();
        expect( () => new ConfigurationManager() ).to.throw();
    });

    beforeEach( setup );
    afterEach( teardown );

    test( 'Singleton' )
    .given( 'a configuration manager object' )
    .when(  'a second one is defined' )
    .then(  'the first one is returned',
        function( done ) {
            const cm1 = new ConfigurationManager();
            const cm2 = new ConfigurationManager();
            expect( cm1 ).to.equal( cm2 );
            done();
        }
    );

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

});