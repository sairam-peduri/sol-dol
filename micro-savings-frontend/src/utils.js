import { PublicKey } from "@solana/web3.js";

export const getProgram = (anchor, idl, provider) => {
  return new anchor.Program(idl, new PublicKey(PROGRAM_ID), provider);
};
