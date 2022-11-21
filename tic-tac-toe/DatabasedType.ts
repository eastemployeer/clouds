/* eslint-disable camelcase */

// export enum Tables {
//   Klient = 'klient',
//   Naprawa = 'naprawa',
//   Pracownik = 'pracownik',
//   RodzajSprzetu = 'rodzaj_sprzetu',
//   Sprzet = 'sprzet',
//   UslugaSerwisowa = 'usluga_serwisowa',
//   WykonanaUslugaSerwisowa = 'wykonana_usluga_serwisowa',
//   Wypozyczenie = 'wypozyczenie',
//   WypozyczonySprzet = 'wypozyczony_sprzet',
// }

export const Tables = {
  Users: 'users',
};

export interface User {
  id: string;
  email: string;
  password: string;
  wins: number;
  loses: number;
}