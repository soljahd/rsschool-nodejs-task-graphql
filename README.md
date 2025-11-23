## Assignment: Graphql

### Workflow for tests:  

A test ([[test-name].test.js](https://github.com/nosbog/rsschool-nodejs-task-graphql/tree/main/test/routes)) is considered failed if it is partially completed.  
Subsequent tests are considered failed if any previous test is failed.  

Steps to get started:  

1. Install dependencies: npm ci  
2. Create .env file (copy from .env.example): cp .env.example .env  
3. Create database.db file: touch ./prisma/database.db  
4. Apply database migrations: npx prisma migrate deploy  
5. Seed database: npx prisma db seed  
6. Start server: npm run start  

Useful things:  

- Database GUI: npx prisma studio  
- Reset database: npx prisma migrate reset (includes seeding)  
- Test REST API (Swagger): [::1]:8000/docs  
- Use a GraphQL [client](https://learning.postman.com/docs/sending-requests/graphql/graphql-overview/) with [introspection](https://graphql.org/learn/introspection/) support for testing.  
