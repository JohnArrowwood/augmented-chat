class UserInputController {
    #input;
    #bus;

    constructor( element ) {
        if ( element.tagName !== 'TEXTAREA' ) throw new Error( "User Input must be a textarea" );
        this.#bus = new GlobalMessageBus();
        this.#input = element;

        this
            .#bus
            .subscribe( MessageType.CONVERSATION_CLEAR, () => this.clear() )
            .subscribe( MessageType.USER_INPUT_CLEAR, () => this.clear() )
            .subscribe( MessageType.USER_INPUT_SET, ( event ) => this.set( event.detail ) )
            .subscribe( MessageType.USER_INPUT_SEND, () => this.send() )
        ;

        this.#input.addEventListener( 'input', () => this.resize() );
        this.#input.addEventListener( 'keydown', ( event ) => {
            const isEnter = event.key === 'Enter';
            const withShift = event.shiftKey;
            if ( isEnter && ! withShift ) {
                this.#bus.emit( MessageType.USER_INPUT_SEND, null );
                event.preventDefault();
            }
        });
    }

    clear() {
        this.#input.value = '';
        this.#input.style.height = 'auto';
    }

    get() {
        return this.#input.value;
    }

    set( value ) {
        this.#input.value = value;
    }

    send() {
        let value = this.#input.value.trim();
        if ( value ) {
            this.#bus.emit( MessageType.MESSAGE, 
                new Message()
                    .withSource( Source.USER )
                    .withMessage( this.get() )
            );
        }
        this.clear();
    }

    resize() {
        this.#input.style.height = 'auto';
        this.#input.style.height = this.#input.scrollHeight + 'px';
    }
}