use anchor_lang::prelude::*;

#[account]
pub struct Event {
    pub authority: Pubkey,
    pub payer: Pubkey,

    pub name: String, // for display purposes e.g. Los Angeles Football Club vs. LA Galaxy
    pub active: bool,

    pub category: Category,
    pub event_group: EventGroup,

    pub participants: Vec<Participant>,

    pub expected_start_timestamp: i64,
    pub expected_end_timestamp: i64,
}

pub struct Category {
    pub id: String, // category identifier e.g. FOOTBALL
    pub name: String, // for display purposes e.g Football
}

pub struct EventGroup {
    pub id: String, // event group identifier e.g. MLS
    pub name: String, // for display purposes e.g. Major League Soccer
}

pub struct Participant {
    pub id: String, // participant identifier e.g. LAFC
    pub name: String, // for display purposes e.g. Los Angeles Football Club
}