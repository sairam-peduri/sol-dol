import { AnchorProvider, Program } from '@coral-xyz/anchor';
import idl from '../idl/micro_savings.json';
import { PROGRAM_ID } from '../constants';

const provider = new AnchorProvider(connection, wallet, {});
const program = new Program(idl, PROGRAM_ID, provider);
