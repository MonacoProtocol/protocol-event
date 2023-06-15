use anchor_lang::prelude::*;
use crate::state::type_size::{BOOL_SIZE, CHAR_SIZE, DISCRIMINATOR_SIZE, I64_SIZE, option_size, PUB_KEY_SIZE, U64_SIZE, vec_size};

#[account]
pub struct Event {
    pub authority: Pubkey,
    pub payer: Pubkey,

    pub category: Category,
    pub event_group: EventGroup,

    pub active: bool,

    pub slug: String, // event identifier e.g. LAFCvLAG@2021-08-28
    pub name: String, // for display purposes e.g. Los Angeles Football Club vs. LA Galaxy

    pub participants: Vec<u16>,

    pub expected_start_timestamp: i64,
    pub actual_start_timestamp: Option<i64>,
    pub actual_end_timestamp: Option<i64>,
}

impl Event {
    const MAX_EVENT_SLUG_LENGTH: usize = 25;
    const MAX_EVENT_NAME_LENGTH: usize = 50;
    const MAX_PARTICIPANTS: usize = 300;

    pub const SIZE: usize =
        DISCRIMINATOR_SIZE
            + (PUB_KEY_SIZE * 2)
            + Category::SIZE
            + EventGroup::SIZE
            + BOOL_SIZE
            + vec_size(CHAR_SIZE, Event::MAX_EVENT_SLUG_LENGTH)
            + vec_size(CHAR_SIZE, Event::MAX_EVENT_NAME_LENGTH)
            + U64_SIZE
            + vec_size(U64_SIZE, Event::MAX_PARTICIPANTS)
            + option_size(I64_SIZE) * 2;
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub struct Category {
    pub id: String, // category identifier e.g. FOOTBALL
    pub name: String, // for display purposes e.g Football
}

impl Category {
    const MAX_ID_LENGTH: usize = 10;
    const MAX_CATEGORY_NAME_LENGTH: usize = 25;

    const SIZE: usize =
        vec_size(CHAR_SIZE, Category::MAX_ID_LENGTH)
        + vec_size(CHAR_SIZE, Category::MAX_CATEGORY_NAME_LENGTH);
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub struct EventGroup {
    pub id: String, // event group identifier e.g. MLS
    pub name: String, // for display purposes e.g. Major League Soccer
}

impl EventGroup {
    const MAX_ID_LENGTH: usize = 10;
    const MAX_EVENT_GROUP_NAME_LENGTH: usize = 25;

    const SIZE: usize =
        vec_size(CHAR_SIZE, EventGroup::MAX_ID_LENGTH)
            + vec_size(CHAR_SIZE, EventGroup::MAX_EVENT_GROUP_NAME_LENGTH);
}
