use crate::state::type_size::{
    option_size, vec_size, BOOL_SIZE, CHAR_SIZE, DISCRIMINATOR_SIZE, I64_SIZE, PUB_KEY_SIZE,
    U16_SIZE, U64_SIZE,
};
use anchor_lang::prelude::*;

#[account]
pub struct Event {
    pub authority: Pubkey,
    pub subcategory: Pubkey,
    pub event_group: Pubkey,
    pub active: bool,

    pub payer: Pubkey,

    pub code: String, // event identifier e.g. LAFCvLAG@2021-08-28
    pub name: String, // for display purposes e.g. Los Angeles Football Club vs. LA Galaxy

    pub participants: Vec<u16>,

    pub expected_start_timestamp: i64,
    pub actual_start_timestamp: Option<i64>,
    pub actual_end_timestamp: Option<i64>,
}

impl Event {
    pub const MAX_CODE_LENGTH: usize = 25;
    pub const MAX_NAME_LENGTH: usize = 50;
    pub const MAX_PARTICIPANTS: usize = 300;

    pub const SIZE: usize = DISCRIMINATOR_SIZE
        + (PUB_KEY_SIZE * 4)
        + BOOL_SIZE
        + vec_size(CHAR_SIZE, Event::MAX_CODE_LENGTH)
        + vec_size(CHAR_SIZE, Event::MAX_NAME_LENGTH)
        + U64_SIZE
        + vec_size(U16_SIZE, Event::MAX_PARTICIPANTS)
        + option_size(I64_SIZE) * 2;
}
