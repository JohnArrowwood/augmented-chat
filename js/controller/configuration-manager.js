class ConfigurationManager {
    static instance;
    #bus; // the global message bus
    #config; //the DOM element for managing visual state

    constructor() {
        if ( ConfigurationManager.instance ) {
            return ConfigurationManager.instance.#initConfig();
        }
        this.#initBus();
        this.#initConfig();
        ConfigurationManager.instance = this;
    }

    #initBus() {
        this.#bus = new GlobalMessageBus();
        this.#bus.subscribe( MessageType.CONFIG_SET, (event) => this.set( event.detail ) );
        this.#bus.subscribe( MessageType.CONFIG_CLEAR, (event) => this.clear( event.detail ) );
        this.#bus.subscribe( MessageType.CONFIG_TOGGLE, (event) => this.toggle( event.detail ) );
        return this;
    }

    #initConfig() {
        this.#config = document.getElementById( 'config' );
        if ( this.#config === null ) throw new Error( 'Your document lacks a <div id="config"> element.' );
        return this;
    }

    set( setting ) {
        const config = this.#config;
        if ( config.classList.contains( setting ) ) return this;
        config.classList.add( 'transitioning' );
        config.classList.add( setting );
        setTimeout( () => {
            config.classList.remove( 'transitioning' );
        }, 1000 * 1/60 );
        return this;
    }

    clear( setting ) {
        const config = this.#config;
        if ( ! config.classList.contains( setting ) ) return this;
        config.classList.add( 'transitioning' );
        setTimeout( () => {
            config.classList.remove( setting );
            config.classList.remove( 'transitioning' );
        }, 1000 * 1/60 );
        return this;
    }

    toggle( setting ) {
        if ( this.#config.classList.contains( setting ) ) {
            this.clear( setting );
        } else {
            this.set( setting );
        }
    }
}