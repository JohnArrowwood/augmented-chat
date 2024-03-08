describe( 'UserSummary', function() {

    function ValidateUserSummary( obj ) {
        return new ObjectValidator( obj );
    }

    let init;

    beforeEach( () => {
        init = {
            created_date: Date.now(),
            summary: "foo"
        };
    });

    describe( 'Constructor', function() {

        test( 'creates immutable object' )
        .given( 'a properly initialized UserSummary' )
        .when(  'inspected' )
        .then(  'the object will be frozen/immutable', 
            function() {
                const summary = new UserSummary( init );
                expect( Object.isFrozen( summary) ).to.be.true;
            }
        )

        test( 'default constructor' )
        .given( 'no parameters to the constructor' )
        .when(  'a UserSummary is constructed' )
        .then(  'an error is thrown', 
            function () {
                expect( () => new UserSummary() ).to.throw();
            }
        );

        test( 'created_date omitted' )
        .given( 'everything but created_date is provided' )
        .when(  'a UserSummary is constructed' )
        .then(  'the created_date is initialized to the current Date and time', 
            function() {
                delete init.created_date;
                const summary = new UserSummary( init );
                ValidateUserSummary( summary )
                    .created_date_is_within( 10 )
                    .validate();
            }
        );

        test( 'created_date provided' )
        .given( 'everything is provided' )
        .when(  'a UserSummary is constructed' )
        .then(  'the provided created_date is used', 
            function() {
                init.created_date = Date.now() - 123456;
                const summary = new UserSummary( init );
                ValidateUserSummary( summary )
                    .created_date_is( init.created_date )
                    .validate();
            }
        );

        test( 'created_date malformed' )
        .given( 'id is not a number' )
        .when(  'a UserSummary is constructed' )
        .then(  'an error is thrown', 
            function() {
                init.created_date = "2024-01-02 12:34:56";
                expect( () => new UserSummary( init ) ).to.throw();
            }
        );

        test( 'summary omitted' )
        .given( 'everything but summary is provided' )
        .when(  'a UserSummary is constructed' )
        .then(  'an error is thrown', 
            function () {
                delete init.summary;
                expect( () => new UserSummary( init ) ).to.throw();
            }
        );

        test( 'summary empty' )
        .given( 'summary is empty' )
        .when(  'a UserSummary is constructed' )
        .then(  'an error is thrown', 
            function () {
                init.summary = "";
                expect( () => new UserSummary( init ) ).to.throw();
            }
        );

        test( 'summary provided' )
        .given( 'everything is provided' )
        .when(  'a UserSummary is constructed' )
        .then(  'the provided summary is used', 
            function () {
                const summary = new UserSummary( init );
                ValidateUserSummary( summary )
                    .summary_is( init.summary )
                    .validate();
            }
        );

        test( 'extraneous init fields ignored' )
        .given( 'the initialization object has extra fields' )
        .when(  'a UserSummary is constructed' )
        .then(  'the extraneous fields have no effect',
            function() {
                init.foo = "bar";
                const summary = new UserSummary( init );
                ValidateUserSummary( summary )
                    .created_date_is( init.created_date )
                    .summary_is( init.summary )
                    .validate();
            }
        );

    });

    describe( 'Getters', function() {

        // NOTE: Everything in this section is redundant
        // as the UserSummaryValidator exercises the getters
        // but this will help isolate any getter related problems

        test( 'get created_date' )
        .given( 'an initialized UserSummary' )
        .when(  'the created_date getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const summary = new UserSummary( init );
                expect( summary.created_date ).to.equal( init.created_date );
            }
        );

        test( 'get summary' )
        .given( 'an initialized UserSummary' )
        .when(  'the summary getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const summary = new UserSummary( init );
                expect( summary.summary ).to.equal( init.summary );
            }
        );

    });

});