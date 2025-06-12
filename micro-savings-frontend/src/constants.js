// src/constants.js
import { PublicKey } from "@solana/web3.js";
import process from 'process/browser.js';

export const PROGRAM_ID = new PublicKey(process.env.REACT_APP_PROGRAM_ID);

