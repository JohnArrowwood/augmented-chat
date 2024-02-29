class MessageBusMonitorController {
    // a debug assistant class that listens in on all events that pass through 
    // the message bus and outputs them 
    #bus;
    #element;
    
    constructor( element ) {
        if ( ! element.appendChild ) throw new Error( "Please provide a DOM element" );
        this.#element = element;
        this.#bus = new GlobalMessageBus();
        this.#bus.subscribe( MessageType.EVERYTHING, (event) => {
            this.add( event.detail );
        });
    }

    #time() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const amPm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = String(hours).padStart(2, '0');

        return `${hours}:${minutes}:${seconds} ${amPm}`;
    }

    add( detail ) {
        const parent = document.createElement('div');
        parent.classList.add('event');
        
        const date = document.createElement('div');
        date.classList.add('time');
        date.textContent = this.#time();    
        parent.appendChild( date );
        
        const event = document.createElement('div');
        event.classList.add('name');
        event.textContent = detail.event;
        parent.appendChild( event );

        const data = document.createElement('div');
        data.classList.add('details');
        data.textContent = JSON.stringify( detail.data, null, 4 );
        parent.appendChild( data );

        this.#element.appendChild( parent );
        this.#element.scrollTop = this.#element.scrollHeight;
    }
}