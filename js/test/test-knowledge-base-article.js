describe( 'KnowledgeBaseArticle', function() {

    function ValidateArticle( obj ) {
        return new ObjectValidator( obj );
    }

    function randomString( length ) {
        return Array.from({ length: length }, () => String.fromCharCode(Math.floor(Math.random() * 26) + (Math.random() > 0.5 ? 65 : 97))).join('');
    }

    let init;

    beforeEach( () => {
        init = {
            id: crypto.randomUUID(),
            question: randomString( 8 ),
            answer: randomString( 8 ),
            source: KnowledgeSource.conversation( crypto.randomUUID() ),
            embeddings_vector: "pretend-this-is-an-embedding-vector",
            tags: ["foo", "bar"],
            bins: [ "AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH", "II", "JJ" ],
            created_date: Date.now() - 100,
            updated_date: Date.now() - 50,
        };
    });

    describe( 'Constructor', function() {

        test( 'creates an immutable object' )
        .given( 'a properly initialized KnowledgeBaseArticle' )
        .when(  'inspected' )
        .then(  'the object is frozen/immutable', 
            function() {
                const kba = new KnowledgeBaseArticle( init );
                expect( Object.isFrozen( kba ) ).to.be.true;
            }
        )

        test( 'default constructor' )
        .given( 'no parameters to the constructor' )
        .when(  'a KnowledgeBaseArticle is constructed' )
        .then(  'an error is thrown', 
            function () {
                expect( () => new KnowledgeBaseArticle() ).to.throw();
            }
        );

        describe( 'id', function() {

            test( 'id provided' )
            .given( 'an id' )
            .when(  'a knowledge base article is created' )
            .then(  'the provided id is the record id', 
                function() {
                    init.id = crypto.randomUUID();
                    const kba = new KnowledgeBaseArticle( init );
                    expect( kba.id ).to.equal( init.id );
                }
            );

            test( 'id omitted' )
            .given( 'everything but the id' )
            .when(  'a knowledge base article is created' )
            .then(  'an id is provided automatically',
                function() {
                    delete init.id;
                    const kba = new KnowledgeBaseArticle( init );
                    ValidateArticle( kba )
                        .id_is_uuid
                        .validate();
                }
            );

            test( 'id malformed' )
            .given( 'an id that is not a UUID' )
            .when(  'a knowledge base article is created' )
            .then(  'an error is thrown',
                function() {
                    init.id = 'not-a-uuid';
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

        });

        describe( 'question', function() {

            test( 'question omitted' )
            .given( 'no question' )
            .when(  'article is created without it' )
            .then(  'an error is thrown', 
                function() {
                    delete init.question;
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

            test( 'question null' )
            .given( 'question is null' )
            .when(  'article is created' )
            .then(  'an error is thrown', 
                function() {
                    init.question = null;
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

            test( 'question empty' )
            .given( 'question is empty' )
            .when(  'article is created' )
            .then(  'an error is thrown', 
                function() {
                    init.question = '';
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

            test( 'question provided' )
            .given( 'question is set' )
            .when(  'article is created' )
            .then(  'value is used', 
                function() {
                    init.question = randomString( 8 );
                    const kba = new KnowledgeBaseArticle( init );
                    expect( kba.question ).to.equal( init.question );
                }
            );

        });

        describe( 'answer', function() {

            test( 'answer omitted' )
            .given( 'no answer' )
            .when(  'article is created without it' )
            .then(  'an error is thrown', 
                function() {
                    delete init.answer;
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

            test( 'answer null' )
            .given( 'answer is null' )
            .when(  'article is created' )
            .then(  'an error is thrown', 
                function() {
                    init.answer = null;
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

            test( 'answer empty' )
            .given( 'answer is empty' )
            .when(  'article is created' )
            .then(  'an error is thrown', 
                function() {
                    init.answer = '';
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

            test( 'answer provided' )
            .given( 'answer is set' )
            .when(  'article is created' )
            .then(  'value is used', 
                function() {
                    init.answer = randomString( 8 );
                    const kba = new KnowledgeBaseArticle( init );
                    expect( kba.answer ).to.equal( init.answer );
                }
            );

        });

        describe( 'source', function() {

            test( 'source omitted' )
            .given( 'no source' )
            .when(  'the article is created' )
            .then(  'an error is thrown',
                function() {
                    delete init.source;
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

            test( 'conversation source provided' )
            .given( 'a conversation source' )
            .when(  'the article is created' )
            .then(  'the value is used',
                function() {
                    init.source = KnowledgeSource.conversation( crypto.randomUUID() );
                    const kba = new KnowledgeBaseArticle( init );
                    expect( kba.source ).to.equal( init.source );
                }
            );

            test( 'url source provided' )
            .given( 'a url source' )
            .when(  'the article is created' )
            .then(  'the value is used',
                function() {
                    init.source = KnowledgeSource.url( 'https://www.example.com/' + crypto.randomUUID() );
                    const kba = new KnowledgeBaseArticle( init );
                    expect( kba.source ).to.equal( init.source );
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
                    const kba = new KnowledgeBaseArticle( init );
                    const tags = kba.tags;
                    expect( tags.length ).to.equal( 0 )
                }
            );

            test( 'may be empty')
            .given( 'an empty tags list' )
            .when(  'record is constructed' )
            .then(  'the tag list is empty',
                function() {
                    init.tags = [];
                    const kba = new KnowledgeBaseArticle( init );
                    const tags = kba.tags;
                    expect( tags.length ).to.equal( 0 )
                }
            );

            test( 'may contain a list of tags' )
            .given( 'a non-empty tags list' )
            .when(  'record is constructed' )
            .then(  'all provided tags end up in the list',
                function() {
                    init.tags = [ "foo", "bar" ];
                    const kba = new KnowledgeBaseArticle( init );
                    const tags = kba.tags;
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
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

            test( 'tags must be strings' )
            .given( 'a tag that is not a string' )
            .when(  'record is constructed' )
            .then(  'an error is thrown',
                function() {
                    init.tags = [ "foo", Symbol( 'bar' ) ];
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

        });

        describe( 'embeddings_vector', function() {

            test( 'may be omitted' )
            .given( 'no embedding vector' )
            .when(  'a kba summary is created' )
            .then(  'the embeddings_vector is initialized to null',
                function() {
                    delete init.embeddings_vector;
                    const kba = new KnowledgeBaseArticle( init );
                    expect( kba.embeddings_vector ).to.be.null;
                }
            );

            test( 'may be provided as null' )
            .given( 'embeddings_vector is explicitly set to null' )
            .when(  'the object is created' )
            .then(  'the field is set to null',
                function() {
                    init.embeddings_vector = null;
                    const kba = new KnowledgeBaseArticle( init );
                    expect( kba.embeddings_vector ).to.be.null;
                }
            );

            test( 'may be provided as an empty string' )
            .given( 'embeddings_vector is set to an empty string' )
            .when(  'the object is created' )
            .then(  'the field is set to null',
                function() {
                    init.embeddings_vector = "";
                    const kba = new KnowledgeBaseArticle( init );
                    expect( kba.embeddings_vector ).to.be.null;
                }
            );

            test( 'may be provided as a non-empty string' )
            .given( 'a value for the embeddings_vector' )
            .when(  'the object is created' )
            .then(  'the vector is saved as provided',
                function() {
                    init.embeddings_vector = "an-unreal-embedding-vector";
                    const kba = new KnowledgeBaseArticle( init );
                    expect( kba.embeddings_vector ).to.equal( init.embeddings_vector );
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
                    const kba = new KnowledgeBaseArticle( init );
                    const bins = kba.bins;
                    expect( bins.length ).to.equal( 0 )
                }
            );

            test( 'may be empty')
            .given( 'an empty bin list' )
            .when(  'record is constructed' )
            .then(  'the bin list is empty',
                function() {
                    init.bins = [];
                    const kba = new KnowledgeBaseArticle( init );
                    const bins = kba.bins;
                    expect( bins.length ).to.equal( 0 )
                }
            );

            test( 'may contain a list of tags' )
            .given( 'a non-empty bin list' )
            .when(  'record is constructed' )
            .then(  'all provided bins end up in the list',
                function() {
                    const kba = new KnowledgeBaseArticle( init );
                    const bins = kba.bins;
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
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

            test( 'bins must be strings' )
            .given( 'a tag that is not a string' )
            .when(  'record is constructed' )
            .then(  'an error is thrown',
                function() {
                    init.bins = [ "foo", Symbol( 'bar' ) ];
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

        });

        describe( 'created_date', function() {

            test( 'created_date omitted' )
            .given( 'everything but the created_date' )
            .when(  'constructor called' )
            .then(  'created_date defaults to now',
                function() {
                    delete init.created_date;
                    const kba = new KnowledgeBaseArticle( init );
                    ValidateArticle( kba )
                        .created_date_is_within( 10 )
                        .validate();
                }
            );

            test( 'created_date provided' )
            .given( 'everything' )
            .when(  'constructor called' )
            .then(  'created_date set accordingly',
                function() {
                    init.created_date = Date.now() - 123456;
                    const kba = new KnowledgeBaseArticle( init );
                    ValidateArticle( kba )
                        .created_date_is( init.created_date )
                        .validate();
                }
            );

            test( 'created_date malformed' )
            .given( 'a created date that is not a timestamp' )
            .when(  'constructor called' )
            .then(  'an error is thrown',
                function() {
                    init.created_date = '2024-01-02 12:34:56';
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

        });

        describe( 'updated_date', function() {

            test( 'updated_date omitted' )
            .given( 'everything but the updated_date' )
            .when(  'constructor called' )
            .then(  'defaults to now',
                function() {
                    delete init.updated_date;
                    const kba = new KnowledgeBaseArticle( init );
                    ValidateArticle( kba )
                        .updated_date_is_within( 10 )
                        .validate();
                }
            );

            test( 'updated_date provided' )
            .given( 'everything' )
            .when(  'constructor called' )
            .then(  'is set accordingly',
                function() {
                    init.updated_date = Date.now() - 123456;
                    const kba = new KnowledgeBaseArticle( init );
                    ValidateArticle( kba )
                        .updated_date_is( init.updated_date )
                        .validate();
                }
            );

            test( 'updated_date malformed' )
            .given( 'an updated date that is not a timestamp' )
            .when(  'constructor called' )
            .then(  'an error is thrown',
                function() {
                    init.updated_date = '2024-01-02 12:34:56';
                    expect( () => new KnowledgeBaseArticle( init ) ).to.throw();
                }
            );

        });

    });


    describe( 'Getters', function() {

        // NOTE: Everything in this section is redundant
        // as the TopicSummaryValidator exercises the getters
        // but this will help isolate any getter related problems

        test( 'get id' )
        .given( 'an initialized KnowledgeBaseArticle' )
        .when(  'the id getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const kba = new KnowledgeBaseArticle( init );
                expect( kba.id ).to.equal( init.id );
            }
        );

        test( 'get question' )
        .given( 'an initialized KnowledgeBaseArticle' )
        .when(  'the question getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const kba = new KnowledgeBaseArticle( init );
                expect( kba.question ).to.equal( init.question );
            }
        );

        test( 'get answer' )
        .given( 'an initialized KnowledgeBaseArticle' )
        .when(  'the answer getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const kba = new KnowledgeBaseArticle( init );
                expect( kba.answer ).to.equal( init.answer );
            }
        );

        test( 'get source' )
        .given( 'an initialized KnowledgeBaseArticle' )
        .when(  'the source getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const kba = new KnowledgeBaseArticle( init );
                expect( kba.source ).to.equal( init.source );
            }
        );

        test( 'get tags' )
        .given( 'an initialized KnowledgeBaseArticle' )
        .when(  'the tags getter is called' )
        .then(  'it returns the list of tags', 
            function () {
                const kba = new KnowledgeBaseArticle( init );
                const tags = kba.tags;
                expect( Object.isFrozen( tags ) ).to.be.true;
                expect( tags ).to.include( "foo" );
                expect( tags ).to.include( "bar" );
            }
        );

        test( 'get embeddings_vector' )
        .given( 'an initialized KnowledgeBaseArticle' )
        .when(  'the embeddings_vector getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const kba = new KnowledgeBaseArticle( init );
                expect( kba.embeddings_vector ).to.equal( init.embeddings_vector );
            }
        );

        test( 'get bins' )
        .given( 'an initialized KnowledgeBaseArticle' )
        .when(  'the bins getter is called' )
        .then(  'it returns the list of bins', 
            function () {
                const kba = new KnowledgeBaseArticle( init );
                const bins = kba.bins;
                expect( Object.isFrozen( bins ) ).to.be.true;
                expect( bins ).to.include( "AA" );
                expect( bins ).to.include( "BB" );
                expect( bins.length ).to.equal( 10 );
            }
        );

        test( 'get created_date' )
        .given( 'an initialized KnowledgeBaseArticle' )
        .when(  'the created_date getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const kba = new KnowledgeBaseArticle( init );
                expect( kba.created_date ).to.equal( init.created_date );
            }
        );

        test( 'get updated_date' )
        .given( 'an initialized KnowledgeBaseArticle' )
        .when(  'the updated_date getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const kba = new KnowledgeBaseArticle( init );
                expect( kba.updated_date ).to.equal( init.updated_date );
            }
        );


    });

});