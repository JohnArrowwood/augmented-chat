class Message {

    #id;
    #conversation_id;
    #created_date;
    #source;
    #message;

    constructor({
        id = crypto.randomUUID(),
        conversation_id = null,
        created_date = Date.now(),
        source = null,
        message = ""
    } = {} ) {
        this.#id = ObjectValidator.isUUIDstring( id );
        this.#conversation_id = ObjectValidator.isUUIDstring( conversation_id );
        this.#created_date = ObjectValidator.isInteger( created_date );
        this.#source = ObjectValidator.isValidSource( source );
        this.#message = ObjectValidator.isNotEmpty( message );

        Object.freeze( this );
    }

    // getters
    get id() { return this.#id; }
    get conversation_id() { return this.#conversation_id; }
    get created_date() { return this.#created_date; }
    get source() { return this.#source; }
    get message() { return this.#message; }

    // fluent but immutable initialization
    #with( field, value ) {
        const params = {
            id: this.id,
            conversation_id: this.conversation_id,
            created_date: this.created_date,
            source: this.source,
            message: this.message
        };
        params[field] = value;
        return new Message( params );
    }
    withId( id ) { return this.#with( 'id', id ); }
    withConversationId( id ) { return this.#with( 'conversation_id', id ); }
    withCreatedDate( date ) { return this.#with( 'created_date', date ); }
    withSource( source ) { return this.#with( 'source', source ); }
    withMessage( text ) { return this.#with( 'message', text ); }

    // factory
    static from( obj ) {
        return new Message( obj );
    }
}