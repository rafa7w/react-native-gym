// Padronização das mensagens de erro ou exceções que são tratadas por nós dentro da aplicação

export class AppError {
  message: string;

  constructor(message: string) {
    this.message = message
  }
}