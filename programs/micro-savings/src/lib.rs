use anchor_lang::prelude::*;

declare_id!("AXP5XUGdGcAYpmxzmJr54vrvdvgbsohGDNA3hUJ3oC3B");

#[program]
:contentReference[oaicite:2]{index=2}
    use super::*;

    pub fn initialize_account(ctx: Context<InitializeAccount>) -> Result<()> {
        let s = &mut ctx.accounts.savings;
        s.user = ctx.accounts.user.key();
        s.balance = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let s = &mut ctx.accounts.savings;
        s.balance += amount;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let s = &mut ctx.accounts.savings;
        require!(s.balance >= amount, ErrorCode::InsufficientFunds);
        s.balance -= amount;
        Ok(())
    }

    pub fn create_goal(ctx: Context<CreateGoal>, amount: u64, description: String) -> Result<()> {
        let g = &mut ctx.accounts.goal;
        g.user = ctx.accounts.user.key();
        g.amount = amount;
        g.saved = 0;
        g.description = description;
        Ok(())
    }

    pub fn deposit_to_goal(ctx: Context<DepositToGoal>, amount: u64) -> Result<()> {
        let g = &mut ctx.accounts.goal;
        require!(g.user == ctx.accounts.user.key(), ErrorCode::Unauthorized);
        g.saved += amount;
        Ok(())
    }
}

#[derive(Accounts)]
:contentReference[oaicite:3]{index=3}
    :contentReference[oaicite:4]{index=4}
    :contentReference[oaicite:5]{index=5}
    :contentReference[oaicite:6]{index=6}
    :contentReference[oaicite:7]{index=7}
}

#[derive(Accounts)]
:contentReference[oaicite:8]{index=8}
    :contentReference[oaicite:9]{index=9}
    :contentReference[oaicite:10]{index=10}
    :contentReference[oaicite:11]{index=11}
}

#[derive(Accounts)]
:contentReference[oaicite:12]{index=12}
    :contentReference[oaicite:13]{index=13}
    :contentReference[oaicite:14]{index=14}
    :contentReference[oaicite:15]{index=15}
}

#[derive(Accounts)]
:contentReference[oaicite:16]{index=16}
    :contentReference[oaicite:17]{index=17}
    :contentReference[oaicite:18]{index=18}
    :contentReference[oaicite:19]{index=19}
    :contentReference[oaicite:20]{index=20}
}

#[derive(Accounts)]
:contentReference[oaicite:21]{index=21}
    :contentReference[oaicite:22]{index=22}
    :contentReference[oaicite:23]{index=23}
    :contentReference[oaicite:24]{index=24}
}

#[account]
:contentReference[oaicite:25]{index=25}

#[account]
:contentReference[oaicite:26]{index=26}
    :contentReference[oaicite:27]{index=27}
    :contentReference[oaicite:28]{index=28}
    :contentReference[oaicite:29]{index=29}
    :contentReference[oaicite:30]{index=30}
}

#[error_code]
:contentReference[oaicite:31]{index=31}
    :contentReference[oaicite:32]{index=32}
    :contentReference[oaicite:33]{index=33}
}
