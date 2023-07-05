use anchor_lang::prelude::*;

#[error_code]
pub enum EventError {
    #[msg("Max string length exceeded.")]
    MaxStringLengthExceeded,
    #[msg("Max event participants exceeded.")]
    MaxParticipantsExceeded,
    #[msg("Attempted to add invalid event participants.")]
    InvalidEventParticipants,
}
