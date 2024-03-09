describe( 'Citation', function() {

    function ValidateCitation( obj ) {
        return new ObjectValidator( obj );
    }

    let init;

    beforeEach( () => {
        init = {
            conversation_id: crypto.randomUUID(),
            article_id: crypto.randomUUID(),
            last_cited_date: Date.now(),
        };
    });

    describe( 'Constructor', function() {

        test( 'creates immutable object' )
        .given( 'a properly initialized Citation' )
        .when(  'inspected' )
        .then(  'the object will be frozen/immutable', 
            function() {
                const citation = new Citation( init );
                expect( Object.isFrozen( citation) ).to.be.true;
            }
        )

        test( 'default constructor' )
        .given( 'no parameters to the constructor' )
        .when(  'a Citation is constructed' )
        .then(  'an error is thrown', 
            function () {
                expect( () => new Citation() ).to.throw();
            }
        );

        test( 'conversation_id omitted' )
        .given( 'everything but conversation_id provided')
        .when(  'a Citation is constructed' )
        .then(  'an error is thrown',
            function() {
                delete init.conversation_id;
                expect( () => new Citation( init ) ).to.throw();
            }
        );

        test( 'conversation_id provided' )
        .given( 'everything provided')
        .when(  'a Citation is constructed' )
        .then(  'provided conversation_id is used',
            function() {
                const citation = new Citation( init );
                ValidateCitation( citation )
                    .conversation_id_is( init.conversation_id )
                    .validate();
            }
        );

        test( 'conversation_id malformed' )
        .given( 'an invalid conversation_id')
        .when(  'a Citation is constructed' )
        .then(  'an error is thrown',
            function() {
                init.conversation_id = 'not-a-uuid';
                expect( () => new Citation( init ) ).to.throw();
            }
        );

        test( 'article_id omitted' )
        .given( 'everything but article_id provided')
        .when(  'a Citation is constructed' )
        .then(  'an error is thrown',
            function() {
                delete init.article_id;
                expect( () => new Citation( init ) ).to.throw();
            }
        );

        test( 'article_id provided' )
        .given( 'everything provided')
        .when(  'a Citation is constructed' )
        .then(  'provided article_id is used',
            function() {
                const citation = new Citation( init );
                ValidateCitation( citation )
                    .article_id_is( init.article_id )
                    .validate();
            }
        );

        test( 'article_id malformed' )
        .given( 'an invalid article_id')
        .when(  'a Citation is constructed' )
        .then(  'an error is thrown',
            function() {
                init.article_id = 'not-a-uuid';
                expect( () => new Citation( init ) ).to.throw();
            }
        );

        test( 'last_cited_date omitted' )
        .given( 'last_cited_date is not provided')
        .when(  'a Citation is constructed' )
        .then(  'default is now',
            function() {
                delete init.last_cited_date;
                const citation = new Citation( init );
                ValidateCitation( citation )
                    .last_cited_date_is_within( 10 )
                    .validate();
            }
        );

        test( 'last_cited_date provided' )
        .given( 'last_cited_date is provided')
        .when(  'a Citation is constructed' )
        .then(  'value is used',
            function() {
                init.last_cited_date = Date.now() - 123456;
                const citation = new Citation( init );
                ValidateCitation( citation )
                    .last_cited_date_is( init.last_cited_date )
                    .validate();
            }
        );

        test( 'last_cited_date malformed' )
        .given( 'last_cited_date is not a number')
        .when(  'a Citation is constructed' )
        .then(  'an error is thrown',
            function() {
                init.last_cited_date = '1234-12-31 12:34:56'
                expect( () => new Citation( init ) ).to.throw();
            }
        );

    });

    describe( 'Getters', function() {

        // NOTE: Everything in this section is redundant
        // as the CitationValidator exercises the getters
        // but this will help isolate any getter related problems

        test( 'get conversation_id' )
        .given( 'an initialized Citation' )
        .when(  'the conversation_id getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const citation = new Citation( init );
                expect( citation.conversation_id ).to.equal( init.conversation_id );
            }
        );

        test( 'get article_id' )
        .given( 'an initialized Citation' )
        .when(  'the article_id getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const citation = new Citation( init );
                expect( citation.article_id ).to.equal( init.article_id );
            }
        );

        test( 'get last_cited_date' )
        .given( 'an initialized Citation' )
        .when(  'the last_cited_date getter is called' )
        .then(  'it returns the expected value', 
            function () {
                const citation = new Citation( init );
                expect( citation.last_cited_date ).to.equal( init.last_cited_date );
            }
        );

    });

});