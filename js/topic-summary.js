class TopicSummary {
    #from; // datestamp
    #to; // datestamp
    #summary;
    #details;
    #tags;
    #embeddings_vector;
    #bins;

    constructor({
        from = Date.now(),
        to = Date.now(),
        summary = "",
        details = "",
        tags = [],
        embeddings_vector: embeddings_vector = null,
        bins = [],
    } = {}) {
        this.#from = ObjectValidator.isInteger( from );
        this.#to = ObjectValidator.isInteger( to );
        this.#summary = ObjectValidator.isNotEmpty( summary );
        this.#details = ObjectValidator.isNotEmpty( details );
        this.#tags = [];
        this.#embeddings_vector = embeddings_vector;
        this.#bins = [];

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
    get from() { return this.#from; }
    get to() { return this.#to; }
    get summary() { return this.#summary; }
    get details() { return this.#details; }
    get tags() { return Object.freeze([...this.#tags]); }
    get embeddings_vector() { return this.#embeddings_vector; }
    get bins() { return Object.freeze([...this.#bins]); }

    // TODO: Determine how these will be created and updated by the LLM
}