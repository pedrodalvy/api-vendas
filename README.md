# Projeto criado com o curso "_API Restful Javascript com Node.js, Typescript, TypeORM_" da Udemy
> Link do curso: https://www.udemy.com/course/api-restful-de-vendas

## Instalação
- Dependências: `yarn i`
- Servidor de desenvolvimento: `yarn dev`

## Estrutura do Projeto
- `config`: configurações de bibliotecas externas, como, por exemplo, autenticação, upload, email, etc.
- `modules`: abrangem as áreas de conhecimento da aplicação, diretamente relacionados com as regras de negócios.
- `shared`: módulos de uso geral compartilhados com mais de um módulo da aplicação, como por exemplo, o arquivo server.ts.
- `services`: estarão dentro de cada módulo da aplicação e serão responsáveis por todas as regras que a aplicação precisa atender.
