class NavigationController {
    static instance;
    #bus; // the global message bus

    constructor() {
        if ( NavigationController.instance ) {
            return NavigationController.instance.#init();
        }
        this.#init();
        NavigationController.instance = this;
    }

    #init() {
        return (
            this.#initBus()
                .#initNavigationListeners()
        );
    }

    #initBus() {
        this.#bus = new GlobalMessageBus();
        return this;
    }

    #initNavigationListeners() {
        let nav = document.getElementById( 'nav' );
        if ( ! nav ) throw new Error( 'Your document lacks a <div id="nav"> element.' );
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
