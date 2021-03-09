const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

const customers = [];

// Middleware
function verifyIfExistsAccountCpf(request, response, next) {
  const { cpf } = request.headers;
  const customer = customers.find(customer => customer.cpf === cpf);

  if(!customer) {
    return response.status(400).json({ error: 'Customer not found!'})
  }

  // Adicionando novo parâmetro de request no middleware
  request.customer = customer;

  return next();
}

app.use(express.json());

app.post('/account', (request, response) => {
  const { name, cpf } = request.body;  

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if(customerAlreadyExists) {
    return response.status(400).json({ error: 'Customer already exists!'});
  }

  customers.push({
    id: uuidv4(),
    name,
    cpf,
    statement: [],
  });

  return response.status(201).send();
});

app.get('/statement', verifyIfExistsAccountCpf, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

app.listen(3333);