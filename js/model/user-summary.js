class UserSummary {
    #created_date;
    #summary;

    constructor({
        created_date = Date.now(),
        summary = ""
    } = {} ) {
        this.#created_date = ObjectValidator.isInteger( created_date );
        this.#summary = ObjectValidator.isNotEmpty( summary );

        Object.freeze( this );
    }

    // getters
    get created_date() { return this.#created_date; }
    get summary() { return this.#summary; }
}