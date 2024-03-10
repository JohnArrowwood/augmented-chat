class TopicSummary {
    #from; // datestamp
    #to; // datestamp
    #summary;
    #details;
    #tags;
    #embedding_vector;
    #bins;

    constructor({
        from = Date.now(),
        to = Date.now(),
        summary = "",
        details = "",
        tags = [],
        embedding_vector = null,
        bins = [],
    } = {}) {
        this.#from = ObjectValidator.isInteger( from );
        this.#to = ObjectValidator.isInteger( to );
        this.#summary = ObjectValidator.isNotEmpty( summary );
        this.#details = ObjectValidator.isNotEmpty( details );
        this.#tags = [];
        this.#embedding_vector = embedding_vector;
        this.#bins = [];

        if ( tags ) {
            if ( ! Array.isArray( tags ) ) {
                throw new Error( "Tags must be an array" );
            }
            tags.forEach( tag => {
                if ( typeof tag !== "string" ) {
                    throw new Error( "Tags must be strings" );
                }
                this.#tags.push( tag );
            });
        }

        if ( bins ) {
            if ( ! Array.isArray( bins ) ) {
                throw new Error( "Bins must be an array" );
            }
            bins.forEach( bin => {
                if ( typeof bin !== "string" ) {
                    throw new Error( "Bins must be strings" );
                }
                this.#bins.push( bin );
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
    get embedding_vector() { return this.#embedding_vector; }
    get bins() { return Object.freeze([...this.#bins]); }

    // TODO: Determine how these will be created and updated by the LLM
}