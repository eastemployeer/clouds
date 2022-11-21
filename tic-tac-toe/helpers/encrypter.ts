import bcrypt from "bcrypt";

export const genSalt = async (rounds = 10) => await bcrypt.genSalt(rounds);
export const hash = async (data: string, salt: string) => await bcrypt.hash(data, salt);
export const compare = async (data: string, encrypted: string) => await bcrypt.compare(data, encrypted);
