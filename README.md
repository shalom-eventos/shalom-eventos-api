# App

Shalom Eventos API.

## Módulo de usuários

### RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar (inscrito);
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser criado uma seed de um usuário administrador padrão;

### RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;

### RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);
- [ ] Todas listas de dados precisam estar paginadas com 20 itens por página;

## Módulo de eventos

### RFs (Requisitos funcionais)

- [x] Deve ser possível cadastrar evento;
- [x] Deve ser possível editar um evento;

### RNs (Regras de negócio)

- [x] Somente administradores devem poder cadastrar e editar eventos;


## Módulo de endereço

### RFs (Requisitos funcionais)

- [x] Deve ser possível cadastrar um endereço para o evento;
- [x] Deve ser possível editar um endereço do o evento;
- [x] Deve ser possível mostrar um endereço do o evento;

### RNs (Regras de negócio)

- [x] Somente administradores devem poder cadastrar e editar endereços;
- [x] Cada evento só poderá ter um endereço;