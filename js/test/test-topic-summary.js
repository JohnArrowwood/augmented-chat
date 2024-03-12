describe( 'TopicSummary', function() {

    function ValidateTopicSummary( obj ) {
        return new ObjectValidator( obj );
    }

    let init;

    beforeEach( () => {
        init = {
            from: Date.now() - 100,
            to: Date.now() - 50,
            summary: "short summary",
            details: "more detailed explanation of the topic",
            tags: ["foo", "bar"],
            embeddings_vector: "pretend-this-is-an-embedding-vector",
            bins: [ "AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH", "II", "JJ" ],
        };
    });

    describe( 'Constructor', function() {

        test( 'creates an immutable object' )
        .given( 'a properly initialized TopicSummary' )
        .when(  'inspected' )
        .then(  'the object is frozen/immutable', 
            function() {
                const topic = new TopicSummary( init );
                expect( Object.isFrozen( topic ) ).to.be.true;
            }
        )

        test( 'default constructor' )
        .given( 'no parameters to the constructor' )
        .when(  'a TopicSummary is constructed' )
        .then(  'an error is thrown', 
            function () {
                expect( () => new TopicSummary() ).to.throw();
            }
        );

        describe( 'from', function() {

            test( 'from omitted' )
            .given( 'everything but the from' )
            .when(  'constructor called' )
            .then(  'from defaults to now',
                function() {
                    delete init.from;
                    const topic = new TopicSummary( init );
                    ValidateTopicSummary( topic )
                        .from_is_within( 10 )
                        .validate();
                }
            );

            test( 'from provided' )
            .given( 'everything' )
            .when(  'constructor called' )
            .then(  'from set accordingly',
                function() {
                    init.from = Date.now() - 123456;
                    const topic = new TopicSummary( init );
                    ValidateTopicSummary( topic )
                        .from_is( init.from )
                        .validate();
                }
            );

            test( 'from malformed' )
            .given( 'a from date that is not a timestamp' )
            .when(  'constructor called' )
            .then(  'an error is thrown',
                function() {
                    init.from = '2024-01-02 12:34:56';
                    expect( () => new TopicSummary( init ) ).to.throw();
                }
            );

        });

        describe( 'to', function() {

            test( 'to omitted' )
            .given( 'everything but the to' )
            .when(  'constructor called' )
            .then(  'to defaults to now',
                function() {
                    delete init.to;
                    const topic = new TopicSummary( init );
                    ValidateTopicSummary( topic )
                        .to_is_within( 10 )
                        .validate();
                }
            );

            test( 'to provided' )
            .given( 'everything' )
            .when(  'constructor called' )
            .then(  'to set accordingly',
                function() {
                    init.to = Date.now() - 123456;
                    const topic = new TopicSummary( init );
                    ValidateTopicSummary( topic )
                        .to_is( init.to )
                        .validate();
                }
            );

            test( 'to malformed' )
            .given( 'a to date that is not a timestamp' )
            .when(  'constructor called' )
            .then(  'an error is thrown',
                function() {
                    init.to = '2024-01-02 12:34:56';
                    expect( () => new TopicSummary( init ) ).to.throw();
                }
            );

        });

        describe( 'summary', function() {

            test( 'must be provided' )
            .given( 'no summary' )
            .when(  'record is constructed' )
            .then(  'an error is thrown',
                function() {
                    delete init.summary;
                    expect( () => new TopicSummary( init ) ).to.throw();
                }
            );

            test( 'must not be empty' )
            .given( 'an empty summary' )
            .when(  'record is constructed' )
            .then(  'an error is thrown',
                function() {
                    init.summary = "";
                    expect( () => new TopicSummary( init ) ).to.throw();
                }
            );

            test( 'is used' )
            .given( 'a non-empty summary' )
            .when(  'record is constructed' )
            .then(  'summary is used',
                function() {
                    init.summary = "this-is-the-provided-summary";
                    const topic = new TopicSummary( init );
                    ValidateTopicSummary( topic )
                        .summary_is( init.summary )
                        .validate();
                }
            );

        });

        describe( 'details', function() {

            test( 'must be provided' )
            .given( 'no details' )
            .when(  'record is constructed' )
            .then(  'an error is thrown',
                function() {
                    delete init.details;
                    expect( () => new TopicSummary( init ) ).to.throw();
                }
            );

            test( 'must not be empty' )
            .given( 'empty details' )
            .when(  'record is constructed' )
            .then(  'an error is thrown',
                function() {
                    init.details = "";
                    expect( () => new TopicSummary( init ) ).to.throw();
                }
            );

            test( 'is used' )
            .given( 'a non-empty summary' )
            .when(  'record is constructed' )
            .then(  'summary is used',
                function() {
                    init.details = "this-is-the-provided-details";
                    const topic = new TopicSummary( init );
                    ValidateTopicSummary( topic )
                        .details_is( init.details )
                        .validate();
                }
            );

        });

        describe( 'tags', function() {

            test( 'may be omitted')
            .given( 'no tags' )
            .when(  'record is constructed' )
            .then(  'the tag list is empty',
                function() {
                    delete init.tags;
                    const topic = new TopicSummary( init );
                    const tags = topic.tags;
                    expect( tags.length ).to.equal( 0 )
                }
            );

            test( 'may be empty')
            .given( 'an empty tags list' )
            .when(  'record is constructed' )
            .then(  'the tag list is empty',
                function() {
                    init.tags = [];
                    const topic = new TopicSummary( init );
                    const tags = topic.tags;
                    expect( tags.length ).to.equal( 0 )
                }
            );

            test( 'may contain a list of tags' )
            .given( 'a non-empty tags list' )
            .when(  'record is constructed' )
            .then(  'all provided tags end up in the list',
                function() {
                    init.tags = [ "foo", "bar" ];
                    const topic = new TopicSummary( init );
                    const tags = topic.tags;
                    init.tags.forEach( tag => {
                        expect( tags ).to.include( tag );
                    });
                }
            );

            test( 'if provided, must be an array' )
            .given( 'a string instead of an array' )
            .when(  'record is constructed' )
            .then(  'an error is thrown', 
                function() {
                    init.tags = "foo";
                    expect( () => new TopicSummary( init ) ).to.throw();
                }
            );

            test( 'tags must be strings' )
            .given( 'a tag that is not a string' )
            .when(  'record is constructed' )
            .then(  'an error is thrown',
                function() {
                    init.tags = [ "foo", Symbol( 'bar' ) ];
                    expect( () => new TopicSummary( init ) ).to.throw();
                }
            );

        });

        describe( 'embeddings_vector', function() {

            test( 'may be omitted' )
            .given( 'no embedding vector' )
            .when(  'a topic summary is created' )
            .then(  'the embeddings_vector is initialized to null',
                function() {
                    delete init.embeddings_vector;
                    const topic = new TopicSummary( init );
                    expect( topic.embeddings_vector ).to.be.null;
                }
            );

            test( 'may be provided as null' )
            .given( 'embeddings_vector is explicitly set to null' )
            .when(  'the object is created' )
            .then(  'the field is set to null',
                function() {
                    init.embeddings_vector = null;
                    const topic = new TopicSummary( init );
                    expect( topic.embeddings_vector ).to.be.null;
                }
            );

            test( 'may be provided as an empty string' )
            .given( 'embeddings_vector is set to an empty string' )
            .when(  'the object is created' )
            .then(  'the field is set to the empty string',
                function() {
                    init.embeddings_vector = "";
                    const topic = new TopicSummary( init );
                    expect( topic.embeddings_vector ).to.be.empty;
                }
            );

            test( 'may be provided as a non-empty string' )
            .given( 'a value for the embeddings_vector' )
            .when(  'the object is created' )
            .then(  'the vector is saved as provided',
                function() {
                    init.embeddings_vector = "an-unreal-embedding-vector";
                    const topic = new TopicSummary( init );
                    expect( topic.embeddings_vector ).to.equal( init.embeddings_vector );
                }
            );

        });

        describe( 'bins', function() {

            test( 'may be omitted')
            .given( 'no bins' )
            .when(  'record is constructed' )
            .then(  'the bin list is empty',
                function() {
                    delete init.bins;
                    const topic = new TopicSummary( init );
                    const bins = topic.bins;
                    expect( bins.length ).to.equal( 0 )
                }
            );

            test( 'may be empty')
            .given( 'an empty bin list' )
            .when(  'record is constructed' )
            .then(  'the bin list is empty',
                function() {
                    init.bins = [];
                    const topic = new TopicSummary( init );
                    const bins = topic.bins;
                    expect( bins.length ).to.equal( 0 )
                }
            );

            test( 'may contain a list of tags' )
            .given( 'a non-empty bin list' )
            .when(  'record is constructed' )
            .then(  'all provided bins end up in the list',
                function() {
                    const topic = new TopicSummary( init );
                    const bins = topic.bins;
                    init.bins.forEach( bin => {
                        expect( bins ).to.include( bin );
                    });
                }
            );

            test( 'if provided, must be an array' )
            .given( 'a string instead of an array' )
            .when(  'record is constructed' )
            .then(  'an error is thrown', 
                function() {
                    init.bins = "foo";
                    expect( () => new TopicSummary( init ) ).to.throw();
                }
            );

            test( 'bins must be strings' )
            .given( 'a tag that is not a string' )
            .when(  'record is constructed' )
            .then(  'an error is thrown',
                function() {
                    init.bins = [ "foo", Symbol( 'bar' ) ];
                    expect( () => new TopicSummary( init ) ).to.throw();
                }
            );

        });

    });

    describe( 'Getters', function() {

        // NOTE: Everything in this section is redundant
        // as the TopicSummaryValidator exercises the getters
        // but this will help isolate any getter related problems

        test( 'get from' )
        .given( 'an initialized TopicSummary' )
        .when(  'the from getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const topic = new TopicSummary( init );
                expect( topic.from ).to.equal( init.from );
            }
        );

        test( 'get to' )
        .given( 'an initialized TopicSummary' )
        .when(  'the to getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const topic = new TopicSummary( init );
                expect( topic.to ).to.equal( init.to );
            }
        );

        test( 'get summary' )
        .given( 'an initialized TopicSummary' )
        .when(  'the summary getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const topic = new TopicSummary( init );
                expect( topic.summary ).to.equal( init.summary );
            }
        );

        test( 'get details' )
        .given( 'an initialized TopicSummary' )
        .when(  'the details getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const topic = new TopicSummary( init );
                expect( topic.details ).to.equal( init.details );
            }
        );

        test( 'get tags' )
        .given( 'an initialized TopicSummary' )
        .when(  'the tags getter is called' )
        .then(  'it returns the list of tags', 
            function () {
                const topic = new TopicSummary( init );
                const tags = topic.tags;
                expect( Object.isFrozen( tags ) ).to.be.true;
                expect( tags ).to.include( "foo" );
                expect( tags ).to.include( "bar" );
            }
        );

        test( 'get embeddings_vector' )
        .given( 'an initialized TopicSummary' )
        .when(  'the embeddings_vector getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const topic = new TopicSummary( init );
                expect( topic.embeddings_vector ).to.equal( init.embeddings_vector );
            }
        );

        test( 'get bins' )
        .given( 'an initialized TopicSummary' )
        .when(  'the bins getter is called' )
        .then(  'it returns the list of bins', 
            function () {
                const topic = new TopicSummary( init );
                const bins = topic.bins;
                expect( Object.isFrozen( bins ) ).to.be.true;
                expect( bins ).to.include( "AA" );
                expect( bins ).to.include( "BB" );
                expect( bins.length ).to.equal( 10 );
            }
        );

    });

});