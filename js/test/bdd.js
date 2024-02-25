class BDD {
    static KNOWN_STYLES = [ "text", "md", "html" ];
    static default_style = "text";
    static override_disabled = false;
    #mode;
    #disabled;
    #text;
    #style;

    constructor() {
        this.#mode = null;
        this.#disabled = false;
        this.#text = [];
        this.#style = BDD.default_style;
    }

    static get RUN_ALL () {
        this.override_disabled = true;
        return BDD;
    } 

    static style ( value ) {
        if ( ! this.KNOWN_STYLES.includes( value ) ) {
            throw new Error( "Style should be one of 'text' | 'md' | 'html'" );
        }
        BDD.default_style = value;
        return BDD;
    }

    static get plain_text () {
        return BDD.style( 'text' );
    }

    static get markdown () {
        return BDD.style( 'md' );
    }

    static get html () {
        return BDD.style( 'html' );
    }

    static test( text ) {
        return new BDD().test( text );
    }

    static given( text ) {
        return new BDD().given( text );
    }

    static get ENABLED() {
        return new BDD().enabled();
    }

    static get DISABLED() {
        return new BDD().disabled();
    }

    style( value ) {
        if ( ! BDD.KNOWN_STYLES.includes( value ) ) {
            throw new Error( "Style should be one of 'text' | 'md' | 'html'" );
        }
        this.#style = value;
        return this;    
    }

    get plain_text () {
        return this.style( 'text' );
    }

    get markdown () {
        return this.style( 'md' );
    }

    get html () {
        return this.style( 'html' );
    }

    enabled() {
        this.#disabled = false;
        return this;
    }

    disabled() {
        this.#disabled = true;
        return this;
    }

    #verb( mode, text ) {
        if ( mode !== 'test' && mode !== 'and' ) this.#mode = mode;
        this.#text.push( { action: mode, text: text } );
        return this;
    }

    test( text ) {
        if ( this.#mode !== null ) throw new Error( `'test' not allowed after ${this._mode}` );
        return this.#verb( 'test', text );
    }
    given( text ) {
        if ( this.#mode !== null ) throw new Error( `'given' not allowed after ${this._mode}` );
        return this.#verb( 'given', text );
    }

    when( text ) {
        if ( this.#mode !== 'given' ) throw new Error( `'when' not allowed after ${this._mode}` );
        return this.#verb( 'when', text );
    }

    then( text, callback ) {
      if ( this.#mode !== 'when' ) throw new Error( `'then' not allowed after ${this._mode}` );
      this.#verb( 'then', text );
      let create_test = this.#disabled && ! BDD.override_disabled ? xit : it;
      create_test( this.test_description(), callback );
    }

    and( text ) {
      if ( this.#mode === null ) throw new Error( `Must not start BDD sequence with 'and'` );
      return this.#verb( 'and', text );
    }

    plain_text_description() {
      return this.#text.map( (t) => t.action.toUpperCase() + " " + t.text ).join( " | " );
    }
    markdown_description() {
      return this.#text.map( (t) => "*" + t.action.toUpperCase() + "* " + t.text ).join( " | " );
    }
    html_description() {
      return this.#text.map( (t) => "<b>" + t.action.toUpperCase() + "</b> " + t.text ).join( " | " );
    }
    test_description() {
      switch (this.#style) {
        case "md": return this.markdown_description();
        case "html": return this.html_description();
        default: return this.plain_text_description();
      }
    }
}
window.test = BDD.test;
window.given = BDD.given;

    /*
    window.given = (g) => {
      let desc = [ "GIVEN " + g ];
      let o = {};

      o.and = (a) => {
        desc.push("  AND " + a);
        return o;
      };

      o.when = (w) => {
        desc.push( " WHEN " + w );

        o.then = (t, f) => {
          desc.push( " THEN " + t );
          it(desc.join(" | "), f);
        };

        return o;
      };

      return o;
    };
    */