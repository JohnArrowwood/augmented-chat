class KnowledgeBaseArticle {
    #id; // unique identifier
    #question; // what this article is about
    #answer; // article content
    #source; // usually a conversation id, may eventually be a URL or something
    #embeddings_vector; // key for finding contextual similarity between articles
    #bins; // location-sensitive hashes (10) of the vector, for rapidly finding related docus
    #tags; // assigned text tags
    #created_date; // timestamp of record creation
    #updated_date; // timestamp of record update (conversation summaries only)

    constructor({
        id = crypto.randomUUID(),
        question = null,
        answer = null,
        source = null,
        embeddings_vector = null,
        bins = [],
        tags = [],
        created_date = Date.now(),
        updated_date = Date.now()
    } = {}) {
        this.#id = ObjectValidator.isUUIDstring( id );
        this.#question = ObjectValidator.isNotEmpty( question );
        this.#answer = ObjectValidator.isNotEmpty( answer );
        this.#source = KnowledgeSource.validate( source );
        this.#embeddings_vector = embeddings_vector ? embeddings_vector : null; // TODO: Add validation
        this.#tags = [];
        this.#bins = [];
        this.#created_date = ObjectValidator.isInteger( created_date );
        this.#updated_date = ObjectValidator.isInteger( updated_date );

        if ( tags ) {
            ObjectValidator.isArray( tags ).forEach( tag => {
                this.#tags.push( Tag.isValid( tag ) );
            });
        }

        if ( bins ) {
            ObjectValidator.isArray( bins ).forEach( bin => {
                this.#bins.push( ObjectValidator.isNotEmpty( bin ) );
            });
        }

        Object.freeze( this );
    }

    // getters
    get id() { return this.#id; }
    get question() { return this.#question; }
    get answer() { return this.#answer; }
    get source() { return this.#source; }
    get embeddings_vector() { return this.#embeddings_vector; }
    get bins() { return Object.freeze( [...this.#bins] ); }
    get tags() { return Object.freeze( [...this.#tags] ); }
    get created_date() { return this.#created_date; }
    get updated_date() { return this.#updated_date; }

    // generally speaking updates only applies to conversation summaries,
    // and those can be whole new records with a preserved created_date
}