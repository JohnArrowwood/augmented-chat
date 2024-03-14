class Observable {
    
    #emitter;
    #wildcard;

    constructor() {
        this.#emitter = document.createElement('div');
        this.#wildcard = new Set();
    }

    #normalize( name ) {
        if ( typeof name !== 'symbol' )
            throw new Error('Observables require message types to be symbols' );
        return name.toString();
    }

    subscribe( name, callback ) {
        if ( name === MessageType.EVERYTHING ) {
            if ( ! this.#wildcard.has( callback ) )
                this.#wildcard.add( callback );
        }
        this.#emitter.addEventListener( this.#normalize( name ) , callback );
        return this;
    }

    unsubscribe( name, callback ) {
        if ( name === MessageType.EVERYTHING ) {
            if ( this.#wildcard.has( callback ) )
                this.#wildcard.delete( callback );
        }
        this.#emitter.removeEventListener( this.#normalize( name ), callback );
        return this;
    }

    emit( name, data ) {
        name = this.#normalize( name );
        try {
            this.#emitter.dispatchEvent( new CustomEvent( name, { detail: data } ) );
            if ( this.#wildcard.size > 0 ) {
                this.#emitter.dispatchEvent( 
                    new CustomEvent( 
                        this.#normalize( MessageType.EVERYTHING ), 
                        { detail: { event: name, data: data } } 
                    ) 
                );
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
