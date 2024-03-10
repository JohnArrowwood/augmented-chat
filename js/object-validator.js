class ObjectValidator {

    static UUID_PATTERN = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

    #object;
    #validations;

    constructor( object ) {
        this.#object = object;
        this.#validations = [];
        return new Proxy(this, {
            get(target, prop, receiver) {
                let field;

                if (prop in target) {

                    if (typeof target[prop] === "function") {
                        return target[prop].bind(target);
                    }
                    return target[prop];

                } else if ( prop.endsWith( '_is_uuid' ) ) {  

                    field = prop.replace( /_is_uuid$/, "" );
                    target.test( m => {
                        expect( m[field] ).to.match( ObjectValidator.UUID_PATTERN );
                    });
                    return receiver;

                } else if ( prop.endsWith( '_is_null' ) ) { 

                    field = prop.replace( /_is_null$/, "" );
                    target.test( m => {
                        expect( m[field] ).to.be.null;
                    });
                    return receiver;

                } else if ( prop.endsWith( '_is_empty' ) ) { 

                    field = prop.replace( /_is_empty$/, "" );
                    target.test( m => {
                        expect( m[field] ).to.be.empty;
                    });
                    return receiver;

                } else if ( prop.endsWith( '_is_set' ) ) { 

                    field = prop.replace( /_is_set$/, "" );
                    target.test( m => {
                        expect( m[field] ).to.not.be.null;
                    });
                    return receiver;

                } else if (prop.endsWith('_is')) {

                    field = prop.replace( /_is$/, "" );
                    return ( value ) => {
                        target.test( m => {
                            expect( m[field] ).to.equal( value );
                        });
                        return receiver;    
                    };

                } else if (prop.endsWith('_matches')) {

                    field = prop.replace( /_matches$/, "" );
                    return ( pattern ) => {
                        target.test( m => {
                            expect( m[field] ).to.match( pattern );
                        });
                        return receiver;    
                    };

                } else if ( prop.endsWith( '_is_future' ) ) {  

                    field = prop.replace( /_is_future$/, "" );
                    target.test( m => {
                        expect( m[field] ).to.be.at.least( Date.now() );
                    });
                    return receiver;

                } else if ( prop.endsWith( '_is_past' ) ) {  

                    field = prop.replace( /_is_past$/, "" );
                    target.test( m => {
                        expect( m[field] ).to.be.at.most( Date.now() );
                    });
                    return receiver;

                } else if ( prop.endsWith( '_is_within' ) ) {  

                    field = prop.replace( /_is_within$/, "" );
                    return ( ms ) => {
                        target.test( m => {
                            expect( Math.abs( Date.now() - m[field] ) ).to.be.at.most( ms );
                        });
                        return receiver;    
                    };

                } else {
                    throw new Error(`Invalid method: ${prop}`);
                }
            }
        });
    }

    static isString( value ) {
        if ( typeof value === "string" ) {
            return value;
        } else {
            throw new Error( "String expected" );
        }
    }

    static isUUIDstring( id ) {
        if ( ObjectValidator.UUID_PATTERN.test( id ) ) {
            return id;
        } else {
            throw new Error( "UUID string expected" );
        }
    }

    static isInteger( value ) {
        if ( Number.isFinite( value ) && Number.isInteger( value ) ) {
            return value;
        } else {
            throw new Error( "Integer value expected")
        }
    }

    static isValidSource( value ) {
        if ( typeof value === "symbol" && Object.values( Source ).includes( value ) ) {
            return value;
        } else { 
            throw new Error( "Known Source expected" );
        }
    }

    static isValidStatus( value ) {
        if ( typeof value === "symbol" && Object.values( Status ).includes( value ) ) {
            return value;
        } else { 
            throw new Error( "Known Status expected" );
        }
    }


    static isNotEmpty( value ) {
        if ( typeof value === "string" && value.length > 0 ) {
            return value;
        } else {
            throw new Error( "Non-empty string expected" );
        }
    }

    test( fn ) {
        this.#validations.push( fn );
        return this;
    }

    validate() {
        const errors = [];
        this.#validations.forEach( (v) => {
            try { 
                v( this.#object ); 
            }
            catch ( error ) {
                errors.push( error );
            }
        });
        if ( errors.length == 0 ) return;
        if ( errors.length == 1 ) throw errors[0];
        if ( errors.length > 1 ) throw new Error( 'Multiple validation errors encountered:', { cause: errors } );
    }
}