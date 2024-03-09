class Citation {
    #conversation_id;  // which conversation
    #article_id; // which knowledge base article
    #last_cited_date; // date of citation
    
    constructor({
        conversation_id = null,
        article_id = null,
        last_cited_date = Date.now()
    } = {}) {
        this.#conversation_id = ObjectValidator.isUUIDstring( conversation_id );
        this.#article_id = ObjectValidator.isUUIDstring( article_id );
        this.#last_cited_date = ObjectValidator.isInteger( last_cited_date );

        Object.freeze( this );
    }

    // getters
    get conversation_id() { return this.#conversation_id; }
    get article_id() { return this.#article_id; }
    get last_cited_date() { return this.#last_cited_date; }

}