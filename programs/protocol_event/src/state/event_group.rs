use crate::state::type_size::{vec_size, CHAR_SIZE, DISCRIMINATOR_SIZE, PUB_KEY_SIZE};
use anchor_lang::prelude::*;

#[account]
pub struct EventGroup {
    pub authority: Pubkey,
    pub subcategory: Pubkey,
    pub code: String,
    pub name: String,
    pub payer: Pubkey,
}

impl EventGroup {
    pub const MAX_CODE_LENGTH: usize = 8;
    pub const MAX_NAME_LENGTH: usize = 50;

    pub const SIZE: usize = DISCRIMINATOR_SIZE
        + PUB_KEY_SIZE * 3
        + vec_size(CHAR_SIZE, EventGroup::MAX_CODE_LENGTH)
        + vec_size(CHAR_SIZE, EventGroup::MAX_NAME_LENGTH);
}
