class Message {
    #id;
    #date;
    #source;
    #message;

    // TODO: Add #conversationId
    // requires careful consideration of how to set it
    
    constructor() {
        this.#id = crypto.randomUUID();
        this.#date = Date.now();
        this.#source = null;
        this.#message = "";
    }

    get id() {
        return this.#id;
    }

    set id( value ) {
        this.#id = value;
    }

    withId( id ) {
        this.#id = id;
        return this;
    }

    get date() {
        return this.#date;
    }

    set date( value ) {
        this.#date = value;
    }

    withDate( date ) {
        this.#date = date;
        return this;
    }

    get source() {
        return this.#source;
    }

    set source( value ) {
        this.#source = value;
    }

    withSource( source ) {
        this.#source = source;
        return this;
    }

    get message() {
        return this.#message;
    }

    set message( value ) {
        this.#message = value;
    }
    
    withMessage( text ) {
        this.#message = text;
        return this;
    }

    // if needed:
    static from( { id, date, source, message } ) {
        const obj = new Message();
        if ( id )      obj.id( id );
        if ( date )    obj.date( date );
        if ( source )  obj.source( source );
        if ( message ) obj.message( message );
        return obj;
    }
}