describe( 'KnowledgeSource', function() {

    function ValidateSource( obj ) {
        return new ObjectValidator( obj );
    }

    describe( 'Constructor', function() {

        test( 'conversation source is immutable' )
        .given( 'a properly initialized Conversation source' )
        .when(  'inspected' )
        .then(  'the object will be immutable', 
            function() {
                const ks = new KnowledgeSource({
                    type: KnowledgeSource.CONVERSATION,
                    conversation_id: crypto.randomUUID()
                });
                expect( Object.isFrozen( ks ) ).to.be.true;
            }
        )

        test( 'url source is immutable' )
        .given( 'a properly initialized Url source' )
        .when(  'inspected' )
        .then(  'the object will be immutable', 
            function() {
                const ks = new KnowledgeSource({
                    type: KnowledgeSource.URL,
                    url: 'https://www.example.com/' + crypto.randomUUID()
                });
                expect( Object.isFrozen( ks ) ).to.be.true;
            }
        )

        test( 'default constructor' )
        .given( 'no parameters to the constructor' )
        .when(  'a knowldege source is constructed' )
        .then(  'an error is thrown', 
            function () {
                expect( () => new KnowledgeSource() ).to.throw();
            }
        );

        describe( 'Conversation', function() {

            test( 'no conversation_id' )
            .given( 'no conversation_id' )
            .when(  'the record is created' )
            .then(  'an error is thrown', 
                function() {
                    expect( () => new KnowledgeSource({
                        type: KnowledgeSource.CONVERSATION
                    })).to.throw();
                }   
            );

            test( 'null conversation_id' )
            .given( 'conversation_id is null' )
            .when(  'the record is created' )
            .then(  'an error is thrown', 
                function() {
                    expect( () => new KnowledgeSource({
                        type: KnowledgeSource.CONVERSATION,
                        conversation_id: null,
                    })).to.throw();
                }   
            );

            test( 'empty conversation_id' )
            .given( 'conversation_id is an empty string' )
            .when(  'the record is created' )
            .then(  'an error is thrown', 
                function() {
                    expect( () => new KnowledgeSource({
                        type: KnowledgeSource.CONVERSATION,
                        conversation_id: '',
                    })).to.throw();
                }   
            );

            test( 'malformed conversation_id' )
            .given( 'conversation_id is not a UUID' )
            .when(  'the record is created' )
            .then(  'an error is thrown', 
                function() {
                    expect( () => new KnowledgeSource({
                        type: KnowledgeSource.CONVERSATION,
                        conversation_id: 'not-a-uuid',
                    })).to.throw();
                }   
            );

            test( 'typical conversation_id' )
            .given( 'a UUID' )
            .when(  'provided as the conversation_id' )
            .then(  'the object is initialized successfully',
                function() {
                    const id = crypto.randomUUID();
                    const ks = new KnowledgeSource({
                        type: KnowledgeSource.CONVERSATION,
                        conversation_id: id
                    });
                    expect( ks.type ).to.equal( KnowledgeSource.CONVERSATION );
                    expect( ks.source ).to.equal( id );
                }
            );

        });

        describe( 'Url', function() {

            test( 'no url' )
            .given( 'no url' )
            .when(  'the record is created' )
            .then(  'an error is thrown', 
                function() {
                    expect( () => new KnowledgeSource({
                        type: KnowledgeSource.URL
                    })).to.throw();
                }   
            );

            test( 'null url' )
            .given( 'url is null' )
            .when(  'the record is created' )
            .then(  'an error is thrown', 
                function() {
                    expect( () => new KnowledgeSource({
                        type: KnowledgeSource.URL,
                        url: null,
                    })).to.throw();
                }   
            );

            test( 'empty url' )
            .given( 'url is an empty string' )
            .when(  'the record is created' )
            .then(  'an error is thrown', 
                function() {
                    expect( () => new KnowledgeSource({
                        type: KnowledgeSource.URL,
                        url: '',
                    })).to.throw();
                }   
            );

            test( 'typical url' )
            .given( 'a url' )
            .when(  'provided as the source url' )
            .then(  'the object is initialized successfully',
                function() {
                    const url = 'https://www.example.com/' + crypto.randomUUID();
                    const ks = new KnowledgeSource({
                        type: KnowledgeSource.URL,
                        url: url,
                    });
                    expect( ks.type ).to.equal( KnowledgeSource.URL );
                    expect( ks.source ).to.equal( url );
                }
            );

        });

        describe( 'Unrecognized Type', function() {

            test( 'no type provided' )
            .given( 'no type' )
            .when(  'constructor is called' )
            .then(  'an error is thrown',
                function() {
                    expect( () => new KnowledgeSource({
                        conversation_id: 'id-irrelevant',
                        url: 'url-irrelevant'
                    })).to.throw();
                }
            );

            test( 'type is null' )
            .given( 'null for a type' )
            .when(  'constructor is called' )
            .then(  'an error is thrown',
                function() {
                    expect( () => new KnowledgeSource({
                        type: null,
                        conversation_id: 'id-irrelevant',
                        url: 'url-irrelevant'
                    })).to.throw();
                }
            );

            test( 'type = string' )
            .given( 'a type that is a string' )
            .when(  'the constructor is called' )
            .then(  'an error is thrown',
                function() {
                    expect( () => new KnowledgeSource({
                        type: 'you-dont-know-me',
                        conversation_id: 'irrelevant',
                        url: 'also-irrelevant'
                    }) ).to.throw();
                }
            );

            test( 'type = other symbol' )
            .given( 'a type that is a symbol other than one of the known symbols' )
            .when(  'the constructor is called' )
            .then(  'an error is thrown',
                function() {
                    expect( () => new KnowledgeSource({
                        type: Symbol('you-dont-know-me'),
                        conversation_id: 'irrelevant',
                        url: 'also-irrelevant'
                    }) ).to.throw();
                }
            );
        });
    });

    describe( 'Static Factories', function() {

        test( 'KnowledgeSource.conversation( id )' )
        .given( 'a conversation id' )
        .when(  'the factory method is called' )
        .then(  'the object is initialized', function() {
            const id = crypto.randomUUID(); 
            const ks = KnowledgeSource.conversation( id );
            expect( ks.type ).to.equal( KnowledgeSource.CONVERSATION );
            expect( ks.source ).to.equal( id );
        });

        test( 'KnowledgeSource.url( url )' )
        .given( 'a url' )
        .when(  'the factory method is called' )
        .then(  'the object is initialized', function() {
            const url = 'https://www.example.com/' + crypto.randomUUID(); 
            const ks = KnowledgeSource.url( url );
            expect( ks.type ).to.equal( KnowledgeSource.URL );
            expect( ks.source ).to.equal( url );
        });

    });

});