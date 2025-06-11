use anchor_lang::prelude::*;

declare_id!("AXP5XUGdGcAYpmxzmJr54vrvdvgbsohGDNA3hUJ3oC3B");

#[program]
pub mod micro_savings {
    use super::*;

    pub fn initialize_account(ctx: Context<Initialize>) -> Result<()> {
        let savings = &mut ctx.accounts.savings;
        savings.user = ctx.accounts.user.key();
        savings.balance = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let savings = &mut ctx.accounts.savings;
        savings.balance += amount;
        Ok(())
    }
}

#[account]
pub struct Savings {
    pub user: Pubkey,
    pub balance: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 32 + 8)]
    pub savings: Account<'info, Savings>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, has_one = user)]
    pub savings: Account<'info, Savings>,
    #[account(mut)]
    pub user: Signer<'info>,
}