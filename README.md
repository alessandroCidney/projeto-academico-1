# CompanyCulture

## Do que se trata este projeto?
Este é um projeto desenvolvido por Alessandro Cídney para o Projeto Integrador de Competências em Ciência da Computação II da universidade Cruzeiro do Sul Virtual em 2024.

Trata-se de um site para preservar a cultura de empresas. Ele possibilita a postagem de artigos, notícias e a interação entre os usuários cadastrados, funcionalidades que seriam muito úteis para uma empresa com o objetivo citado anteriormente (caso fosse utilizado por uma).

## Qual a arquitetura do projeto?
O projeto utiliza o framework **Nuxt.js** para o front-end (o qual utiliza como base o **Vue.js**) e é interligado ao ecossistema do **Firebase**, plataforma da Google que provê uma série de funcionalidades, como sistemas de autenticação, bancos de dados, etc.

Como banco de dados, foi utilizado o Firestore, que é um banco de dados não relacional do Firebase/Google semelhante ao MongoDB.

## Como utilizar o projeto?
Você pode utilizar o site do projeto acessando a URL [https://companyculture-pit.web.app/auth/login](https://companyculture-pit.web.app/auth/login).

## Como rodar o projeto localmente?
Para rodar o projeto localmente, é preciso realizar algumas configurações e é necessário possuir um ambiente criado e configurado no Firebase da Google.

### Considerações iniciais
Para melhorar a compatibilidade, o projeto foi desenvolvido no sistema Linux/Ubuntu utilizando o WSL. Portanto, pode ser que hajam problemas na execução em outros ambientes.

### Clonando o repositório
Para iniciar a configuração, você precisa ter o projeto em sua máquina. Você pode obtê-lo pelo Github utilizando as opções de cloná-lo com comandos Git ou fazendo o download diretamente.

### Instalando o Node.js
Como trata-se de um projeto JavaScript, é recomendando ter o Node.js instalado para executá-lo. Para realizar a instalação de acordo com seu sistema, acesse a página de instruções de instalação do Node.js clicando neste link [https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager).

### Instalando o Yarn
O projeto foi criado utilizando o **yarn** ao invés do **npm** para controle de dependências. Portanto, após a instalação do Node.js e, consequentemente, do npm, instale o yarn utilizando o comando abaixo:

```
npm install --global yarn
```

### Instalando as dependências
Para instalar as dependências utilizadas no projeto, utilize o comando a seguir:

```
yarn install
```

### Configurando o Firebase e variáveis de ambiente
Para configurar o Firebase, acesse o console do Firebase e se cadastre por meio do link [https://console.firebase.google.com/](https://console.firebase.google.com/).

Após isso, é necessário realizar as seguintes configurações:

- Crie um novo projeto no Firebase e acesse-o
- Ao acessar o projeto, crie um novo app por meio do botão de "Adicionar app" (ou alguma outra opção similar) e siga todas as etapas indicadas
- Por meio da barra lateral esquerda, busque e ative as seguintes funcionalidades: Firestore Database, Authentication, Storage, Hosting
  - Para ativar cada um deles, acesse o item na barra lateral, aguarde o carregamento da página, clique no botão de ativação e siga as etapas indicadas
  - Ao ativar o Authentication, certifique-se de habilitar como provedores de login os métodos "E-mail/senha" e "Google"
- Acesse a área de **Configurações do Projeto** clicando no ícone de engrenagem no canto superior da barra lateral
- Desça até a seção de **Configuração do SDK** e procure pelas variáveis utilizadas na configuração do Firebase
- Crie um arquivo **.env** na raíz do projeto e preencha-o conforme indicado no arquivo **.env.example**

### Deploy inicial
Para que o projeto funcione corretamente, é preciso fazer um deploy inicial para certificar que as configurações para os serviços do Firebase sejam aplicadas corretamente. Portanto, após fazer todas as configurações anteriores e seguir todas as orientações das páginas do Firebase, utilize os comandos a seguir:

Para se autenticar:
```
firebase login
```

Para fazer o deploy:
```
firebase deploy
```
