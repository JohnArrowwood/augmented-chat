class GlobalMessageBus extends Observable {
    static instance;

    constructor() {
        if ( GlobalMessageBus.instance ) {
            return GlobalMessageBus.instance;
        }
        super();
        GlobalMessageBus.instance = this;
    }
}