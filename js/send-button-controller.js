class SendButtonController {
    #button;
    #bus;

    constructor( element ) {
        this.#bus = new GlobalMessageBus();
        this.#button = element;

        this.#button.addEventListener( 'click', () => 
            this.#bus.emit( MessageType.USER_INPUT_SEND, null )
        );
    }

    enable() {
        this.#button.disabled = false;
    }

    disable() {
        this.#button.disabled = true;
    }
}
