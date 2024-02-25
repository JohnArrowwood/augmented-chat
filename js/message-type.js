const MessageType = Object.freeze({
    TRANSACTION_BEGIN: Symbol('transactionBegin'),
    TRANSACTION_END: Symbol('transactionEnd'),
    USER_NAVIGATION: Symbol('userNavigation'),
    CONFIGURATION_TOGGLE: Symbol( 'configurationToggle' )
});