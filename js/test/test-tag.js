describe( 'Tag', function() {

    function ValidateTag( obj ) {
        return new ObjectValidator( obj );
    }

    let init;

    beforeEach( () => {
        init = {
            tag: "foo",
            description: "bar",
            critical: false,
            created_date: Date.now() - 12345,
            updated_date: Date.now() - 100,
        };
    });

    describe( 'Constructor', function() {

        test( 'creates an immutable object' )
        .given( 'a properly initialized Tag' )
        .when(  'inspected' )
        .then(  'the object will NOT be frozen/immutable', 
            function() {
                const tag = new Tag( init );
                expect( Object.isFrozen( tag ) ).to.be.true;
            }
        )

        test( 'default constructor' )
        .given( 'no parameters to the constructor' )
        .when(  'a Tag is constructed' )
        .then(  'an error is thrown', 
            function () {
                expect( () => new Tag() ).to.throw();
            }
        );

        describe( 'tag', function() {

            test( 'tag omitted' )
            .given( 'everything but the tag' )
            .when(  'the record is created' )
            .then(  'an error is thrown',
                function() {
                    delete init.tag;
                    expect( () => new Tag( init ) ).to.throw();
                }
            );
    
            test( 'tag provided' )
            .given( 'everything including the tag' )
            .when(  'the record is created' )
            .then(  'the tag is used',
                function() {
                    const tag = new Tag( init );
                    ValidateTag( tag )
                        .tag_is( init.tag )
                        .validate();
                }
            );
    
            test( 'tag is mixed-case' )
            .given( 'a tag in CamelCase' )
            .when(  'the record is created' )
            .then(  'an error is thrown',
                function() {
                    init.tag = 'NotAValidTag';
                    expect( () => new Tag( init ) ).to.throw();
                }
            );

            test( 'tag contains spaces' )
            .given( 'a tag with multiple words separated by spaces' )
            .when(  'the record is created' )
            .then(  'an error is thrown',
                function() {
                    init.tag = 'not a valid tag';
                    expect( () => new Tag( init ) ).to.throw();
                }
            );

            // TODO: Note that there may come a time when this is desirable
            test( 'tag contains underscores' )
            .given( 'a tag with multiple words separated by underscores' )
            .when(  'the record is created' )
            .then(  'an error is thrown',
                function() {
                    init.tag = 'not_a_valid_tag';
                    expect( () => new Tag( init ) ).to.throw();
                }
            );

            test( 'tag contains dash-separated words' )
            .given( 'a tag with multiple words separated by dashes' )
            .when(  'the record is created' )
            .then(  'the value is used',
                function() {
                    init.tag = 'multi-word-tag';
                    const tag = new Tag( init );
                    expect( tag.tag ).to.equal( init.tag );
                }
            );

        });

        describe( 'description', function() {

            test( 'description must be provided' )
            .given( 'an init without a description' )
            .when(  'a record is created' )
            .then(  'an error is thrown',
                function() {
                    delete init.description;
                    expect( () => new Tag( init ) ).to.throw();
                }
            );

            test( 'description must not be empty' )
            .given( 'an empty description' )
            .when(  'a tag is created' )
            .then(  'an error is thrown', 
                function() {
                    init.description = "";
                    expect( () => new Tag( init ) ).to.throw();
                }
            );

            test( 'provided value is used' )
            .given( 'a description' )
            .when(  'a tag is created' )
            .then(  'the description is used',
                function() {
                    init.description = "this is my description";
                    const tag = new Tag( init );
                    expect( tag.description ).to.equal( init.description );
                }
            );
        });

        describe( 'critical', function() {

            test( 'can be initialized to true' )
            .given( 'critical is true' )
            .when(  'a tag is created' )
            .then(  'the tag has set critical to true', 
                function() {
                    init.critical = true;
                    const tag = new Tag( init );
                    expect( tag.critical ).to.be.true;
                }
            );

            test( 'can be initialized to false' )
            .given( 'critical is false' )
            .when(  'a tag is created' )
            .then(  'the tag has set critical to false', 
                function() {
                    init.critical = false;
                    const tag = new Tag( init );
                    expect( tag.critical ).to.be.false;
                }
            );

            test( 'defaults to false' )
            .given( 'critical is omitted' )
            .when(  'a tag is created' )
            .then(  'the tag has set critical to false', 
                function() {
                    delete init.critical;
                    const tag = new Tag( init );
                    expect( tag.critical ).to.be.false;
                }
            );

            test( 'rejects non-boolean values' )
            .given( 'critical is not a boolean' )
            .when(  'a tag is created' )
            .then(  'an error is thrown', 
                function() {
                    init.critical = "true";
                    expect( () => new Tag( init ) ).to.throw();
                }
            );

        });

        describe( 'created_date', function() {

            test( 'if omitted, defaults to now' )
            .given( 'no created_date' )
            .when(  'tag is created' )
            .then(  'created_date is set to the current time',
                function() {
                    delete init.created_date;
                    const tag = new Tag( init );
                    ValidateTag( tag )
                        .created_date_is_within( 10 )
                        .validate();
                }
            );

            test( 'if null, defaults to now' )
            .given( 'created_date is null' )
            .when(  'tag is created' )
            .then(  'created_date is set to the current time',
                function() {
                    init.created_date = null;
                    const tag = new Tag( init );
                    ValidateTag( tag )
                        .created_date_is_within( 10 )
                        .validate();
                }
            );

            test( 'if not a number, throws an error' )
            .given( 'created_date is provided as a string' )
            .when(  'the tag is created' )
            .then(  'an error is thrown',
                function() {
                    init.created_date = "1234-01-02 12:34:56";
                    expect( () => new Tag( init ) ).to.throw();
                }
            );

            test( 'may provide a value in the past' )
            .given( 'created_date is in the past' )
            .when(  'the tag is created' )
            .then(  'the value is used',
                function() {
                    init.created_date = Date.now() - 123456;
                    const tag = new Tag( init );
                    expect( tag.created_date ).to.equal( init.created_date );
                }
            );

            test( 'may provide a value in the future' )
            .given( 'created_date is in the future' )
            .when(  'the tag is created' )
            .then(  'the value is used',
                function() {
                    init.created_date = Date.now() + 123456;
                    const tag = new Tag( init );
                    expect( tag.created_date ).to.equal( init.created_date );
                }
            );
       });

        describe( 'updated_date', function() {

            test( 'if omitted, defaults to now' )
            .given( 'no updated_date' )
            .when(  'tag is created' )
            .then(  'updated_date is set to the current time',
                function() {
                    delete init.updated_date;
                    const tag = new Tag( init );
                    ValidateTag( tag )
                        .updated_date_is_within( 10 )
                        .validate();
                }
            );

            test( 'if null, defaults to now' )
            .given( 'updated_date is null' )
            .when(  'tag is created' )
            .then(  'updated_date is set to the current time',
                function() {
                    init.updated_date = null;
                    const tag = new Tag( init );
                    ValidateTag( tag )
                        .updated_date_is_within( 10 )
                        .validate();
                }
            );

            test( 'if not a number, throws an error' )
            .given( 'updated_date is provided as a string' )
            .when(  'the tag is created' )
            .then(  'an error is thrown',
                function() {
                    init.updated_date = "1234-01-02 12:34:56";
                    expect( () => new Tag( init ) ).to.throw();
                }
            );

            test( 'may provide a value in the past' )
            .given( 'updated_date is in the past' )
            .when(  'the tag is created' )
            .then(  'the value is used',
                function() {
                    init.updated_date = Date.now() - 123456;
                    const tag = new Tag( init );
                    expect( tag.updated_date ).to.equal( init.updated_date );
                }
            );

            test( 'may provide a value in the future' )
            .given( 'updated_date is in the future' )
            .when(  'the tag is created' )
            .then(  'the value is used',
                function() {
                    init.updated_date = Date.now() + 123456;
                    const tag = new Tag( init );
                    expect( tag.updated_date ).to.equal( init.updated_date );
                }
            );

        });

    });

    describe( 'Getters', function() {

        // NOTE: Everything in this section is redundant
        // as the AnalysisValidator exercises the getters
        // but this will help isolate any getter related problems

        test( 'get tag' )
        .given( 'an initialized Tag' )
        .when(  'the tag getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const tag = new Tag( init );
                expect( tag.tag ).to.equal( init.tag );
            }
        );

        test( 'get description' )
        .given( 'an initialized Tag' )
        .when(  'the description getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const tag = new Tag( init );
                expect( tag.description ).to.equal( init.description );
            }
        );

        test( 'get critical' )
        .given( 'an initialized Tag' )
        .when(  'the critical getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const tag = new Tag( init );
                expect( tag.critical ).to.equal( init.critical );
            }
        );

        test( 'get created_date' )
        .given( 'an initialized Tag' )
        .when(  'the created_date getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const tag = new Tag( init );
                expect( tag.created_date ).to.equal( init.created_date );
            }
        );

        test( 'get updated_date' )
        .given( 'an initialized Tag' )
        .when(  'the updated_date getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const tag = new Tag( init );
                expect( tag.updated_date ).to.equal( init.updated_date );
            }
        );

    });

});