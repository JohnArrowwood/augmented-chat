class Tag {
    #tag;
    #description;
    #critical;
    #created_date;
    #updated_date;

    static TAG_PATTERN = /^(?=[a-z])[-a-z0-9]+(?<=[a-z0-9])$/;
    static isValid( name ) {
        if ( typeof name !== "string" ) throw new Error( "Tags must be strings" );
        if ( ! Tag.TAG_PATTERN.test( name ) ) throw new Error( "Tags should be all lower-case and words separated by dashes" );
        return name;
    }
    constructor({
        tag = "",
        description = "",
        critical = false,
        created_date = Date.now(),
        updated_date = Date.now(),
    } = {}) {
        this.#tag = Tag.isValid( tag );
        this.#description = ObjectValidator.isNotEmpty( description );
        this.#critical = ObjectValidator.isBoolean( critical );
        this.#created_date = created_date ? ObjectValidator.isInteger( created_date ) : Date.now();
        this.#updated_date = updated_date ? ObjectValidator.isInteger( updated_date ) : Date.now();

        Object.freeze( this );
    }

    // getters
    get tag() { return this.#tag; }
    get description() { return this.#description; }
    get critical() { return this.#critical; }
    get created_date() { return this.#created_date; }
    get updated_date() { return this.#updated_date; }

}