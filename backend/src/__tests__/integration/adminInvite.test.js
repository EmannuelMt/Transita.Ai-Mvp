const request = require('supertest');
const app = require('../../app');
const AdminInvite = require('../../models/AdminInvite');
const admin = require('firebase-admin');
const emailService = require('../../services/EmailService');

jest.mock('../../services/EmailService');

describe('Admin Invite API', () => {
    let testUser;
    let adminUser;

    beforeEach(() => {
        // Mock do usuário admin
        adminUser = {
            uid: 'admin-123',
            email: 'admin@test.com',
            customClaims: { admin: true }
        };

        // Mock do usuário normal
        testUser = {
            uid: 'user-123',
            email: 'user@test.com',
            customClaims: {}
        };

        // Mock das funções do Firebase Admin
        admin.auth().verifyIdToken.mockImplementation((token) => {
            if (token === 'admin-token') return adminUser;
            if (token === 'user-token') return testUser;
            throw new Error('Invalid token');
        });

        admin.auth().getUser.mockImplementation((email) => {
            if (email === adminUser.email) return adminUser;
            if (email === testUser.email) return testUser;
            throw new Error('User not found');
        });
    });

    describe('POST /api/admin/invite', () => {
        test('should create invite as admin', async () => {
            emailService.sendAdminInvite.mockResolvedValue({ success: true });

            const response = await request(app)
                .post('/api/admin/invite')
                .set('Authorization', 'Bearer admin-token')
                .send({ email: 'newadmin@test.com' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Convite enviado com sucesso');

            // Verifica se o convite foi criado no banco
            const invite = await AdminInvite.findOne({ email: 'newadmin@test.com' });
            expect(invite).toBeTruthy();
            expect(invite.status).toBe('pending');
            expect(invite.invitedBy).toBe(adminUser.email);

            // Verifica se o email foi enviado
            expect(emailService.sendAdminInvite).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'newadmin@test.com'
                })
            );
        });

        test('should fail for non-admin users', async () => {
            const response = await request(app)
                .post('/api/admin/invite')
                .set('Authorization', 'Bearer user-token')
                .send({ email: 'newadmin@test.com' });

            expect(response.status).toBe(403);
        });

        test('should fail for invalid email', async () => {
            const response = await request(app)
                .post('/api/admin/invite')
                .set('Authorization', 'Bearer admin-token')
                .send({ email: 'invalid-email' });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeTruthy();
        });

        test('should not create duplicate pending invites', async () => {
            // Cria um convite pendente
            await AdminInvite.create({
                email: 'existing@test.com',
                token: 'test-token',
                invitedBy: adminUser.email,
                status: 'pending',
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
            });

            const response = await request(app)
                .post('/api/admin/invite')
                .set('Authorization', 'Bearer admin-token')
                .send({ email: 'existing@test.com' });

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/já existe um convite pendente/i);
        });
    });

    describe('GET /api/admin/invites', () => {
        beforeEach(async () => {
            // Cria alguns convites de teste
            await AdminInvite.create([
                {
                    email: 'test1@test.com',
                    token: 'token1',
                    invitedBy: adminUser.email,
                    status: 'pending',
                    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
                },
                {
                    email: 'test2@test.com',
                    token: 'token2',
                    invitedBy: adminUser.email,
                    status: 'accepted',
                    expiresAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
                    acceptedAt: new Date()
                }
            ]);
        });

        test('should list all invites for admin', async () => {
            const response = await request(app)
                .get('/api/admin/invites')
                .set('Authorization', 'Bearer admin-token');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0].token).toBeUndefined(); // Não deve expor o token
        });

        test('should fail for non-admin users', async () => {
            const response = await request(app)
                .get('/api/admin/invites')
                .set('Authorization', 'Bearer user-token');

            expect(response.status).toBe(403);
        });
    });

    describe('POST /api/admin/confirm-invite', () => {
        let validInvite;

        beforeEach(async () => {
            validInvite = await AdminInvite.create({
                email: testUser.email,
                token: 'valid-token',
                invitedBy: adminUser.email,
                status: 'pending',
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
            });
        });

        test('should confirm valid invite', async () => {
            emailService.sendWelcomeAdmin.mockResolvedValue({ success: true });

            const response = await request(app)
                .post('/api/admin/confirm-invite')
                .set('Authorization', 'Bearer user-token')
                .send({ token: 'valid-token' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Convite aceito com sucesso');

            // Verifica se o convite foi atualizado
            const updatedInvite = await AdminInvite.findById(validInvite._id);
            expect(updatedInvite.status).toBe('accepted');
            expect(updatedInvite.acceptedAt).toBeTruthy();

            // Verifica se o usuário recebeu a claim de admin
            expect(admin.auth().setCustomUserClaims).toHaveBeenCalledWith(
                testUser.uid,
                expect.objectContaining({ admin: true })
            );

            // Verifica se o email de boas-vindas foi enviado
            expect(emailService.sendWelcomeAdmin).toHaveBeenCalledWith(
                expect.objectContaining({ email: testUser.email })
            );
        });

        test('should fail for invalid token', async () => {
            const response = await request(app)
                .post('/api/admin/confirm-invite')
                .set('Authorization', 'Bearer user-token')
                .send({ token: 'invalid-token' });

            expect(response.status).toBe(404);
        });

        test('should fail for expired invite', async () => {
            await AdminInvite.findByIdAndUpdate(validInvite._id, {
                expiresAt: new Date(Date.now() - 1000)
            });

            const response = await request(app)
                .post('/api/admin/confirm-invite')
                .set('Authorization', 'Bearer user-token')
                .send({ token: 'valid-token' });

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/inválido ou expirado/i);
        });
    });

    describe('DELETE /api/admin/invites/:id', () => {
        let inviteToRevoke;

        beforeEach(async () => {
            inviteToRevoke = await AdminInvite.create({
                email: 'revoke@test.com',
                token: 'revoke-token',
                invitedBy: adminUser.email,
                status: 'pending',
                expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
            });
        });

        test('should revoke invite as admin', async () => {
            const response = await request(app)
                .delete(`/api/admin/invites/${inviteToRevoke._id}`)
                .set('Authorization', 'Bearer admin-token')
                .send({ reason: 'Test revocation' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Convite revogado com sucesso');

            const updatedInvite = await AdminInvite.findById(inviteToRevoke._id);
            expect(updatedInvite.status).toBe('revoked');
            expect(updatedInvite.metadata.notes).toContain('Test revocation');
        });

        test('should fail for non-admin users', async () => {
            const response = await request(app)
                .delete(`/api/admin/invites/${inviteToRevoke._id}`)
                .set('Authorization', 'Bearer user-token');

            expect(response.status).toBe(403);
        });

        test('should fail for non-existent invite', async () => {
            const response = await request(app)
                .delete('/api/admin/invites/nonexistent')
                .set('Authorization', 'Bearer admin-token');

            expect(response.status).toBe(404);
        });

        test('should fail for already accepted invite', async () => {
            await AdminInvite.findByIdAndUpdate(inviteToRevoke._id, {
                status: 'accepted',
                acceptedAt: new Date()
            });

            const response = await request(app)
                .delete(`/api/admin/invites/${inviteToRevoke._id}`)
                .set('Authorization', 'Bearer admin-token');

            expect(response.status).toBe(400);
            expect(response.body.message).toMatch(/apenas convites pendentes/i);
        });
    });
});