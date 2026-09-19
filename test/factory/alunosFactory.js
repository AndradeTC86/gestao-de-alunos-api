import { faker }from '@faker-js/faker'

export function novoAluno(){    
    const timestamp = Date.now()
    
    return {
        nome: faker.person.fullName(),
        email: `${faker.person.firstName().toLocaleLowerCase}.${timestamp}@mailinator.com`,
        matricula: `${timestamp}`,
        senha: faker.internet.password()
    }
}