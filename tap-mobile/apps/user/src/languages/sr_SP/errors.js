export const errors = {

	UNAUTHENTICATE: {
		title: 'Greška pri autentifikaciji',
		message: 'Morate biti ulogovani u aplikaciju da bi ste mogli pristupiti ovom dijelu aplikacije ili nastaviti akciju'
	},
	FORBIDEN: {
		title: 'Nedozvoljen pristup',
		message: 'Nemate potrebne privilegije da bi ste pristupili ovom dijelu aplikacije'
	},
	CONNECTION_TIMEOUT: {
		title: 'Problem sa server konekciom',
		message: 'Maksimalno dozvoljeno vrijeme za odgovor od servera je isteklo'
	},
	TAP_0: {
		title: 'Neočekivana greška',
		message: 'Aplikacija je naišla na nepoznatu grešku. Pomozite nam da poboljšamo vaše iskustvo slanjem izvještaja o grešci'
	},

	APPO_1: {
		title: 'Greška rezervacija termina',
		message: 'Vrijeme za traženi termin više nije dostupno'
	},
	APPO_2: {
		title: '',
		message: ''
	},
	PROV_1: {
		title: 'Greška učitavanja davaoca usluga',
		message: 'Trenutno nije moguće učitati podatke o davaocu usluga'
	},
	U_CACC_1: {
		title: 'Greška pri kreiranju naloga',
		message: 'Došlo je do greške pri pokušaju kreiranja naloga'
	},
	U_CACC_2: {
		title: 'Greška pri kreiranju naloga',
		message: 'Email "{:email}" je već u upotrebi. Upišite drugi email ili koristite već postojeći nalog'
	},
	U_CACC_3: {
		title: 'Greška pri kreiranju naloga',
		message: 'Korisničko ime "{:username}" trenutno postoje. Ono mora biti jedinstveno'
	},
	U_EACC_1: {
		title: 'Greška pri izmjeni naloga',
		message: 'Došlo je do greške pri pokušaju izmjene naloga'
	},
	U_VACC_1: {
		title: 'Greška pri verifikaciji',
		message: 'Trenutni verifikacioni kode je istekao. Pritisnite "Pošalji ponovo" da biste dobili novi kod'
	},
	U_VACC_2: {
		title: 'Greška pri verifikaciji',
		message: 'Pogrešan verifikacioni kod'
	},
	U_UVFY_1: {
		title: 'Neverifikovan nalog',
		message: 'Vaš nalog nije verifikovan'
	},
	INV_EMAIL_1: {
		title: 'Neodgovarajući podaci',
		message: 'Neispravan email'
	},
	SIGN_IN_1: {
		title: 'Greška pri prijavi',
		message: 'Neispravano korisničko ime/email ili lozinka'
	}
}