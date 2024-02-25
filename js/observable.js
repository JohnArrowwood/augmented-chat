class Observable {
    #emitter;
    #using_wildcard;

    constructor() {
        this.#emitter = document.createElement('div');
        this.#using_wildcard = 0;
    }

    #normalize( name ) {
        if ( typeof name === 'symbol' ) return name.toString();
        throw new Error('Observables require message types to be symbols' );
    }

    subscribe( name, callback ) {
        name = this.#normalize( name );
        if ( name === '*' ) this.#using_wildcard += 1;
        this.#emitter.addEventListener( name , callback );
        return this;
    }

    unsubscribe( name, callback ) {
        name = this.#normalize( name );
        if ( name === '*' ) this.#using_wildcard -= 1;
        if ( this.#using_wildcard < 0 ) {
            console.log( "Observable: unsubscribed to '*' more times than it was subscribed to" );
            console.log( callback );
            throw new Error( 'Observable: unbalanced wildcard subscribe/unsubscribe calls' );
        }
        this.#emitter.removeEventListener( name, callback );
        return this;
    }

    emit( name, data ) {
        name = this.#normalize( name );
        try {
            this.#emitter.dispatchEvent( new CustomEvent( name, { detail: data } ) );
            if ( this.#using_wildcard > 0 ) {
                this.#emitter.dispatchEvent( new CustomEvent( '*', { detail: { event: name, data: data } } ) );
            }    
        }
        catch (error) {
            console.log( "Error encountered during event dispatch" );
            console.log( error );
            throw error;
        }
        return this;
    }

    begin() {
        this.emit( MessageType.TRANSACTION_BEGIN, {
            date: new Date(),
            timestamp: performance.now(),
            context: this
         });
    }

    end() {
        this.emit( MessageType.TRANSACTION_END, {
            date: new Date(),
            timestamp: performance.now(),
            context: this
         });
    }
}
