export interface Environment {
  production: boolean;
  apiUrl: string;
}

export const environment: Environment = {
  production: true,
  apiUrl: 'https://r8titapi1.azurewebsites.net',
};
