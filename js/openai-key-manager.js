class OpenAIKeyManager {

    static get #LOCATION() {
        return "OpenAI.api.key";
    }

    static for ( element ) {
        return new OpenAIKeyManager( element );
    }

    #element;
    #event_handler;

    constructor( element = null ) {
        this.#initHandler();
        if ( element ) this.element( element );
    }

    #initHandler() {
        let self = this;
        this.#event_handler = function() {
            self.key = this.value;
        };
    }

    element( element ) {
        if ( this.#element ) {
            this.#element.removeEventListener('change', this.#event_handler );
        }
        this.#element = element;
        if ( element ) {
            element.value = this.key;
            element.addEventListener('change', this.#event_handler );
        }
        return this;
    }

    get key() {
        return localStorage.getItem( OpenAIKeyManager.#LOCATION );
    }

    set key( value ) {
        localStorage.setItem( OpenAIKeyManager.#LOCATION, value );
    }
    
}