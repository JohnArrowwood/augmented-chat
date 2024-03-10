const Status = Object.freeze({
    NEW: Symbol( 'new-analysis' ),
    IN_PROGRESS: Symbol( 'analysis-in-progress'),
    FAILED: Symbol( 'analysis-failed' ),
    CONFIRMED: Symbol('analysis-confirms' ),
    REFUTED: Symbol( 'analysis-refutes' ),
    UNCLEAR: Symbol( 'analysis-unclear' ),
});