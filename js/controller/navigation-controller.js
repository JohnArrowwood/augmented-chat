class NavigationController {
    #bus; // the global message bus

    constructor( element ) {
        this.#initBus();
        if ( element ) this.#initNavigationListeners( element );
        NavigationController.instance = this;
    }

    #initBus() {
        this.#bus = new GlobalMessageBus();
        return this;
    }

    #initNavigationListeners( nav ) {
        let items = nav.getElementsByClassName( 'item' );
        for ( let i = 0 ; i < items.length ; i++ ) {
            this.handle( items[i] );
        }
        return this;
    }

    handle( item ) {
        let toggle = item.getAttribute( 'data-config' );
        if ( toggle ) {
            item.addEventListener( 'click', () => {
                this.#bus.emit( MessageType.CONFIG_TOGGLE, toggle );
            });
        }
        ( Array
            .from( item.classList )
            .filter( c => c !== "item" )
            .forEach( c => {
                item.addEventListener( 'click', () => {
                    this.#bus.emit( MessageType.USER_NAVIGATION, c );
                });
            })
        );
        return this;
    }

}
