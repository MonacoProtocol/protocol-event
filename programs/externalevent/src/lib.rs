pub mod context;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

use crate::context::*;
use crate::state::event_account::Event;

#[cfg(feature = "stable")]
declare_id!("5qCutonYoeg1aRK31mv4oQYoKdNFMpPaEtDe9nnNQXXf");
#[cfg(feature = "dev")]
declare_id!("5qCutonYoeg1aRK31mv4oQYoKdNFMpPaEtDe9nnNQXXf");
#[cfg(not(any(feature = "stable", feature = "dev")))]
declare_id!("5qCutonYoeg1aRK31mv4oQYoKdNFMpPaEtDe9nnNQXXf");

#[program]
pub mod externalevent {
    use super::*;

    pub fn create_event(
        ctx: Context<CreateEvent>,
        name: String,
        start_expected_timestamp: i64,
        participants: Vec<String>,
        oracle: String,
        oracle_reference: String,
    ) -> Result<()> {
        instructions::create(ctx, name, start_expected_timestamp, participants, oracle, oracle_reference)?;
        Ok(())
    }
}
