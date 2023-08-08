use crate::state::type_size::{vec_size, CHAR_SIZE, PUB_KEY_SIZE};
use anchor_lang::prelude::*;

#[account]
pub struct Classification {
    pub authority: Pubkey,
    pub code: String,
    pub name: String,
    pub payer: Pubkey,
}

impl Classification {
    pub const MAX_CODE_LENGTH: usize = 8;
    pub const MAX_NAME_LENGTH: usize = 50;

    pub const SIZE: usize = PUB_KEY_SIZE * 2
        + vec_size(CHAR_SIZE, Classification::MAX_CODE_LENGTH)
        + vec_size(CHAR_SIZE, Classification::MAX_NAME_LENGTH);
}
