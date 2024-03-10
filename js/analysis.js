class Analysis {
    #id; // READ-ONLY - record id
    #article_id; // READ-ONLY - which article to analyze
    #status; // current status of the analysis
    #notes; // any analysis outcome notes
    #created_date; // READ-ONLY - when this record was created
    #analysis_started_date; // when the analysis began
    #analysis_completed_date; // when the analysis was completed

    constructor({
        id = crypto.randomUUID(),
        article_id = null,
        status = Status.NEW,
        notes = "",
        created_date = Date.now(),
        analysis_started_date = null,
        analysis_completed_date = null,
    } = {}) {
        this.#id = ObjectValidator.isUUIDstring( id );
        this.#article_id = ObjectValidator.isUUIDstring( article_id );
        this.#status = ObjectValidator.isValidStatus( status );
        this.#notes = ObjectValidator.isString( notes );
        this.#created_date = ObjectValidator.isInteger( created_date );
        this.#analysis_started_date = analysis_started_date ? ObjectValidator.isInteger( analysis_started_date ) : null;
        this.#analysis_completed_date = analysis_completed_date ? ObjectValidator.isInteger( analysis_completed_date ) : null;
    }

    // getters
    get id() { return this.#id; }
    get article_id() { return this.#article_id; }
    get status() { return this.#status; }
    get notes() { return this.#notes; }
    get created_date() { return this.#created_date; }
    get analysis_started_date() { return this.#analysis_started_date; }
    get analysis_completed_date() { return this.#analysis_completed_date; }

    begin() {
        if ( this.#status !== Status.NEW ) {
            throw new Error( "Can only begin analysis that has not already begun" );
        }
        this.#analysis_started_date = Date.now();
        this.#status = Status.IN_PROGRESS;
    }

    end( status, notes ) {
        if ( this.#status !== Status.IN_PROGRESS ) {
            throw new Error( "Can only complete an analysis that has been started" );
        }
        this.#analysis_completed_date = Date.now();
        this.#status = ObjectValidator.isValidStatus( status );
        this.#notes = ObjectValidator.isNotEmpty( notes );
    }

    // TODO: Figure out how to persist

}
