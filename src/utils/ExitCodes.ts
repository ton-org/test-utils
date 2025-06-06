type ReverseMap<T extends Record<string, number>> = {
    [K in keyof T as `${T[K]}`]: K
};

const ExitCodeNumbers = {
    Success: 0,
    ReservedSuccess: 1,
    StackUnderflow: 2,
    StackOverflow: 3,
    IntegerOverflow: 4,
    RangeCheckError: 5,
    InvalidOpcode: 6,
    TypeCheckError: 7,
    CellOverflow: 8,
    CellUnderflow: 9,
    DictionaryError: 10,
    UnknownError: 11,
    FatalError: 12,
    OutOfGas: 13,
    OutOfGasNegative: -14,
    VirtualizationError: 14,
    InvalidActionList: 32,
    ActionListTooLong: 33,
    InvalidOrUnsupportedAction: 34,
    InvalidOutboundSrcAddress: 35,
    InvalidOutboundDestAddress: 36,
    NotEnoughToncoin: 37,
    NotEnoughExtraCurrencies: 38,
    OutboundMessageTooLarge: 39,
    CannotProcessMessage: 40,
    NullLibraryReference: 41,
    LibraryChangeError: 42,
    LibraryLimitsExceeded: 43,
    AccountStateTooLarge: 50,
    NullReference: 128,
    InvalidSerializationPrefix: 129,
    InvalidIncomingMessage: 130,
    ConstraintsError: 131,
    AccessDenied: 132,
    ContractStopped: 133,
    InvalidArgument: 134,
    ContractCodeNotFound: 135,
    InvalidStandardAddress: 136,
    NotBasechainAddress: 138,
    UnrecognizedMessageOpcode: 65535
} as const;

const ExitCodeNames = Object.fromEntries(
    Object.entries(ExitCodeNumbers).map(([k, v]) => [v, k])
) as ReverseMap<typeof ExitCodeNumbers>;

export const ExitCodes = {
    ...ExitCodeNumbers,
    ...ExitCodeNames,
}
