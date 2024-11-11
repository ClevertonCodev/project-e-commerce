# Sistema E-commerce

Sistema de e-commerce com funcionalidades de carrinho de compras, cadastro de produtos e gestão de pedidos.

## Tecnologias Utilizadas

- **Backend**: Nest.js
- **Frontend**: React.js
- **Banco de Dados**: PostgreSQL (via Docker)
- **ORM**: Prisma

## Configuração do Ambiente

### Backend (Nest.js)

1. Instale as dependências:
```bash
npm install
```

2. Configure o ambiente:
   - Copie o arquivo `.env-example` para `.env`
   - Preencha as variáveis de ambiente necessárias

3. Inicie o banco de dados:
```bash
docker compose up -d
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run start:dev
```

### Frontend (React.js)

1. Instale as dependências:
```bash
npm install
```

2. Configure o ambiente:
   - Copie o arquivo `.env-example` para `.env`
   - Preencha as variáveis de ambiente necessárias

3. Inicie a aplicação:
```bash
npm run dev
```

## Fluxo de Utilização

### Para Lojistas

1. Realize o cadastro como usuário (lojista)
2. Faça login com email e senha
3. Acesse a página de pedidos
4. Utilize a opção "Registrar Produto" na barra de navegação para cadastrar produtos
5. Faça logout após cadastrar os produtos

### Para Compradores

1. Acesse a página inicial
2. Navegue pelos produtos disponíveis
3. Adicione produtos ao carrinho, escolhendo a quantidade desejada
4. Clique em "Adicionar ao Carrinho"
5. Na página de checkout:
   - Preencha seus dados pessoais
   - Revise os itens do carrinho
   - Clique em "Finalizar Compra"

## Recomendações

- Para melhor simulação do ambiente, utilize dados diferentes para lojista e comprador
- Verifique se todas as informações foram preenchidas corretamente antes de finalizar a compra

## Dicas de Desenvolvimento

- Verifique se o Docker está rodando antes de iniciar o backend
- Certifique-se de que todas as variáveis de ambiente estão configuradas corretamente
- Em caso de erros, verifique os logs do servidor e do cliente

## Suporte

Em caso de dúvidas ou problemas, consulte a documentação técnica ou entre em contato com a equipe de desenvolvimento.
