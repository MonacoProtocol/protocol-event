use anchor_lang::prelude::*;

#[error_code]
pub enum EventError {
    #[msg("Max string length exceeded")]
    MaxStringLengthExceeded,
    #[msg("Max event participants exceeded")]
    MaxParticipantsExceeded,
    #[msg("Attempted to add invalid event participants")]
    InvalidEventParticipants,
    #[msg("Attempted to add a duplicate participant")]
    DuplicateEventParticipants,
    #[msg("Authority mismatch")]
    AuthorityMismatch,
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
}
