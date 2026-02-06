export const OUR_TEAM_NAME = 'SD Unión Club';
export const OUR_TEAM_LOGO = 'https://upload.wikimedia.org/wikipedia/en/0/01/Uni%C3%B3n_Club_Astillero.png';

const opponentLogos: Record<string, string> = {
  'CD Guarnizo C': 'https://upload.wikimedia.org/wikipedia/en/c/c0/CD_Guarnizo.png',
};

export function getOpponentLogo(opponent: string): string | undefined {
  return opponentLogos[opponent];
}
