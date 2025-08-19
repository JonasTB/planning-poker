# Planning Poker - Sistema de Votação de Tarefas

## Tecnologias

### Backend
- **NestJS**: Framework para a criação de rotas e lógica do servidor.
- **WebSockets** (com **Socket.io**): Para comunicação em tempo real entre os clientes.
- **TypeORM** ou **Prisma**: Para gerenciar o banco de dados (PostgreSQL ou outro relacional).
- **JWT**: Para autenticação de usuários (opcional).
- **Docker**: Para containerização do backend (opcional).
- **Swagger**: Para documentação automática da API.
- **NestJS Logger**: Para registrar log de cada requisição feita por usuário.

### Frontend
- **Next.js**: Para renderização rápida e fácil integração com APIs RESTful.
- **Socket.io-client**: Para se conectar ao servidor WebSocket e interagir em tempo real.
- **React**: Para construção dos componentes de UI (ex. mesa, botões, cartas).
- **Chakra UI** ou **TailwindCSS**: Para estilização rápida e responsiva (opcional).
- **React Context** ou **Redux**: Para gerenciar o estado global da aplicação (ex. estado da sala e votação).

## Regras de Negócio

1. **Criação da Sala**:
   - O backend deve permitir a criação de salas de planejamento com um limite máximo de 10 pessoas.
   - Cada sala terá um ID único e poderá ter um dono (criador da sala).
   - Os usuários poderão se juntar a uma sala existente usando o ID da sala.

2. **Gestão de Perfil**:
   - O sistema criará um perfil para cada usuário que se juntar a uma sala.
   - Cada perfil terá as informações básicas (nome, avatar, etc.).
   - Cada sala manterá um conjunto de perfis ativos de usuários que se juntaram à sala.

3. **Mesa Central**:
   - A sala terá uma “mesa” fictícia onde o dono da sala pode iniciar a votação.
   - Inicialmente, o botão de **"Iniciar Planning"** ficará disponível apenas para o dono da sala.

4. **Votação Secreta**:
   - Quando o dono da sala clicar em **"Iniciar Planning"**, as cartas com as opções de tempo serão exibidas.
   - Cada participante poderá votar secretamente selecionando uma carta.
   - As cartas disponíveis são:  
     ```
     1 = 4h
     2 = 1d
     3 = 1d 4h
     5 = 2d 4h
     8 = 3d 4h
     13 = 1s
     ```
   - A votação será feita de forma secreta até que o dono da sala decida revelar as votações.

5. **Mostrar Votação**:
   - O dono da sala poderá clicar no botão **"Mostrar Votação"** para revelar as cartas votadas por todos os participantes.
   - Cada voto será mostrado ao redor da mesa fictícia, com o nome do participante e o número votado.

6. **Análise da Votação**:
   - Após a votação, os participantes poderão discutir e analisar qual será a nota prevalente.
   - A nota prevalente será decidida pelo grupo ou poderá ser escolhida pelo dono da sala.

7. **Reiniciar a Votação**:
   - Após a análise, o dono da sala poderá clicar em um ícone de **reload** (símbolo da mesa) para reiniciar a votação.
   - A votação será limpa e as cartas serão ocultadas até o próximo ciclo de votação.

8. **Backend**:
   - O backend será responsável por:
     - Criar e gerenciar salas de planejamento.
     - Gerenciar os perfis dos usuários dentro das salas.
     - Controlar o estado da votação (se está em andamento, fechado, etc.).
     - Armazenar os votos feitos pelos usuários e gerenciar o processo de votação secreta.
     - Controlar a sequência de ações (ex: iniciar planejamento, mostrar votação, reiniciar).
     - **Documentação e Swagger**: Toda a API do backend será documentada utilizando o **Swagger**, permitindo fácil visualização e teste das rotas.
     - **Logger**: Utilizar o logger do NestJS para registrar todas as requisições feitas pelos usuários, com detalhes sobre a ação executada e quem fez a requisição.

9. **Frontend**:
   - O frontend será responsável por:
     - Exibir a mesa fictícia e as cartas de votação.
     - Mostrar os botões interativos, como "Iniciar Planning", "Mostrar Votação" e "Reiniciar".
     - Mostrar os votos de todos os participantes quando o dono da sala clicar em **"Mostrar Votação"**.
     - Recarregar a interface para permitir uma nova votação.

## Fluxo de Requisições

1. **Criação de Sala**:
   - **POST /rooms** (backend): Cria uma sala de planejamento e retorna o ID da sala.
   - **GET /rooms/:roomId** (backend): Retorna as informações de uma sala (usuários, estado atual, etc.).

2. **Entrar na Sala**:
   - **POST /rooms/:roomId/players** (backend): O usuário entra na sala e cria um perfil.

3. **Iniciar Votação**:
   - **POST /rooms/:roomId/start** (backend): Inicia o processo de planejamento e torna as cartas visíveis para os participantes.

4. **Votação Secreta**:
   - **POST /rooms/:roomId/vote** (backend): Envia o voto do participante para ser registrado de forma secreta.

5. **Mostrar Votação**:
   - **POST /rooms/:roomId/reveal** (backend): Revela os votos dos participantes quando o dono da sala clicar em "Mostrar Votação".

6. **Reiniciar Votação**:
   - **POST /rooms/:roomId/reset** (backend): Reinicia a votação e limpa os votos.

## Implementação do Swagger e Logger

- **Swagger**:
  - Use o **@nestjs/swagger** para gerar a documentação automaticamente.
  - Adicione anotações nas suas rotas, como `@ApiTags()`, `@ApiOperation()`, e `@ApiResponse()` para melhorar a documentação.

- **Logger**:
  - Utilize o logger do NestJS em cada serviço e controlador.
  - Exemplo de utilização:
    ```typescript
    import { Logger } from '@nestjs/common';
    const logger = new Logger('PlanningPoker');
    logger.log('Requisição recebida para votar');
    ```

---

Esse é o arquivo `.md` para o seu projeto. Você pode usá-lo como base para documentar as principais funcionalidades, fluxos e as tecnologias utilizadas. Caso precise de mais detalhes ou ajustes, posso ajudar a refinar!
