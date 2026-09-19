import { expect } from 'chai'
import { getAdminToken, getUserToken } from  './helpers/auth.js'
import { api } from './helpers/api.js'
import { novoAluno } from './factory/alunosFactory.js'
import { novaDisciplina } from './factory/disciplinasFactory.js'
import dadosTeste from './fixtures/e2e.json' with { type: 'json' }

describe('Alunos', () => {    
    for (const dadosTrabalho of dadosTeste.trabalhos) {
    it(`Deve cadastrar o trabalho "${dadosTrabalho.titulo}" para um aluno matriculado`, async () => {
        const aluno = novoAluno()
        const cadastroAlunoResposta = await api()
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', await getAdminToken())
        .send(aluno)
        expect(cadastroAlunoResposta.status).to.equal(201)                
        const idAluno = cadastroAlunoResposta.body.id        

        const cadastroDisciplinaResposta = await api()
        .post('/api/admin/disciplinas')
        .set('Content-Type', 'application/json')
        .set('Authorization', await getAdminToken())
        .send(novaDisciplina())
        expect(cadastroDisciplinaResposta.status).to.equal(201)        
        const idDisciplina = cadastroDisciplinaResposta.body.id

        const cadastroAlunoDisciplinaResposta = await api()
        .post(`/api/admin/disciplinas/${idDisciplina}/matriculas`)
        .set('Content-Type', 'application/json')
        .set('Authorization', await getAdminToken())
        .send({
                alunoId: idAluno
            })
        expect(cadastroAlunoDisciplinaResposta.status).to.equal(201)
        expect(cadastroAlunoDisciplinaResposta.body.alunoId).to.equal(idAluno)
        expect(cadastroAlunoDisciplinaResposta.body.disciplinaId).to.equal(idDisciplina)

        const cadastrarNotaDisciplina = await api()
        .post(`/api/alunos/${idAluno}/trabalhos`)
        .set('Content-Type', 'application/json')
        .set('Authorization', await getUserToken(aluno))
        .send({ disciplinaId: idDisciplina, ...dadosTrabalho })
        expect(cadastrarNotaDisciplina.status).to.equal(201)
        expect(cadastrarNotaDisciplina.body.alunoId).to.equal(idAluno)
        expect(cadastrarNotaDisciplina.body.disciplinaId).to.equal(idDisciplina)
    })
    }
})