export const errors = {
	APPO_1: {
		title: 'Greška rezervacija termina',
		message: 'Vrijeme za traženi termin više nije dostupno'
	},
	APPO_2: {
		title: 'Greška pri promjeni statusa',
		message: 'Nije moguće promijeniti status termina'
	},
	APPO_3: {
		title: 'Greška pri promjeni statusa',
		message: 'Vrijeme za promjenu termina je isteklo. Minimalno vrijeme za promjenu statusa je {:min} minuta prije početka termina.'
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
	}
}