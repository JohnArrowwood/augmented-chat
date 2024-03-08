class MessageValidator extends ObjectValidator {

    source_is_set() {
        return this.test( m => {
            expect( m.source ).to.not.be.null;
            expect( m.source ).to.be.instanceof( Symbol );
        });
    }

}   

function ValidateMessage ( message ) {
    return new MessageValidator( message );
}