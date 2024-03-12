class KnowledgeSource {
    static CONVERSATION = Symbol( 'takenFromConversation' );
    static URL = Symbol( 'learnedFromExternalSource' );

    #type; // conversation or url
    #conversation_id;
    #url;

    static conversation( id ) {
        return new KnowledgeSource({
            type: KnowledgeSource.CONVERSATION, 
            conversation_id: id
        });
    }

    static url( url ) {
        return new KnowledgeSource({
            type: KnowledgeSource.URL,
            url: url
        });
    }

    static validate( obj ) {
        if ( obj instanceof KnowledgeSource ) {
            return obj;
        } else {
            throw new Error( 'Not a KnowledgeSource' );
        }
    }

    constructor({
        type = KnowledgeSource.CONVERSATION,
        conversation_id = null,
        url = null,
    } = {}) {
        if ( type !== KnowledgeSource.CONVERSATION && type !== KnowledgeSource.URL ) {
            throw new Error( "KnowledgeSource must be one of CONVERSATION or URL" );
        }
        this.#type = type;
        if ( type === KnowledgeSource.CONVERSATION ) {
            this.#conversation_id = ObjectValidator.isUUIDstring( conversation_id );
        } else if ( type === KnowledgeSource.URL ) {
            this.#url = ObjectValidator.isNotEmpty( url );
        }

        Object.freeze( this );
    }

    // getters
    get type() { return this.#type; }
    get source() { 
        switch( this.#type ) {
            case KnowledgeSource.CONVERSATION: return this.#conversation_id;
            case KnowledgeSource.URL: return this.#url;
            default:
                throw new Error( "Impossible!  How did you set the type to an invalid value?" );
        }
    }


}