const MessageType = Object.freeze({
    EVERYTHING: Symbol( '*' ),
    TRANSACTION_BEGIN: Symbol('transactionBegin'),
    TRANSACTION_END: Symbol('transactionEnd'),
    CONFIG_SET: Symbol( 'configurationSet' ),
    CONFIG_CLEAR: Symbol( 'configurationClear' ),
    CONFIG_TOGGLE: Symbol( 'configurationToggle' ),
    USER_NAVIGATION: Symbol('userNavigation'),
});