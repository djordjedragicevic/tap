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
		message: 'Aplikacija je naišla na neočekivanu grešku. Pomozite nam da poboljšamo vaše iskustvo slanjem izvještaja o grešci'
	},
	INV_EMAIL_1: {
		title: 'Neodgovarajući podaci',
		message: 'Neispravan email'
	},
	SIGN_IN_1: {
		title: 'Greška pri prijavi',
		message: 'Neispravano korisničko ime/email ili lozinka'
	},
	U_UVFY_1: {
		title: 'Neverifikovan nalog',
		message: 'Vaš nalog nije verifikovan'
	},
	B_APP_ST_1: {
		title: 'Greška statusa rezervacije',
		message: 'Više nije moguća izmjena statusa rezervacije'
	},
	B_APP_ST_2: {
		title: 'Greška statusa rezervacije',
		message: 'Nije moguće prihvatiti rezervaciju ako je trenutni status {:status} '
	},
	B_APP_1: {
		title: 'Kreiranje rezervacije',
		message: 'Došlo je do greške pri pokušaju kreiranje rezervacije'
	},
	B_APP_2: {
		title: 'Kreiranje vremenskog perioda',
		message: 'Došlo je do greške pri pokušaju kreiranje vremenskog perioda'
	}
}